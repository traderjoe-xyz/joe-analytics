import gql from "graphql-tag";
import { BAR_ADDRESS } from "../../config/index.ts";

export const barQuery = gql`
  query barQuery($id: String! = "${BAR_ADDRESS}") {
    bar(id: $id) {
      id
      totalSupply
      ratio
      xJoeMinted
      xJoeBurned
      joeStaked
      joeStakedUSD
      joeHarvested
      joeHarvestedUSD
      xJoeAge
      xJoeAgeDestroyed
    }
  }
`;

export const barHistoriesQuery = gql`
  query barHistoriesQuery {
    histories(first: 1000) {
      id
      date
      timeframe
      joeStaked
      joeStakedUSD
      joeHarvested
      joeHarvestedUSD
      xJoeAge
      xJoeAgeDestroyed
      xJoeMinted
      xJoeBurned
      xJoeSupply
      ratio
    }
  }
`;

export const barUserQuery = gql`
  query barUserQuery($id: String!) {
    user(id: $id) {
      id
      bar {
        totalSupply
        joeStaked
      }
      xJoe
      joeStaked
      joeStakedUSD
      joeHarvested
      joeHarvestedUSD
      xJoeIn
      xJoeOut
      xJoeOffset
      xJoeMinted
      xJoeBurned
      joeIn
      joeOut
      usdIn
      usdOut
      updatedAt
      # createdAt
      # createdAtBlock
    }
  }
`;
