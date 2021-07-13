import gql from "graphql-tag";

export const lockupUserQuery = gql`
  query lockupUserQuery($address: String!) {
    users(first: 1000, where: { amount_gt: 0, address: $address }) {
      id
      amount
      address
      rewardDebt
      pool {
        id
        lockup {
          totalAllocPoint
        }
        balance
        accJoePerShare
      }
    }
  }
`;

const poolUserFragment = gql`
  fragment PoolUser on User {
    id
    address
    pool {
      id
      pair
      balance
      accJoePerShare
      lastRewardTimestamp
    }
    amount
    rewardDebt
    entryUSD
    exitUSD
    joeHarvested
    joeHarvestedUSD
  }
`;

export const poolUserQuery = gql`
  query poolUserQuery($address: String!, $amount_gt: Int! = 0) {
    users(where: { address: $address, amount_gt: $amount_gt }) {
      ...PoolUser
    }
  }
  ${poolUserFragment}
`;

export const poolHistoryQuery = gql`
  query poolHistoryQuery($id: String!) {
    poolHistories(first: 1000, where: { pool: $id }, orderBy: timestamp) {
      id
      pool {
        id
        accJoePerShare
      }
      jlpBalance
      jlpAge
      jlpAgeRemoved
      jlpDeposited
      jlpWithdrawn
      entryUSD
      exitUSD
      joeHarvestedUSD
      userCount
      timestamp
      block
    }
  }
`;

export const poolQuery = gql`
  query poolQuery($id: ID!) {
    pool(id: $id) {
      id
      pair
      allocPoint
      lastRewardTimestamp
      accJoePerShare
      balance
      userCount
      owner {
        id
        joePerSec
        totalAllocPoint
      }
      users(orderBy: amount, orderDirection: desc) {
        id
        address
        amount
        rewardDebt
      }
      jlpAge
      liquidityPair @client
      timestamp
      entryUSD
      exitUSD
    }
  }
`;

export const poolIdsQuery = gql`
  query poolIdsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
    }
  }
`;

export const poolsQuery = gql`
  query poolsQuery(
    $first: Int! = 1000
    $skip: Int! = 0
    $orderBy: String! = "timestamp"
    $orderDirection: String! = "desc"
  ) {
    pools(
      first: $first
      skip: $skip
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      pair
      allocPoint
      lastRewardTimestamp
      accJoePerShare
      balance
      userCount
      owner {
        id
        joePerSec
        totalAllocPoint
      }
      liquidityPair @client
      rewardPerSec @client
      roiPerHour @client
      roiPerDay @client
      roiPerMonth @client
      roiPerYear @client
      tvl @client
      timestamp
    }
  }
`;
