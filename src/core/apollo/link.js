import { HttpLink, from, split } from "@apollo/client";

import { RetryLink } from "@apollo/client/link/retry";

export const uniswap = from([
  new RetryLink(),
  new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
    shouldBatch: true,
  }),
]);

export const bar = from([
  new RetryLink(),
  new HttpLink({
    // uri: "https://api.thegraph.com/subgraphs/name/0xmurloc/joe-defi-bar-avax",
    uri: "https://api.thegraph.com/subgraphs/name/0xmurloc/joe-defi-bar-rinkeby",
    shouldBatch: true,
  }),
]);

export const masterchef = from([
  new RetryLink(),
  new HttpLink({
    // uri: "https://api.thegraph.com/subgraphs/name/0xmurloc/joe-defi-masterchef-avax",
    uri: "https://api.thegraph.com/subgraphs/name/0xmurloc/joe-defi-masterchef-rinkeby",
    shouldBatch: true,
  }),
]);

export const exchange = from([
  new RetryLink(),
  new HttpLink({
    // uri: "https://api.thegraph.com/subgraphs/name/0xmurloc/joe-defi-exchange-avax",
    uri: "https://api.thegraph.com/subgraphs/name/0xmurloc/joe-defi-exchange-rinkeby",
    shouldBatch: true,
  }),
]);

export const blocklytics = from([
  new RetryLink(),
  new HttpLink({
    // uri: "https://api.thegraph.com/subgraphs/name/dasconnor/avalanche-blocks",
    uri: "https://api.thegraph.com/subgraphs/name/blocklytics/rinkeby-blocks", 
    shouldBatch: true,
  }),
]);

export const lockup = from([
  new RetryLink(),
  new HttpLink({
    uri: "https://api.thegraph.com/subgraphs/name/matthewlilley/lockup",
    shouldBatch: true,
  }),
]);

export default split(
  (operation) => {
    return operation.getContext().clientName === "blocklytics";
  },
  blocklytics,
  split(
    (operation) => {
      return operation.getContext().clientName === "masterchef";
    },
    masterchef,
    split(
      (operation) => {
        return operation.getContext().clientName === "bar";
      },
      bar,
      split(
        (operation) => {
          return operation.getContext().clientName === "lockup";
        },
        lockup,
        exchange
      )
    )
  )
);
