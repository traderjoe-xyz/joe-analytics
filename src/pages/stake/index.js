import { AppShell, Curves, KPI, RemittanceTable } from "app/components";
import { Grid, Paper } from "@material-ui/core";
import {
  barHistoriesQuery,
  dayDatasQuery,
  avaxPriceQuery,
  factoryQuery,
  getApollo,
  getBarHistories,
  getDayData,
  getAvaxPrice,
  getFactory,
  getJoeToken,
  tokenQuery,
  useInterval,
  stableJoeQuery,
  getStableJoe,
  getMoneyMaker,
  moneyMakerQuery,
  getMoneyMakerDayDatas,
  moneyMakerDayDatasQuery,
  getStableJoeDayDatas,
  stableJoeDayDatasQuery,
  getRemittances,
  remittancesQuery,
} from "app/core";

import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import React from "react";
import { useQuery } from "@apollo/client";
import { JOE_TOKEN_ADDDRESS } from "config";
import dayjs from "dayjs";

const FEE_RATE = 0.0005; // 0.05%

function BarPage() {
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

  const {
    data: { stableJoe },
  } = useQuery(stableJoeQuery)

  const {
    data: { stableJoeDayDatas },
  } = useQuery(stableJoeDayDatasQuery)

  const {
    data: { moneyMaker },
  } = useQuery(moneyMakerQuery)

  const {
    data: { dayDatas: moneyMakerDayDatas },
  } = useQuery(moneyMakerDayDatasQuery)

  const {
    data: { remits: remittances },
  } = useQuery(remittancesQuery)

  const joePrice =
    parseFloat(token?.derivedAVAX) * parseFloat(bundles[0].avaxPrice);

  useInterval(async () => {
    await Promise.all([
      getFactory,
      getJoeToken,
      getAvaxPrice,
      getBarHistories,
      getDayData,
      getStableJoe,
      getMoneyMaker,
      getMoneyMakerDayDatas,
      getStableJoeDayDatas,
    ]);
  }, 1800000);

  // APR chart
  const apr = moneyMakerDayDatas.reduce(
    (previousValue, currentValue) => {
      const date = currentValue.date;
      const stableJoeDayData = stableJoeDayDatas.find((d) => d.date == currentValue.date);
      const moneyMakerDayData = moneyMakerDayDatas.find((d) => d.date === currentValue.date);
      const usdRemitted = moneyMakerDayData?.usdRemitted ?? 0;
      const joeStaked = stableJoeDayData?.totalJoeStaked ?? 0;
      const apr = (usdRemitted * 365) / (joeStaked * joePrice);
      previousValue.push({
        date,
        value: parseFloat(apr * 100),
      });
      return previousValue;
    },
    []
  ).reverse();
  
  // Fees chart
  const fees = histories.reduce(
    (previousValue, currentValue) => {
      const date = currentValue.date;
      const dayData = dayDatas.find((d) => d.date === currentValue.date);
      previousValue.push({
        date,
        value: parseFloat(dayData?.volumeUSD * FEE_RATE),
      });
      return previousValue;
    },
    []
  );

  // Total Staked
  const totalStakedUSD = stableJoe.joeStaked * joePrice;

  // Fees (24H)
  const oneDayVolume = factory?.volumeUSD - factory?.oneDay.volumeUSD;
  const oneDayFees = oneDayVolume * FEE_RATE;

  // APR (7D)
  const utcSevenDayBack = dayjs()
    .startOf('day')
    .subtract(7, 'day')
    .unix()
  const sevenDayMoneyMakerDayDatas = moneyMakerDayDatas.filter((data) => data.date >= utcSevenDayBack)
  const sevenDayLength = sevenDayMoneyMakerDayDatas.length
  const sevenDayUsdRemitted = sevenDayMoneyMakerDayDatas.reduce((sum, cur) => {
    return sum + (cur.usdRemitted ? Number(cur.usdRemitted) : 0)
  }, 0)
  const sevenDayAPR = ((sevenDayUsdRemitted / sevenDayLength) * 365) / totalStakedUSD

  // APR (24H)
  const utcOneDayBack = dayjs().startOf('day').subtract(1, 'day').unix()
  const oneDayMoneyMakerDayDatas = moneyMakerDayDatas.filter((data) => data.date >= utcOneDayBack)
  const oneDayLength = oneDayMoneyMakerDayDatas.length
  const oneDayUsdRemitted = oneDayMoneyMakerDayDatas.reduce((sum, cur) => {
    return sum + (cur.usdRemitted ? Number(cur.usdRemitted) : 0)
  }, 0)
  const oneDayAPR = ((oneDayUsdRemitted / oneDayLength) * 365) / totalStakedUSD;
  
  return (
    <AppShell>
      <Head>
        <title>Joe Stake | Trader Joe Analytics</title>
      </Head>

      <Grid container spacing={3} style={{ marginBottom: "10px" }}>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <KPI
                title="Total Staked"
                value={totalStakedUSD}
                format="currency"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="Fees (24H)" value={oneDayFees} format="currency" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="APR (24H)" value={oneDayAPR * 100} format="percent" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KPI title="APR (7D)" value={sevenDayAPR * 100} format="percent" />
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
                  title="APR"
                  margin={{ top: 64, right: 32, bottom: 0, left: 64 }}
                  data={[apr]}
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
      </Grid>
      <RemittanceTable remittances={remittances} orderBy="timestamp" orderDirection="desc" rowsPerPage={10} />
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();
  await getBarHistories(client);
  await getFactory(client);
  await getDayData(client);
  await getJoeToken(client);
  await getAvaxPrice(client);
  await getMoneyMaker(client);
  await getStableJoe(client);
  await getMoneyMakerDayDatas(client);
  await getStableJoeDayDatas(client);
  await getRemittances(client);
  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1800,
  };
}

export default BarPage;
