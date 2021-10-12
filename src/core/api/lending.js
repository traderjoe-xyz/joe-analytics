
import {
  marketsQuery,
  marketQuery
} from "../queries/lending";
import { getApollo } from "../apollo";

export async function getMarkets() {
  const APIURL = "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/lending";
  
  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache()
  });

  const {
    data: { markets },
  } = await client.query({
    query: marketsQuery
  });

  return markets;
}

export async function getMarket(id) {
  const APIURL = "https://api.thegraph.com/subgraphs/name/traderjoe-xyz/lending";
  
  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache()
  });

  const {
    data: { market },
  } = await client.query({
    query: marketQuery,
    variables: {
      id: id
    }
  });

  return market;
}
