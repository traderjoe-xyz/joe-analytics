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

export const allMarketDayDatasQuery = gql`
  query marketDayDatas(
    $first: Int = 1000
    $date: Int = 0
  ) {
    marketDayDatas(
      first: $first
      orderBy: date
      orderDirection: desc
      where: { date_gte: $date }
    ) {
      id
      date
      totalBorrows  
      totalBorrowsUSD
      totalSupplyUSD
      totalSupply
      totalReservesUSD
    }
  }
`;

export const liquidationDayDatasQuery = gql`
  query liquidationDayDatas(
    $first: Int = 1000
    $date: Int = 0
    $seizedAddress: [String!]!
  ) {
    liquidationDayDatas(
      first: $first
      orderBy: date
      orderDirection: desc
      where: { underlyingCollateralSeizedAddress_in: $seizedAddress, date_gte: $date }
    ) {
      id
      date 
      underlyingRepayAmountUSD
      underlyingCollateralSeizedAmountUSD
      underlyingCollateralSeizedAddress
      underlyingRepayAddress
    }
  }
`;

export const allLiquidationDayDatasQuery = gql`
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
      underlyingRepayAmountUSD
      underlyingCollateralSeizedAmountUSD
    }
  }
`;
