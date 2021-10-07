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
  ${marketFieldsQuery}
`;
