import gql from "graphql-tag";

export const marketFieldsQuery = gql`
  fragment marketFields on Market {
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
`;

export const marketsQuery = gql`
  query marketsQuery {
    markets {
      ...marketFields
    }
  }
  ${marketFieldsQuery}
`;

export const marketQuery = gql`
  query marketQuery($id: ID!) {
    market(id: $id) {
      ...marketFields
    }
  }
  ${marketFieldsQuery}
`;

export const marketDayDatasQuery = gql`
  query marketDayDatas(
    $first: Int = 1000
    $date: Int = 0
    $markets: [Bytes]!
  ) {
    marketDayDatas(
      first: $first
      orderBy: date
      orderDirection: desc
      where: { market_in: $markets, date_gte: $date }
    ) {
      id
      date
      totalBorrows  
      totalBorrowsUSD
      totalSupplyUSD
      totalSupply
    }
  }
`;

export const liquidationDayDatasQuery = gql`
  query liquidationDayDatas(
    $first: Int = 1000
    $date: Int = 0
  ) {
    liquidationDayDatas(
      first: $first
      orderBy: date
      orderDirection: desc
      where: { date_gte: $date }
    ) {
      id
      date 
      repaidUSD
      amount
    }
  }
`;
