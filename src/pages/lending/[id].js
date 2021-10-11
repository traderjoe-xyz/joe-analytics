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
  useInterval,
} from "app/core";
import {
  getMarket
} from "app/core/api";
import PurpleBar from "../../components/PurpleBar";
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
    root: {
      color: "#ffe7ac"
    }
  })(Typography);

  const BorrowText = withStyles({
    root: {
      color: "#B2DFDB"
    }
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

  useInterval(async () => {
    await Promise.all([getMarket]);
  }, 60000);

  const SECONDS_PER_YEAR = 86400 * 365

  const supplyAPY = 
    decimalFormatter.format(((parseFloat(market.supplyRate || 0) * SECONDS_PER_YEAR) / 1e18).toFixed(2) * 100)
  const borrowAPY = 
    decimalFormatter.format(((parseFloat(market.borrowRate || 0) * SECONDS_PER_YEAR) / 1e18).toFixed(2) * 100)
  const utilizationRate = (market.totalBorrows/market.cash) * 100
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
          {market.name}
        </Typography>
      </Box>

      <Grid container spacing={6} style={{ marginBottom: "10px", height: "40%"}}>
        <Grid item xs={6}>
          <Card variant="outlined" style={{ backgroundColor: "#2b281e" }}>
            <CardContent style={{display: "flex", displayDirection: "col"}}>
              <Box>
                <Typography variant="subtitle2" component="div">
                  Total Supply
                </Typography>
                <SupplyText variant="h4">
                  {currencyFormatter.format(market.cash * market.underlyingPriceUSD)}
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
              <Paper
                variant="outlined"
                style={{ height: 300, position: "relative" }}
              >
                <ParentSize>
                  {({ width, height }) => (
                    <AreaChart
                      title="Liquidity"
                      data={[1, 2, 3, 5, 6, 7]}
                      width={width}
                      height={height}
                      margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                      tooltipDisabled
                      overlayEnabled
                    />
                  )}
                </ParentSize>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" style={{ backgroundColor: "#1e2738"}}>
            <CardContent style={{display: "flex"}}>
              <Box>
                <Typography variant="subtitle2" component="div">
                  Total Borrow
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
              <Paper
                variant="outlined"
                style={{ height: 300, position: "relative" }}
              >
                <ParentSize>
                  {({ width, height }) => (
                    <AreaChart
                      title="Liquidity"
                      data={[1, 2, 3, 5, 6, 7]}
                      width={width}
                      height={height}
                      margin={{ top: 125, right: 0, bottom: 0, left: 0 }}
                      tooltipDisabled
                      overlayEnabled
                    />
                  )}
                </ParentSize>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
                    
      <Grid container spacing={6} style={{ marginBottom: "10px", height: "40%"}}>
        <Grid item xs={6}>
          <Card variant="outlined" style={{ display: "flex", alignItems: "center", backgroundColor: "#221e38" }}>
            <CardContent style={{display: "flex", displayDirection: "col", marginRight: "10px"}}>
              <Box width="150px">
                <Typography variant="subtitle2" component="div" nowrap>
                  Available Liquidity
                </Typography>
                <SupplyText variant="h4" style={{ color: "#cdc5ff"}} >
                  {currencyFormatter.format(liquidityUSD)}
                </SupplyText>
              </Box>
            </CardContent>
            <PurpleBar style={{ width: '100%', marginRight: "20px"}} value={(liquidityUSD/totalLiquidityUSD) * 100}/>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" style={{ display: "flex", alignItems: "center", backgroundColor: "#221e38" }}>
            <CardContent style={{display: "flex", displayDirection: "col", marginRight: "20px"}}>
              <Box width="150px">
                <Typography variant="subtitle2" component="div" >
                  Utilization Rate
                </Typography>
                <BorrowText variant="h4" style={{ color: "#cdc5ff" }}>
                  { utilizationRate.toFixed(2) + "%" }
                </BorrowText>
              </Box>
            </CardContent>
            <PurpleBar style={{ width: '100%', marginRight: "20px"}} value={utilizationRate}/>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <KPI
            title="Price"
            value={currencyFormatter.format(market.underlyingPriceUSD || 0)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPI
            title="Reserves"
            value={currencyFormatter.format(market.reserves || 0)}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPI
            title="Reserve Factor"
            value={Number(market.reserveFactor * 100).toFixed(2) + "%"}
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
  const APIURL = "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/lending-rinkeby";
  
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
