import gql from "graphql-tag";

export const barQuery = gql`
  query barQuery($id: String! = "0x8798249c2e607446efb7ad49ec89dd1865ff4272") {
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
      # histories(first: 1000) {
      #   id
      #   date
      #   timeframe
      #   joeStaked
      #   joeStakedUSD
      #   joeHarvested
      #   joeHarvestedUSD
      #   xJoeAge
      #   xJoeAgeDestroyed
      #   xJoeMinted
      #   xJoeBurned
      #   xJoeSupply
      #   ratio
      # }
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
      createdAt
      createdAtBlock
    }
  }
`;
