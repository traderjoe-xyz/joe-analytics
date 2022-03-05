import { HttpLink, from, split } from "@apollo/client";

import { RetryLink } from "@apollo/client/link/retry";

import {
  GRAPH_BAR_URI,
  GRAPH_MASTERCHEF_URI,
  GRAPH_EXCHANGE_URI,
  GRAPH_BLOCKS_URI,
  GRAPH_LENDING_URI,
  GRAPH_MONEY_MAKER_URI,
  GRAPH_SJOE_URI,
} from "../../config/index.ts";

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
    uri: GRAPH_BAR_URI,
    shouldBatch: true,
  }),
]);

export const masterchef = from([
  new RetryLink(),
  new HttpLink({
    uri: GRAPH_MASTERCHEF_URI,
    shouldBatch: true,
  }),
]);

export const exchange = from([
  new RetryLink(),
  new HttpLink({
    uri: GRAPH_EXCHANGE_URI,
    shouldBatch: true,
  }),
]);

export const lending = from([
  new RetryLink(),
  new HttpLink({
    uri: GRAPH_LENDING_URI,
    shouldBatch: true,
  }),
]);

export const blocklytics = from([
  new RetryLink(),
  new HttpLink({
    uri: GRAPH_BLOCKS_URI,
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

export const moneyMaker = from([
  new RetryLink(),
  new HttpLink({
    uri: GRAPH_MONEY_MAKER_URI,
    shouldBatch: true,
  }),
])

export const sjoe = from([
  new RetryLink(),
  new HttpLink({
    uri: GRAPH_SJOE_URI,
    shouldBatch: true,
  }),
])

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
        split(
          (operation) => {
            return operation.getContext().clientName === "moneymaker";
          },
          moneyMaker,
          split(
            (operation) => {
              return operation.getContext().clientName === "sjoe";
            },
            sjoe,
            exchange
          )
        )
      )
    )
  )
);
