import { getApollo, useInterval, currencyFormatter, decimalFormatter } from "app/core";
import { AppShell, BarChart } from "app/components";
import { Card, CardContent, Grid, Typography, List, ListItem, Box, Paper } from "@material-ui/core";
import { ParentSize } from "@visx/responsive";
import { withStyles } from "@material-ui/core/styles";
import TokenIcon from "../../components/TokenIcon";
import BorrowBar from "../../components/BorrowBar";
import SupplyBar from "../../components/SupplyBar";

import MarketTable from "../../components/MarketTable";

import {
  marketsQuery,
  liquidationDayDatasQuery
} from "app/core";

import {
  getMarkets
} from "app/core/api";

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

import Head from "next/head";
import React from "react";
import { useQuery } from "@apollo/client";
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

function LendingsPage() {
  //Styled Components
  const SupplyText = withStyles({
    root: {
      color: "#ffe7ac"
    }
  })(Typography);

  const BorrowText = withStyles({
    root: {
      color: "#B2DFDB"
    }
  })(Typography);

  const SmallTokenIcon = withStyles({
    root: {
      width: "25px",
      height: "25px",
      marginRight: "10px"
    }
  })(TokenIcon);

  const {
    data: { markets },
  } = useQuery(
    marketsQuery
  );
  
  const {
    data: { liquidationDayDatas },
  } = useQuery(
    liquidationDayDatasQuery
  );
  
  const _date = new Date(2021, 9, 10)
  const lendingReleaseDate = dayjs(_date).utc().startOf('day').unix()

  const today = dayjs()
  .utc()
  .startOf('day')
  .unix()
  
  function zeroDataChartCalculator(lendingReleaseDate, now) {
    let liquidationDayDatas = []
    let numberOfZeroDays = Number((today - lendingReleaseDate)/86400).toFixed(0)
    for (let i = 0; i < numberOfZeroDays; i++) {
      liquidationDayDatas.push(new Object({date: now - (86400 * i), repaidUSD: 0 }))
    }
    return liquidationDayDatas.reduce(
      (previousValue, currentValue) => {
        previousValue["repaidUSD"].unshift({
          date: currentValue.date,
          value: parseFloat(currentValue.repaidUSD) || 0,
        });
        return previousValue || 0;
      },
      { repaidUSD: [] }
    )
  }

  const chartDatas = liquidationDayDatas.length > 0  ? 
    liquidationDayDatas.reduce(
      (previousValue, currentValue) => {
        previousValue["repaidUSD"].unshift({
          date: currentValue.date,
          value: parseFloat(currentValue.repaidUSD) || 0,
        });
        return previousValue || 0;
      },
      { repaidUSD: [] }
    ) : 
    zeroDataChartCalculator(lendingReleaseDate, today)

  useInterval(async () => {
    await Promise.all([getMarkets]);
  }, 60000);

  let totalBorrows = 0;
  let totalSupply = 0;
  let totalReserves = 0;
  let totalBorrowsUSD = 0;
  let totalSupplyUSD = 0;
  let totalReservesUSD = 0;
  markets.forEach(market => {
    totalBorrowsUSD += Number(market.totalBorrows * market.underlyingPriceUSD) || 0
    totalSupplyUSD += Number(market.totalSupply * market.exchangeRate * market.underlyingPriceUSD) || 0
    totalReservesUSD += Number(market.reserves * market.underlyingPriceUSD) || 0
    totalBorrows += Number(market.totalBorrows) || 0
    totalSupply += Number(market.totalSupply) || 0
    totalReserves += Number(market.reserves) || 0
  })

  const topSupplyMarkets = [...markets].sort((a, b) => ((Number(a.totalSupply * a.exchangeRate * a.underlyingPriceUSD) < Number(b.totalSupply * b.exchangeRate * b.underlyingPriceUSD)) ? 1 : -1)).slice(0, 3)
  const topBorrowMarkets = [...markets].sort((a, b) => ((Number(a.totalBorrows * a.underlyingPriceUSD) < Number(b.totalBorrows * b.underlyingPriceUSD)) ? 1 : -1)).slice(0, 3)

  return (
    <AppShell>
      <Head>
        <title>Lending | Trader Joe Analytics</title>
      </Head>
      <Card>
        <CardContent>
          <Typography variant="subtitle2" component="div">
            Total Reserves
          </Typography>
          <Typography variant="h6">
            {currencyFormatter.format(totalReservesUSD)}
          </Typography>
        </CardContent>
      </Card>
      <Grid container spacing={6} style={{ marginBottom: "10px"}}>
        <Grid item xs={6}>
          <Card variant="outlined" style={{ backgroundColor: "#2b281e" }}>
            <CardContent>
              <Typography variant="subtitle2" component="div">
                Total Supply
              </Typography>
              <SupplyText variant="h4">
                {currencyFormatter.format(totalSupplyUSD)}
              </SupplyText>
            </CardContent>
            <CardContent>
              <Typography>
                Top 3 Markets
              </Typography>
              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              {topSupplyMarkets.map(market => {
                  return <ListItem style={{ width: '100%' }} alignItems="flex-start">
                    <Box style={{ width: '100%' }} display="flex" alignItems="center">
                      <Box style={{ minWidth: '80px' }} display="flex" alignItems="center" mr={3}> 
                        <SmallTokenIcon id={market.underlyingAddress} />
                        <Typography variant="body2">
                          {market.underlyingSymbol}
                        </Typography>
                      </Box>
                      <SupplyBar style={{ width: '100%' }} value={(Number(market.totalSupply * market.exchangeRate * market.underlyingPriceUSD)/totalSupplyUSD) * 100}/>
                      <Box style={{ minWidth: '80px' }} ml={3}>
                        <Typography> {decimalFormatter.format((Number((market.totalSupply * market.exchangeRate * market.underlyingPriceUSD)/totalSupplyUSD) * 100).toFixed(2))}%  </Typography>
                      </Box>
                    </Box>
                  </ListItem> 
                  })}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" style={{ backgroundColor: "#1e2738"}}>
            <CardContent>
              <Typography variant="subtitle2" component="div">
                Total Borrow
              </Typography>
              <BorrowText variant="h4">
                {currencyFormatter.format(totalBorrowsUSD)}
              </BorrowText>
            </CardContent>
            <CardContent>
              <Typography ml={3}>
                Top 3 Markets
              </Typography>
              <List style={{ width: '100%'}}>
                {topBorrowMarkets.map(market => {
                  return <ListItem style={{ width: '100%' }} alignItems="flex-start">
                    <Box style={{ width: '100%' }} display="flex" alignItems="center">
                      <Box style={{ minWidth: '80px' }} display="flex" alignItems="center" mr={3}> 
                        <SmallTokenIcon id={market.underlyingAddress} />
                        <Typography variant="body2">
                          {market.underlyingSymbol}
                        </Typography>
                      </Box>
                      <BorrowBar style={{ width: '100%' }} value={(Number(market.totalBorrows * market.underlyingPriceUSD)/totalBorrowsUSD) * 100}/>
                      <Box style={{ minWidth: '80px' }} ml={3}>
                        <Typography> {decimalFormatter.format((Number((market.totalBorrows * market.underlyingPriceUSD)/totalBorrowsUSD) * 100).toFixed(2))}% </Typography>
                      </Box>
                    </Box>
                  </ListItem> 
                  })}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Paper
          variant="outlined"
          style={{ height: 300, marginTop: "30px", marginBottom: "40px", position: "relative" }}
        >
        <ParentSize>
          {({ width, height }) => (
            <BarChart
              title="Total Liquidations"
              data={chartDatas.repaidUSD}
              width={width}
              height={height}
              margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
              tooltipDisabled
              overlayEnabled
            />
          )}
        </ParentSize>
      </Paper>
      <MarketTable markets={markets} title="Markets"/>
    </AppShell>
  );
}


export async function getStaticProps() {
  const APIURL = "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/lending";

  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache()
  });
    
  await client.query({
    query: marketsQuery,
  });

  await client.query({
    query: liquidationDayDatasQuery
  });

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}


export default LendingsPage;
