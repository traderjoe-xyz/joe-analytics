import { currencyFormatter, decimalFormatter } from "app/core";

import Link from "./Link";
import React from "react";
import SortableTable from "./SortableTable";
import { Typography } from "@material-ui/core";
import formatDistance from "date-fns/formatDistance";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
}));

export default function Transactions({ transactions, txCount }) {
  const classes = useStyles();
  const rows = [
    ...transactions.swaps,
    ...transactions.mints,
    ...transactions.burns,
  ].map((transaction) => {
    if (transaction.__typename === "Swap") {
      return {
        ...transaction,
        amount0:
          transaction.amount0In === "0"
            ? transaction.amount1In
            : transaction.amount0In,
        amount1:
          transaction.amount1Out === "0"
            ? transaction.amount0Out
            : transaction.amount1Out,
      };
    }

    return transaction;
  });

  const now = new Date();

  return (
    <div className={classes.root}>
      <SortableTable
        title="Transactions"
        orderBy="timestamp"
        columns={[
          {
            key: "__typename",
            label: "Type",
            render: (row) => {
              const swapToken0ForToken1 = `${row.__typename} ${row.pair.token0.symbol} for ${row.pair.token1.symbol}`;
              const swapToken1ForToken0 = `${row.__typename} ${row.pair.token1.symbol} for ${row.pair.token0.symbol}`;
              const addLiquidity = `Add ${row.pair.token0.symbol} and ${row.pair.token1.symbol}`;
              const removeLiquidity = `Remove ${row.pair.token0.symbol} and ${row.pair.token1.symbol}`;
              return (
                <Typography variant="body2" noWrap>
                  {row.__typename === "Swap"
                    ? row.amount0In === "0"
                      ? swapToken1ForToken0
                      : swapToken0ForToken1
                    : row.__typename === "Mint"
                    ? addLiquidity
                    : removeLiquidity}
                </Typography>
              );
            },
          },
          {
            key: "amountUSD",
            align: "right",
            label: "Value",
            render: (row) => currencyFormatter.format(row.amountUSD),
          },
          {
            key: "amount0",
            align: "right",
            label: "Amount 0",
            render: (row) => (
              <Typography variant="body2" noWrap>
                {decimalFormatter.format(row.amount0)}{" "}
                {row.amount1In === "0" || !row.amount1In
                  ? row.pair.token0.symbol
                  : row.pair.token1.symbol}
              </Typography>
            ),
          },
          {
            key: "amount1",
            align: "right",
            label: "Amount 1",
            render: (row) => (
              <Typography variant="body2" noWrap>
                {decimalFormatter.format(row.amount1)}{" "}
                {row.amount0Out === "0" || !row.amount0Out
                  ? row.pair.token1.symbol
                  : row.pair.token0.symbol}
              </Typography>
            ),
          },
          {
            key: "to",
            label: "To",
            render: (row) => (
              <Link
                href={`https://cchain.explorer.avax.network/address/${row.to}`}
              >
                {row.to}
              </Link>
            ),
          },
          {
            key: "timestamp",
            align: "right",
            label: "Time",
            render: (row) => (
              <Typography variant="body2" noWrap>
                {formatDistance(now, new Date(row.timestamp * 1000))} ago
              </Typography>
            ),
          },
        ]}
        rows={rows}
      />
    </div>
  );
}
