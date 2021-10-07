
import {
  marketsQuery,
  marketQuery
} from "../queries/lending";
import { getApollo } from "../apollo";

export async function getMarkets(client = getApollo()) {
  const {
    data: { markets },
  } = await client.query({
    query: marketsQuery
  });

  return markets;
}

export async function getMarket(id, client = getApollo()) {
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
