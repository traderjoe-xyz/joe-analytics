import {
  AppShell,
  AreaChart,
  BarChart,
  BasicTable,
  KPI,
  TokenIcon
} from "app/components";
import { withStyles } from "@material-ui/core/styles";
import { Box, Card, CardContent, Grid, Paper, Typography } from "@material-ui/core";
import {
  currencyFormatter,
  decimalFormatter,
  marketQuery,
  marketDayDatasQuery,
  liquidationDayDatasQuery,
  useInterval,
} from "app/core";
import {
  getMarket
} from "app/core/api";
import ProgressBar from "../../components/ProgressBar";
import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

function LendingPage() {
  const router = useRouter();

  if (router.isFallback) {
    return <AppShell />;
  }

  const id = router.query.id
  const totalLiquidityUSD = router.query.tl

  const SupplyText = withStyles({
  })(Typography);

  const BorrowText = withStyles({
  })(Typography);

  const {
    data: { market },
  } = useQuery(marketQuery,
    {
      variables: {
        id
      }
    }
  );

  const {
    data: { marketDayDatas },
  } = useQuery(marketDayDatasQuery,
    {
      variables: {
        markets: [id]
      }
    }
  );

  const {
    data: { liquidationDayDatas },
  } = useQuery(liquidationDayDatasQuery ,
    {
      variables: {
        seizedAddress: [id]
      }
    }
  );

  const sortedMarketDayDatas = marketDayDatas.map(data => {
    return {
      date: data.date,
      totalSupplyUSD: data.totalSupplyUSD,
      totalBorrowsUSD: data.totalBorrowsUSD,
      totalReservesUSD: data.totalReservesUSD
    }
  }).sort((a, b) =>
    Number(a.date) > Number(b.date) ? 1 : -1
  )

  let cumulativeBorrowsUSD = [];
  let cumulativeSupplyUSD = [];
  let cumulativeReservesUSD = [];

  sortedMarketDayDatas.forEach((data) => {
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

  const marketChartDatas = { cumulativeBorrowsUSD, cumulativeSupplyUSD, cumulativeReservesUSD }

  let mergedLiquidationDayDatas = []

  liquidationDayDatas.forEach(data => {
    let existing = mergedLiquidationDayDatas.filter(function(pastData, i) {
      return pastData.date == data.date;
    });
    if (existing.length) {
      let existingIndex = mergedLiquidationDayDatas.indexOf(existing[0]);
      mergedLiquidationDayDatas[existingIndex].underlyingCollateralSeizedAmountUSD = Number(mergedLiquidationDayDatas[existingIndex].underlyingCollateralSeizedAmountUSD) + Number(data.underlyingCollateralSeizedAmountUSD)
    } else {
      data = {date: data.date, underlyingCollateralSeizedAmountUSD: Number(data.underlyingCollateralSeizedAmountUSD)};
      mergedLiquidationDayDatas.push(data);
    }
  });

  const liquidationChartDatas = mergedLiquidationDayDatas.reduce(
    (previousValue, currentValue) => {
      previousValue["underlyingCollateralSeizedAmountUSD"].unshift({
        date: currentValue.date,
        value: parseFloat(currentValue.underlyingCollateralSeizedAmountUSD),
      });
      return previousValue;
    },
    { underlyingCollateralSeizedAmountUSD: [] }
  );

  useInterval(async () => {
    await Promise.all([getMarket]);
  }, 60000);

  const supplyAPY =
    decimalFormatter.format(parseFloat(market.supplyRate * 100).toFixed(2))
  const borrowAPY =
    decimalFormatter.format(parseFloat(market.borrowRate * 100).toFixed(2))
  const utilizationRate = (Number(market.totalBorrows)/(Number(market.cash) + Number(market.totalBorrows) - Number(market.reserves))) * 100
  const liquidityUSD = (market.cash - market.reserves) * market.underlyingPriceUSD

  return (
    <AppShell>
      <Head>
        <title>
          Trader Joe Analytics
        </title>
      </Head>
      <Box display="flex" alignItems="center" marginBottom="30px">
        <TokenIcon id={market.underlyingAddress} />
        <Typography variant="h5" component="h1" noWrap>
          {market.underlyingSymbol}
        </Typography>
      </Box>

      <Grid container spacing={6} style={{ height: "40%"}}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent style={{display: "flex", displayDirection: "col"}}>
              <Box>
                <Typography variant="subtitle2" component="div">
                  Total Supply
                </Typography>
                <SupplyText variant="h4">
                  {currencyFormatter.format(market.totalSupply * market.exchangeRate * market.underlyingPriceUSD)}
                </SupplyText>
              </Box>
              <Box ml={6} style={{marginLeft: "auto"}}>
                <Typography variant="subtitle2" component="div">
                  Supply APY
                </Typography>
                <SupplyText variant="h4">
                  {Number(supplyAPY).toFixed(2) + "%"}
                </SupplyText>
              </Box>
            </CardContent>
          </Card>
          <Paper
            variant="outlined"
            style={{ height: 300, marginTop: "40px", position: "relative" }}
          >
          <ParentSize>
            {({ width, height }) => (
              <AreaChart
                title="Total Supply (USD)"
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
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent style={{display: "flex"}}>
              <Box>
                <Typography variant="subtitle2" component="div">
                  Total Borrows
                </Typography>
                <BorrowText variant="h4">
                  {currencyFormatter.format(market.totalBorrows * market.underlyingPriceUSD)}
                </BorrowText>
              </Box>
              <Box ml={6} style={{marginLeft: "auto"}}>
                <Typography variant="subtitle2" component="div">
                  Borrow APY
                </Typography>
                <BorrowText variant="h4">
                  {Number(borrowAPY).toFixed(2) + "%"}
                </BorrowText>
              </Box>
            </CardContent>
          </Card>
          <Paper
            variant="outlined"
            style={{ height: 300, marginTop: "40px", position: "relative"}}
          >
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  title="Total Borrows (USD)"
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
      </Grid>

      <Grid container spacing={6} style={{ marginTop: "20px", height: "40%"}}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" style={{ display: "flex", alignItems: "center" }}>
            <CardContent style={{display: "flex", displayDirection: "col", marginRight: "100px"}}>
              <Box width="150px">
                <Typography variant="subtitle2" component="div" nowrap>
                  Available Liquidity
                </Typography>
                <SupplyText variant="h4">
                  {currencyFormatter.format(liquidityUSD)}
                </SupplyText>
              </Box>
            </CardContent>
            <ProgressBar style={{ width: '100%', marginRight: "20px"}} value={(liquidityUSD/totalLiquidityUSD) * 100}/>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card variant="outlined" style={{ display: "flex", alignItems: "center" }}>
            <CardContent style={{display: "flex", displayDirection: "col", marginRight: "20px"}}>
              <Box width="150px">
                <Typography variant="subtitle2" component="div">
                  Utilization Rate
                </Typography>
                <BorrowText variant="h4">
                  { utilizationRate.toFixed(2) + "%" }
                </BorrowText>
              </Box>
            </CardContent>
            <ProgressBar style={{ width: '100%', marginRight: "20px"}} value={utilizationRate < 100 ? utilizationRate : 100}/>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            style={{ height: 300, marginTop: "40px", position: "relative"}}
          >
            <ParentSize>
              {({ width, height }) => (
                <BarChart
                  title="Total Liquidations (USD)"
                  data={liquidationChartDatas.underlyingCollateralSeizedAmountUSD}
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
        <Grid item xs={12} md={6}>
          <Paper
            variant="outlined"
            style={{ height: 300, marginTop: "40px", position: "relative"}}
          >
            <ParentSize>
              {({ width, height }) => (
                <AreaChart
                  title="Total Reserves (USD)"
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
      </Grid>

      <Grid container spacing={4} style={{marginTop: "30px"}}>
        <Grid item xs={12} md={4}>
          <KPI
            title="Price"
            value={currencyFormatter.format(market.underlyingPriceUSD || 0)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPI
            title="Reserve Factor"
            value={Number((market.reserveFactor * 100)/1e18).toFixed(2) + "%"}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPI
            title="Collateral Factor"
            value={Number(market.collateralFactor * 100).toFixed(2) + "%"}
          />
        </Grid>
      </Grid>
    </AppShell>
  );
}

export async function getStaticProps({ params }) {
  const APIURL = "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/lending";

  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache()
  });

  const id = params.id.toLowerCase();

  await client.query({
    query: marketQuery,
    variables: {
      id: id
    }
  });

  await client.query({
    query: marketDayDatasQuery,
    variables: {
      markets: [id]
    }
  });

  await client.query({
    query: liquidationDayDatasQuery,
    variables: {
      seizedAddress: [id]
    }
  });


  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}

export default LendingPage;
