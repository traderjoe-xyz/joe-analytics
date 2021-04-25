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

import { JOE_TOKEN_ADDDRESS } from "../../config/index.ts";

import BarMetrics from "../../components/BarMetrics"
import { print } from 'graphql/language/printer'

const FEE_RATE = 0.0005 // 0.05% 

const useStyles = makeStyles((theme) => ({
  charts: {
    flexGrow: 1,
    marginBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
  },
}));

function BarPage() {
  console.log("[BarPage] ")

  const classes = useStyles();

  const theme = useTheme();

  const {
    data: { bar },
  } = useQuery(barQuery, {
    context: {
      clientName: "bar",
    },
  });

  // const {
  //   data: { histories },
  // } = useQuery(barHistoriesQuery, {
  //   context: {
  //     clientName: "bar",
  //   },
  // });

  // const {
  //   data: { factory },
  // } = useQuery(factoryQuery);

  // const token_address = JOE_TOKEN_ADDDRESS
  // const {
  //   data: { token },
  // } = useQuery(tokenQuery, {
  //   variables: {
  //     id: token_address,
  //   },
  // });

  // const {
  //   data: { bundles },
  // } = useQuery(avaxPriceQuery);

  // const {
  //   data: { dayDatas },
  // } = useQuery(dayDatasQuery);

  // const joePrice =
  //   parseFloat(token?.derivedAVAX) * parseFloat(bundles[0].avaxPrice);

  useInterval(async () => {
    await Promise.all([
      getBar,
      // getBarHistories,
      // getDayData,
      // getFactory,
      // getJoeToken,
      // getAvaxPrice,
    ]);
  }, 60000);

  // const {
  //   joeStakedUSD,
  //   joeHarvestedUSD,
  //   xJoeMinted,
  //   xJoeBurned,
  //   xJoe,
  //   apr,
  //   apy,
  //   fees,
  // } = histories.reduce(
  //   (previousValue, currentValue) => {
  //     const date = currentValue.date * 1000;
  //     const dayData = dayDatas.find((d) => d.date === currentValue.date);
  //     previousValue["joeStakedUSD"].push({
  //       date,
  //       value: parseFloat(currentValue.joeStakedUSD),
  //     });
  //     previousValue["joeHarvestedUSD"].push({
  //       date,
  //       value: parseFloat(currentValue.joeHarvestedUSD),
  //     });

  //     previousValue["xJoeMinted"].push({
  //       date,
  //       value: parseFloat(currentValue.xJoeMinted),
  //     });
  //     previousValue["xJoeBurned"].push({
  //       date,
  //       value: parseFloat(currentValue.xJoeBurned),
  //     });
  //     previousValue["xJoe"].push({
  //       date,
  //       value: parseFloat(currentValue.xJoeSupply),
  //     });
  //     const apr =
  //       (((dayData.volumeUSD * 0.05 * 0.01) / currentValue.xJoeSupply) *
  //         365) /
  //       (currentValue.ratio * joePrice);
  //     previousValue["apr"].push({
  //       date,
  //       value: parseFloat(apr * 100),
  //     });
  //     previousValue["apy"].push({
  //       date,
  //       value: parseFloat((Math.pow(1 + apr / 365, 365) - 1) * 100),
  //     });
  //     previousValue["fees"].push({
  //       date,
  //       value: parseFloat(dayData.volumeUSD * FEE_RATE),
  //     });
  //     return previousValue;
  //   },
  //   {
  //     joeStakedUSD: [],
  //     joeHarvestedUSD: [],
  //     xJoeMinted: [],
  //     xJoeBurned: [],
  //     xJoe: [],
  //     apr: [],
  //     apy: [],
  //     fees: [],
  //   }
  // );

  // const apyAvg =
  //   apy.reduce((previousValue, currentValue) => {
  //     return previousValue + currentValue.value;
  //   }, 0) / apy.length;

  // console.log("[bar] factory: " + JSON.stringify(factory))
  // const oneDayVolume = factory.volumeUSD - factory.oneDay.volumeUSD;

  // console.log("[bar] bar: " + JSON.stringify(bar))
  // const APR = bar === null ? 0 : 
  //   (((oneDayVolume * 0.05 * 0.01) / bar?.totalSupply) * 365) /
  //   (bar?.ratio * joePrice); 

  // const apyDay = Math.pow(1 + APR / 365, 365) - 1 * 100;


  const apyDay = 0.7
  const apyAvg = 0.3
  const totalSupply = bar?.totalSupply || 0
  const ratio = bar?.ratio || 0

  const metrics = {
    apyDay,
    apyAvg,
    totalSupply,
    ratio
  }
  console.log("[bar] bar: " + JSON.stringify(bar))
  console.log("[bar] metrics: " + JSON.stringify(metrics))



  return (
    <AppShell>
      <Head>
        <title>Joe Bar | JoeSwap Analytics</title>
      </Head>

      <Grid container spacing={3}>
        <BarMetrics metrics={metrics} />
      </Grid>
    </AppShell>
  );
}

export async function getStaticProps() {
  const client = getApollo();
  await getBar(client);
  // await getBarHistories(client);
  // await getFactory(client);
  // await getDayData(client);
  // await getJoeToken(client);
  // await getAvaxPrice(client);
  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}

export default BarPage;
