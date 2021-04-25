import { AppShell, Curves, KPI } from "app/components";
import { Grid, Paper, useTheme } from "@material-ui/core";
import {
  barHistoriesQuery,
  barQuery,
  dayDatasQuery,
  avaxPriceQuery,
  factoryQuery,
  getApollo,
  getBar,
  getBarHistories,
  getDayData,
  getAvaxPrice,
  getFactory,
  getJoeToken,
  tokenQuery,
  useInterval,
} from "app/core";

import Chart from "../../components/Chart";
import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/client";
import { JOE_TOKEN_ADDDRESS } from "config";

const FEE_RATE = 0.0005 // 0.05% 

const useStyles = makeStyles((theme) => ({
  charts: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    // textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function BarPage() {
  const classes = useStyles();

  const theme = useTheme();

  const {
    data: { bar },
  } = useQuery(barQuery, {
    context: {
      clientName: "bar",
    },
  });

  const {
    data: { histories },
  } = useQuery(barHistoriesQuery, {
    context: {
      clientName: "bar",
    },
  });

  const {
    data: { factory },
  } = useQuery(factoryQuery);

  const {
    data: { token },
  } = useQuery(tokenQuery, {
    variables: {
      id: JOE_TOKEN_ADDDRESS,
    },
  });

  const {
    data: { bundles },
  } = useQuery(avaxPriceQuery);

  const {
    data: { dayDatas },
  } = useQuery(dayDatasQuery);

  const joePrice =
    parseFloat(token?.derivedAVAX) * parseFloat(bundles[0].avaxPrice);

  useInterval(async () => {
    await Promise.all([
      getBar,
      getBarHistories,
      getDayData,
      getFactory,
      getJoeToken,
      getAvaxPrice,
    ]);
  }, 60000);

  const {
    joeStakedUSD,
    joeHarvestedUSD,
    xJoeMinted,
    xJoeBurned,
    xJoe,
    apr,
    apy,
    fees,
  } = histories.reduce(
    (previousValue, currentValue) => {
      const date = currentValue.date * 1000;
      const dayData = dayDatas.find((d) => d.date === currentValue.date);
      previousValue["joeStakedUSD"].push({
        date,
        value: parseFloat(currentValue.joeStakedUSD),
      });
      previousValue["joeHarvestedUSD"].push({
        date,
        value: parseFloat(currentValue.joeHarvestedUSD),
      });

      previousValue["xJoeMinted"].push({
        date,
        value: parseFloat(currentValue.xJoeMinted),
      });
      previousValue["xJoeBurned"].push({
        date,
        value: parseFloat(currentValue.xJoeBurned),
      });
      previousValue["xJoe"].push({
        date,
        value: parseFloat(currentValue.xJoeSupply),
      });
      const apr =
        (((dayData.volumeUSD * 0.05 * 0.01) / currentValue.xJoeSupply) *
          365) /
        (currentValue.ratio * joePrice);
      previousValue["apr"].push({
        date,
        value: parseFloat(apr * 100),
      });
      previousValue["apy"].push({
        date,
        value: parseFloat((Math.pow(1 + apr / 365, 365) - 1) * 100),
      });
      previousValue["fees"].push({
        date,
        value: parseFloat(dayData.volumeUSD * FEE_RATE),
      });
      return previousValue;
    },
    {
      joeStakedUSD: [],
      joeHarvestedUSD: [],
      xJoeMinted: [],
      xJoeBurned: [],
      xJoe: [],
      apr: [],
      apy: [],
      fees: [],
    }
  );

  console.log(`[bar] apys: ${JSON.stringify(apy)}`)
  console.log(`[bar] factory: ${JSON.stringify(factory)}`)
  console.log(`[bar] joeStaked: ${JSON.stringify(joeStakedUSD)}`)
  console.log(`[bar] joeHarvested: ${JSON.stringify(joeHarvestedUSD)}`)
  console.log(`[bar] xJoe: ${JSON.stringify(xJoe)}`)
  console.log(`[bar] fees: ${JSON.stringify(fees)}`)
      
  const oneDayVolume = factory.oneDay.volumeUSD
  const oneDayFees = oneDayVolume * FEE_RATE
  const yearFees = oneDayFees * 365
  const totalStakedUSD = bar.joeStaked * joePrice

  const APR = yearFees / totalStakedUSD
  const APY = Math.pow(1 + APR / 365, 365) - 1;

  console.log(`[bar] APR: ${APR}, APY: ${APY}, JoePrice: ${joePrice}`)

  return (
    <AppShell>
      <Head>
        <title>Joe Bar | Trader Joe Analytics</title>
      </Head>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="Total Staked" value={totalStakedUSD} format="currency" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="Joe Price" value={joePrice} format="currency" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="Fees (24H)" value={oneDayFees} format="currency" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="APY (24H)" value={APY} format="percent" />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[apy, apr]}
                  labels={["APY", "APR"]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  title="Fees received (USD)"
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[fees]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  data={[joeStakedUSD, joeHarvestedUSD]}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  labels={["Joe Staked (USD)", "Joe Harvested (USD)"]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[xJoeMinted, xJoeBurned]}
                  labels={["xJoe Minted", "xJoe Burned"]}
                />
              )}
            </ParentSize>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper
            variant="outlined"
            style={{ display: "flex", height: 400, flex: 1 }}
          >
            <ParentSize>
              {({ width, height }) => (
                <Curves
                  width={width}
                  height={height}
                  title="xJoe Total Supply"
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[xJoe]}
                />
              )}
            </ParentSize>
          </Paper>

        </Grid>
      </Grid>

    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();
  await getBar(client);
  await getBarHistories(client);
  await getFactory(client);
  await getDayData(client);
  await getJoeToken(client);
  await getAvaxPrice(client);
  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}

export default BarPage;
