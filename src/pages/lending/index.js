import { useInterval, currencyFormatter, decimalFormatter } from "app/core";
import { AppShell, BarChart, AreaChart } from "app/components";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  List,
  ListItem,
  Box,
  Paper,
} from "@material-ui/core";
import { ParentSize } from "@visx/responsive";
import { withStyles } from "@material-ui/core/styles";
import TokenIcon from "../../components/TokenIcon";
import BorrowBar from "../../components/BorrowBar";
import SupplyBar from "../../components/SupplyBar";

import MarketTable from "../../components/MarketTable";

import {
  marketsQuery,
  allMarketDayDatasQuery,
  allLiquidationDayDatasQuery,
} from "app/core";

import { getMarkets } from "app/core/api";

import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

function LendingsPage() {
  //Styled Components
  const SupplyText = withStyles({
    root: {
      color: "#ffe7ac",
    },
  })(Typography);

  const BorrowText = withStyles({
    root: {
      color: "#B2DFDB",
    },
  })(Typography);

  const SmallTokenIcon = withStyles({
    root: {
      width: "25px",
      height: "25px",
      marginRight: "10px",
    },
  })(TokenIcon);

  const {
    data: { markets },
  } = useQuery(marketsQuery);

  const {
    data: { liquidationDayDatas },
  } = useQuery(allLiquidationDayDatasQuery);

  const {
    data: { marketDayDatas },
  } = useQuery(allMarketDayDatasQuery);

  let mergedLiquidationDayDatas = [];

  liquidationDayDatas.forEach((data) => {
    let existing = mergedLiquidationDayDatas.filter(
      (pastData) => pastData.date == data.date
    );
    if (existing.length) {
      let existingIndex = mergedLiquidationDayDatas.indexOf(existing[0]);
      mergedLiquidationDayDatas[
        existingIndex
      ].underlyingCollateralSeizedAmountUSD =
        Number(
          mergedLiquidationDayDatas[existingIndex]
            .underlyingCollateralSeizedAmountUSD
        ) + Number(data.underlyingCollateralSeizedAmountUSD);
    } else {
      data = {
        date: data.date,
        underlyingCollateralSeizedAmountUSD: Number(
          data.underlyingCollateralSeizedAmountUSD
        ),
      };
      mergedLiquidationDayDatas.push(data);
    }
  });

  const liquidationChartDatas = mergedLiquidationDayDatas.reduce(
    (previousValue, currentValue) => {
      previousValue["underlyingCollateralSeizedAmountUSD"].unshift({
        date: currentValue.date,
        value:
          parseFloat(currentValue.underlyingCollateralSeizedAmountUSD) || 0,
      });
      return previousValue || 0;
    },
    { underlyingCollateralSeizedAmountUSD: [] }
  );

  let mergedMarketDayDatas = [];

  marketDayDatas.forEach((data) => {
    let existing = mergedMarketDayDatas.filter(function (pastData, i) {
      return pastData.date == data.date;
    });
    if (existing.length) {
      let existingIndex = mergedMarketDayDatas.indexOf(existing[0]);
      mergedMarketDayDatas[existingIndex].totalSupplyUSD =
        Number(mergedMarketDayDatas[existingIndex].totalSupplyUSD) +
        Number(data.totalSupplyUSD);
      mergedMarketDayDatas[existingIndex].totalBorrowsUSD =
        Number(mergedMarketDayDatas[existingIndex].totalBorrowsUSD) +
        Number(data.totalBorrowsUSD);
      mergedMarketDayDatas[existingIndex].totalReservesUSD =
        Number(mergedMarketDayDatas[existingIndex].totalReservesUSD) +
        Number(data.totalReservesUSD);
    } else {
      data = {
        date: data.date,
        totalSupplyUSD: Number(data.totalSupplyUSD),
        totalBorrowsUSD: Number(data.totalBorrowsUSD),
        totalReservesUSD: Number(data.totalReservesUSD),
      };
      mergedMarketDayDatas.push(data);
    }
  });

  mergedMarketDayDatas = mergedMarketDayDatas.sort((a, b) =>
    Number(a.date) > Number(b.date) ? 1 : -1
  );

  let cumulativeBorrowsUSD = [];
  let cumulativeSupplyUSD = [];
  let cumulativeReservesUSD = [];

  mergedMarketDayDatas.forEach((data, index) => {
    cumulativeSupplyUSD.push({
      date: data.date,
      value: Number(data.totalSupplyUSD),
    });
    cumulativeBorrowsUSD.push({
      date: data.date,
      value: Number(data.totalBorrowsUSD),
    });
    cumulativeReservesUSD.push({
      date: data.date,
      value: Number(data.totalReservesUSD),
    });
  });

  const marketChartDatas = {
    cumulativeBorrowsUSD,
    cumulativeSupplyUSD,
    cumulativeReservesUSD,
  };

  useInterval(async () => {
    await Promise.all([getMarkets]);
  }, 60000);

  let totalBorrowsUSD = 0;
  let totalSupplyUSD = 0;
  markets.forEach((market) => {
    totalBorrowsUSD +=
      Number(market.totalBorrows * market.underlyingPriceUSD) || 0;
    totalSupplyUSD +=
      Number(
        market.totalSupply * market.exchangeRate * market.underlyingPriceUSD
      ) || 0;
    totalReservesUSD +=
      Number(market.reserves * market.underlyingPriceUSD) || 0;
    totalBorrows += Number(market.totalBorrows) || 0;
    totalSupply += Number(market.totalSupply) || 0;
    totalReserves += Number(market.reserves) || 0;
  });

  const topSupplyMarkets = [...markets]
    .sort((a, b) =>
      Number(a.totalSupply * a.exchangeRate * a.underlyingPriceUSD) <
      Number(b.totalSupply * b.exchangeRate * b.underlyingPriceUSD)
        ? 1
        : -1
    )
    .slice(0, 3);
  const topBorrowMarkets = [...markets]
    .sort((a, b) =>
      Number(a.totalBorrows * a.underlyingPriceUSD) <
      Number(b.totalBorrows * b.underlyingPriceUSD)
        ? 1
        : -1
    )
    .slice(0, 3);

  return (
    <AppShell>
      <Head>
        <title>Lending | Trader Joe Analytics</title>
      </Head>
      <Grid container spacing={6} style={{ marginBottom: "10px" }}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" style={{ backgroundColor: "#2b281e" }}>
            <CardContent>
              <Typography
                variant="subtitle2"
                component="div"
                style={{ color: "white" }}
              >
                Total Supply
              </Typography>
              <SupplyText variant="h4">
                {currencyFormatter.format(totalSupplyUSD)}
              </SupplyText>
            </CardContent>
            <CardContent>
              <Typography style={{ color: "white" }}>Top 3 Markets</Typography>
              <List
                sx={{
                  width: "100%",
                  maxWidth: 360,
                  bgcolor: "background.paper",
                }}
              >
                {topSupplyMarkets.map((market) => {
                  return (
                    <ListItem style={{ width: "100%" }} alignItems="flex-start">
                      <Box
                        style={{ width: "100%" }}
                        display="flex"
                        alignItems="center"
                      >
                        <Box
                          style={{ minWidth: "80px" }}
                          display="flex"
                          alignItems="center"
                          mr={3}
                        >
                          <SmallTokenIcon id={market.underlyingAddress} />
                          <Typography
                            variant="body2"
                            style={{ color: "white" }}
                          >
                            {market.underlyingSymbol}
                          </Typography>
                        </Box>
                        <SupplyBar
                          style={{ width: "100%" }}
                          value={
                            (Number(
                              market.totalSupply *
                                market.exchangeRate *
                                market.underlyingPriceUSD
                            ) /
                              totalSupplyUSD) *
                            100
                          }
                        />
                        <Box style={{ minWidth: "80px" }} ml={3}>
                          <Typography style={{ color: "white" }}>
                            {" "}
                            {decimalFormatter.format(
                              (
                                Number(
                                  (market.totalSupply *
                                    market.exchangeRate *
                                    market.underlyingPriceUSD) /
                                    totalSupplyUSD
                                ) * 100
                              ).toFixed(2)
                            )}
                            %{" "}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" style={{ backgroundColor: "#1e2738" }}>
            <CardContent>
              <Typography
                variant="subtitle2"
                component="div"
                style={{ color: "white" }}
              >
                Total Borrows
              </Typography>
              <BorrowText variant="h4">
                {currencyFormatter.format(totalBorrowsUSD)}
              </BorrowText>
            </CardContent>
            <CardContent>
              <Typography ml={3} style={{ color: "white" }}>
                Top 3 Markets
              </Typography>
              <List style={{ width: "100%" }}>
                {topBorrowMarkets.map((market) => {
                  return (
                    <ListItem style={{ width: "100%" }} alignItems="flex-start">
                      <Box
                        style={{ width: "100%" }}
                        display="flex"
                        alignItems="center"
                      >
                        <Box
                          style={{ minWidth: "80px" }}
                          display="flex"
                          alignItems="center"
                          mr={3}
                        >
                          <SmallTokenIcon id={market.underlyingAddress} />
                          <Typography
                            variant="body2"
                            style={{ color: "white" }}
                          >
                            {market.underlyingSymbol}
                          </Typography>
                        </Box>
                        <BorrowBar
                          style={{ width: "100%" }}
                          value={
                            (Number(
                              market.totalBorrows * market.underlyingPriceUSD
                            ) /
                              totalBorrowsUSD) *
                            100
                          }
                        />
                        <Box style={{ minWidth: "80px" }} ml={3}>
                          <Typography style={{ color: "white" }}>
                            {" "}
                            {decimalFormatter.format(
                              (
                                Number(
                                  (market.totalBorrows *
                                    market.underlyingPriceUSD) /
                                    totalBorrowsUSD
                                ) * 100
                              ).toFixed(2)
                            )}
                            %{" "}
                          </Typography>
                        </Box>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6} style={{ paddingBottom: "0" }}>
          <Paper
            variant="outlined"
            style={{
              height: 300,
              marginTop: "30px",
              marginBottom: "40px",
              position: "relative",
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  title="Total Supply"
                  data={marketChartDatas.cumulativeSupplyUSD}
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
        <Grid item xs={12} md={6} style={{ paddingBottom: "0" }}>
          <Paper
            variant="outlined"
            style={{
              height: 300,
              marginTop: "30px",
              marginBottom: "40px",
              position: "relative",
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  title="Total Borrows"
                  data={marketChartDatas.cumulativeBorrowsUSD}
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
        <Grid item xs={12} md={6} style={{ paddingTop: "0" }}>
          <Paper
            variant="outlined"
            style={{
              height: 300,
              marginTop: "30px",
              marginBottom: "40px",
              position: "relative",
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  title="Total Reserves"
                  data={marketChartDatas.cumulativeReservesUSD}
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
        <Grid item xs={12} md={6} style={{ paddingTop: "0" }}>
          <Paper
            variant="outlined"
            style={{
              height: 300,
              marginTop: "30px",
              marginBottom: "40px",
              position: "relative",
            }}
          >
            <ParentSize>
              {({ width, height }) => (
                <BarChart
                  title="Total Liquidations"
                  data={
                    liquidationChartDatas.underlyingCollateralSeizedAmountUSD
                  }
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
      </Grid>
      <MarketTable markets={markets} title="Markets" />
    </AppShell>
  );
}

export async function getStaticProps() {
  const APIURL =
    "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/lending";

  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });

  await client.query({
    query: marketsQuery,
  });

  await client.query({
    query: allLiquidationDayDatasQuery,
  });

  await client.query({
    query: allMarketDayDatasQuery,
  });

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}

export default LendingsPage;
