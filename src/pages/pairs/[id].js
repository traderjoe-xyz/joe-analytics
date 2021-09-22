import {
  AppShell,
  AreaChart,
  BarChart,
  BasicTable,
  Chart,
  IntoTheBlock,
  KPI,
  Link,
  PageHeader,
  PairIcon,
  Percent,
  TokenIcon,
  Transactions,
} from "app/components";
import { Avatar, Box, Chip, Grid, Paper, Typography } from "@material-ui/core";
import {
  avaxPriceQuery,
  formatCurrency,
  formatDecimal,
  getApollo,
  getPair,
  pairDayDatasQuery,
  pairIdsQuery,
  pairQuery,
  transactionsQuery,
  useInterval,
} from "app/core";

import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { toChecksumAddress } from "web3-utils";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

/*
 * TODO: disabled IntoTheBlock window widget
 */

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  avatars: {
    marginRight: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  reserve: {
    marginRight: theme.spacing(1),
  },
  firstLink: {
    marginRight: theme.spacing(2),
  },
  pageHeader: {
    display: "block",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  links: {
    margin: theme.spacing(2, 0),
    [theme.breakpoints.up("sm")]: {
      margin: 0,
    },
  },
}));

function PairPage(props) {
  const router = useRouter();

  if (router.isFallback) {
    return <AppShell />;
  }

  const classes = useStyles();

  const id = router.query.id.toLowerCase();

  const FEE_RATE = 0.0025 // 0.25% of volume are fees

  const {
    data: { bundles },
  } = useQuery(avaxPriceQuery, {
    pollInterval: 60000,
  });

  const utc24HoursAgo = dayjs()
  .utc()
  .startOf('hour')
  .subtract(1, 'day')
  .unix()

  const {
    data: { pair },
  } = useQuery(pairQuery, {
    query: pairQuery,
    variables: { id },
  });

  useInterval(async () => {
    await getPair(id);
  }, 60000);

  const { data: transactions } = useQuery(transactionsQuery, {
    variables: { pairAddresses: [id] },
    pollInterval: 60000,
  });

  const {
    data: { pairDayDatas },
  } = useQuery(pairDayDatasQuery, {
    variables: {
      pairs: [id],
    },
    pollInterval: 60000,
  });

  /*
    Note: Today refers to the last 24 hours from the User's current time, Yesterday refers to 48 hours ago to 24 hours ago
  */
  let volumeToday = 0;
  let volumeYesterday = 0;
  let txCountToday = 0;
  let txCountYesterday = 0;
  let reserveToday = pair.hourData && pair.hourData[0] ? Number(pair.hourData[0].reserveUSD) : 0;
  let reserveYesterday = pair.hourData && pair.hourData[24] ? Number(pair.hourData[24].reserveUSD) : 0;

  for (let i = 0; i < pair.hourData?.length; i++) {
    const volumeForHour = pair.hourData && pair.hourData[i] ? Number(pair.hourData[i].volumeUSD) : 0
    const txCountForHour = pair.hourData && pair.hourData[i] ? Number(pair.hourData[i].txCount) : 0
    const date = pair.hourData && pair.hourData[i] ? Number(pair.hourData[i].date) : 0
    if (date && date >= utc24HoursAgo) {
      volumeToday += volumeForHour
      txCountToday += txCountForHour
    } else {
      volumeYesterday += volumeForHour
      txCountYesterday += txCountForHour
    }
  }

  const volumeChange = ((volumeToday - volumeYesterday) / volumeYesterday) * 100;

  const fees = volumeToday * FEE_RATE;

  const feesYesterday = volumeYesterday * FEE_RATE;

  const avgTradePriceToday = volumeToday / (txCountToday);

  const avgTradePriceYesturday =
    volumeYesterday / (txCountYesterday);

  const avgTradePriceChange =
    ((avgTradePriceToday - avgTradePriceYesturday) / avgTradePriceYesturday) * 100;

  const utilisationToday = (volumeToday / reserveToday) * 100;

  const utilisationYesterday = (volumeYesterday / reserveYesterday) * 100;

  const utilisationChange =
    ((utilisationToday - utilisationYesterday) / utilisationYesterday) * 100;

  const txChange = ((txCountToday - txCountYesterday) / txCountYesterday) * 100;

  const chartDatas = pairDayDatas.reduce(
    (previousValue, currentValue) => {
      const untrackedVolumeUSD =
        currentValue?.token0.derivedAVAX * currentValue?.volumeToken0 +
        currentValue?.token1.derivedAVAX *
          currentValue?.volumeToken1 *
          bundles[0].avaxPrice;

      const volumeUSD =
        currentValue?.volumeUSD === "0"
          ? untrackedVolumeUSD
          : currentValue?.volumeUSD;

      previousValue["liquidity"].unshift({
        date: currentValue.date,
        value: parseFloat(currentValue.reserveUSD),
      });
      previousValue["volume"].unshift({
        date: currentValue.date,
        value: parseFloat(volumeUSD),
      });
      return previousValue;
    },
    { liquidity: [], volume: [] }
  );

  // console.log(pair);

  return (
    <AppShell>
      <Head>
        <title>
          {pair.token0.symbol}-{pair.token1.symbol} | Trader Joe Analytics
        </title>
      </Head>
      <PageHeader>
        <Box display="flex" alignItems="center" className={classes.pageHeader}>
          <Box display="flex" alignItems="center" flex={1} flexWrap="nowrap">
            <PairIcon base={pair.token0.id} quote={pair.token1.id} />
            <Typography variant="h5" component="h1" noWrap>
              {pair.token0.symbol}-{pair.token1.symbol}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" className={classes.links}>
            <Link
              href={`https://traderjoexyz.com/#/pool/${pair.token0.id}/${pair.token1.id}`}
              target="_blank"
              variant="body1"
              className={classes.firstLink}
            >
              Add Liquidity
            </Link>
            <Link
              href={`https://traderjoexyz.com/#/trade`}
              target="_blank"
              variant="body1"
            >
              Trade
            </Link>
          </Box>
        </Box>
      </PageHeader>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" className={classes.paper}>
            <Box display="flex" alignItems="center">
              <TokenIcon className={classes.avatar} id={pair.token0.id} />
              <Typography
                variant="h6"
                color="textPrimary"
                noWrap
                className={classes.reserve}
              >
                {formatDecimal(pair.reserve0)}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" noWrap>
                {pair.token0.symbol}
              </Typography>
            </Box>
            <Typography variant="body2">
              {`1 ${pair.token0.symbol} = ${formatDecimal(
                pair.reserve1 / pair.reserve0
              )} ${pair.token1.symbol} (${formatCurrency(
                pair.token0?.derivedAVAX * bundles[0].avaxPrice
              )})`}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper variant="outlined" className={classes.paper}>
            <Box display="flex" alignItems="center">
              <TokenIcon className={classes.avatar} id={pair.token1.id} />
              <Typography
                variant="h6"
                color="textPrimary"
                noWrap
                className={classes.reserve}
              >
                {formatDecimal(pair.reserve1)}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary" noWrap>
                {pair.token1.symbol}{" "}
              </Typography>
            </Box>
            <Typography variant="body2">
              {`1 ${pair.token1.symbol} = ${formatDecimal(
                pair.reserve0 / pair.reserve1
              )} ${pair.token0.symbol} (${formatCurrency(
                pair.token1?.derivedAVAX * bundles[0].avaxPrice
              )})`}
            </Typography>
          </Paper>
        </Grid>

        {chartDatas.liquidity.length > 1 ? (
          <Grid item xs={12} md={6}>
            <Paper
              variant="outlined"
              style={{ height: 300, position: "relative" }}
            >
              <ParentSize>
                {({ width, height }) => (
                  <AreaChart
                    title="Liquidity"
                    data={chartDatas.liquidity}
                    margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                    width={width}
                    height={height}
                    tooltipDisabled
                    overlayEnabled
                  />
                )}
              </ParentSize>
            </Paper>
          </Grid>
        ) : null}
        {chartDatas.liquidity.length > 1 ? (
          <Grid item xs={12} md={6}>
            <Paper
              variant="outlined"
              style={{ height: 300, position: "relative" }}
            >
              <ParentSize>
                {({ width, height }) => (
                  <BarChart
                    title="Volume"
                    data={chartDatas.volume}
                    width={width}
                    height={height}
                    margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                    tooltipDisabled
                    overlayEnabled
                  />
                )}
              </ParentSize>
            </Paper>
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6} md={4}>
          <KPI
            title="Liquidity (24h)"
            value={pair?.reserveUSD}
            difference={
              ((reserveToday - reserveYesterday) /
                reserveToday) *
              100
            }
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPI
            title="Volume (24h)"
            value={volumeToday}
            difference={volumeChange}
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPI
            title="Fees (24h)"
            value={fees}
            // difference={
            //   100 *
            //   Math.abs((fees - feesYesterday) / ((fees + feesYesterday) / 2))
            // }
            difference={((fees - feesYesterday) / feesYesterday) * 100}
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPI
            title="Tx (24h)"
            value={txCountToday}
            difference={txChange}
            format="integer"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPI
            title="Avg. Trade (24h)"
            value={avgTradePriceToday}
            difference={avgTradePriceChange}
            format="currency"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <KPI
            title="Utilisation (24h)"
            value={utilisationToday}
            difference={utilisationChange}
            format="percent"
          />
        </Grid>
      </Grid>

      <Box my={4}>
        <BasicTable
          title="Information"
          headCells={[
            {
              key: "id",
              label: `${pair.token0.symbol}-${pair.token1.symbol} Address`,
              maxWidth: "250px",
            },
            {
              key: "token0",
              label: `${pair.token0.symbol} Address`,
              maxWidth: "250px",
            },
            {
              key: "token1",
              label: `${pair.token1.symbol} Address`,
              maxWidth: "250px",
            },
            { key: "etherscan", label: "Explorer", align: "right" },
          ]}
          bodyCells={[
            <Typography variant="body2" noWrap>
              {pair.id}
            </Typography>,
            <Typography variant="body2" noWrap>
              {pair.token0.id}
            </Typography>,
            <Typography variant="body2" noWrap>
              {pair.token1.id}
            </Typography>,
            <Link
              href={`https://cchain.explorer.avax.network/address/${pair.id}`}
            >
              View
            </Link>,
          ]}
        />
      </Box>
      {/* <Box my={4}>
        <IntoTheBlock pairAddress={pair.id} />
      </Box> */}
      <Box my={4}>
        <Transactions transactions={transactions} txCount={pair.txCount} />
      </Box>
    </AppShell>
  );
}

export async function getStaticProps({ params }) {
  const client = getApollo();

  const id = params.id.toLowerCase();

  // AvaxPrice
  await client.query({
    query: avaxPriceQuery,
  });

  await getPair(id, client);

  await client.query({
    query: pairDayDatasQuery,
    variables: {
      pairs: [id],
    },
  });

  await client.query({
    query: transactionsQuery,
    variables: {
      pairAddresses: [id],
    },
  });

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  // const apollo = getApollo();

  // const { data } = await apollo.query({
  //   query: pairIdsQuery,
  // });

  // const paths = data.pairs.map((pair) => ({
  //   params: { id: pair.id },
  // }));

  return { paths: [], fallback: true };
}

export default PairPage;
