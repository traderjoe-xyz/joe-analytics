import {
  AppShell,
  AreaChart,
  BarChart,
  BasicTable,
  KPI,
  TokenIcon
} from "app/components";
import { withStyles } from "@material-ui/core/styles";
import { Box, Card, CardContent, Grid, Paper, Typography, List, ListItem, CircularProgress } from "@material-ui/core";
import {
  currencyFormatter,
  decimalFormatter,
  marketQuery,
  useInterval,
} from "app/core";
import PurpleBar from "../../components/PurpleBar";
import Head from "next/head";
import { ParentSize } from "@visx/responsive";
import { makeStyles } from "@material-ui/core/styles";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const useStyles = makeStyles((theme) => ({
  title: {
    display: "flex",
    flexDirection: "column",
    // marginBottom: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
      justifyContent: "flex-start",
      marginBottom: 0,
      "& > div:first-of-type": {
        marginRight: theme.spacing(1),
      },
    },
  },
  links: {
    "& > a:first-of-type": {
      marginRight: theme.spacing(4),
    },
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
  },
  price: {
    margin: theme.spacing(2, 0),
    [theme.breakpoints.up("sm")]: {
      margin: 0,
    },
  },
}));

function LendingPage() {
  const router = useRouter();

  if (router.isFallback) {
    return <AppShell />;
  }

  const classes = useStyles();
  console.log(router)
  const id = router.query.id

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

  const useStylesContainer = makeStyles(theme => ({
    root: {
      height: '100vh',
    }
  }));

  const classesContainer = useStylesContainer();

  const {
    data: { market },
  } = useQuery(marketQuery);

  const SECONDS_PER_YEAR = 86400 * 365

  const supplyAPR = 
    decimalFormatter.format(((parseFloat(market.supplyRate || 0) * SECONDS_PER_YEAR) / 1e18) * 100)
  const borrowAPR = 
    decimalFormatter.format(((parseFloat(market.borrowRate || 0) * SECONDS_PER_YEAR) / 1e18) * 100)

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
                  {currencyFormatter.format(market.totalSupply)}
                </SupplyText>
              </Box>
              <Box ml={6} style={{marginLeft: "auto"}}>
                <Typography variant="subtitle2" component="div">
                  Supply APR
                </Typography>
                <SupplyText variant="h4">
                  {Number(supplyAPR).toFixed(2) + "%"}
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
                  {currencyFormatter.format(market.totalBorrows)}
                </BorrowText>
              </Box>
              <Box ml={6} style={{marginLeft: "auto"}}>
                <Typography variant="subtitle2" component="div">
                  Borrow APR
                </Typography>
                <BorrowText variant="h4">
                  {Number(borrowAPR).toFixed(2) + "%"}
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
                  {currencyFormatter.format(market.totalSupply)}
                </SupplyText>
              </Box>
            </CardContent>
            <PurpleBar style={{ width: '100%', marginRight: "20px"}} value={63.4}/>
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
                  {Number(35.4).toFixed(2) + "%"}
                </BorrowText>
              </Box>
            </CardContent>
            <PurpleBar style={{ width: '100%', marginRight: "20px"}} value={35.4}/>
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
            value={Number(market.reserveFactor).toFixed(2)+"%"}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPI
            title="Collateral Factor"
            value={Number(market.collateralFactor).toFixed(2)+"%"}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <KPI
            title="Exchange Rate"
            value={Number(market.exchangeRate).toFixed(2)+"%"}
          />
        </Grid>
      </Grid>  
    </AppShell>
  );
}

export async function getStaticProps() {
  const APIURL = "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/lending-rinkeby";

  const marketQuery1 = gql`
    query marketQuery($id: ID! = "0xaafe9d8346aefd57399e86d91bbfe256dc0dcac0") {
      market(id: $id) {
        id
        supplyRate
        borrowRate
        cash
        collateralFactor
        reserveFactor
        exchangeRate
        name
        totalSupply
        totalBorrows
        reserves
        underlyingAddress
        underlyingSymbol
        underlyingPriceUSD
      }
    }
  `
  
  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache()
  });
    
  await client.query({
    query: marketQuery1
  });

  return {
    props: {
      initialApolloState: client.cache.extract(),
    },
    revalidate: 1,
  };
}

export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  // const apollo = getApollo();

  // const { data } = await apollo.query({
  //   query: tokenIdsQuery,
  // });

  // const paths = data.tokens.map(({ id }) => ({
  //   params: { id },
  // }));

  return { paths: [], fallback: true };
}

export default LendingPage;
