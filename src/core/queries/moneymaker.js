import gql from "graphql-tag"

export const moneyMakerQuery = gql`
  query moneyMakerQuery($id: String!) {
    moneyMaker(id: $id) {
      id
      tokenRemitted
      usdRemitted
    }
  }
`

export const moneyMakerDayDatasQuery = gql`
  query moneyMakerDayDatasQuery {
    dayDatas(orderBy: date, orderDirection: desc) {
      id
      date
      tokenRemitted
      usdRemitted
    }
  }
`

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