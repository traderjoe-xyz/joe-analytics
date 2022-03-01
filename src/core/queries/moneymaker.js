import gql from "graphql-tag"

export const remittancesQuery = gql`
  query remittancesQuery($first: Int!) {
    remits(first: $first, orderBy: timestamp, orderDirection: desc) {
      id
      token0Symbol
      amount0
      token1Symbol
      amount1
      tokenRemitted
      usdRemitted
      timestamp
    }
  }
`;