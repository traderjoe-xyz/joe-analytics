import { Box, Divider, Typography } from "@material-ui/core";
import { formatCurrency, formatDecimal } from "app/core";

import Link from "./Link";
import PairIcon from "./PairIcon";
import Percent from "./Percent";
import React from "react";
import SortableTable from "./SortableTable";
import TokenIcon from "./TokenIcon";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {},
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

export default function PoolTable({ pools, ...rest }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SortableTable
        title="Pools"
        columns={[
          {
            key: "name",
            label: "Name",
            render: (row, index) => {
              const name = `${row.liquidityPair?.token0?.symbol}-${row.liquidityPair?.token1?.symbol}`;
              return (
                <Box display="flex" alignItems="center">
                  <PairIcon
                    base={row.liquidityPair?.token0?.id}
                    quote={row.liquidityPair?.token1?.id}
                  />
                  <Link href={`/pools/${row.id}`} variant="body2" noWrap>
                    {name}
                  </Link>
                </Box>
              );
            },
          },
          {
            key: "rewardPerSec",
            label: "Rewards",
            render: (row) =>
              `${Number(row.rewardPerSec).toFixed(2)} JOE per sec`,
          },
          {
            key: "apr",
            label: "APR / Daily",
            render: (row) => (
              <Typography variant="subtitle2" noWrap>
                <Percent
                  percent={Number(row.apr * 100).toFixed(2)}
                  display="inline"
                />{" "}
                / {Number(row.aprDaily * 100).toFixed(2)}%
              </Typography>
            ),
          },

          {
            key: "reserve0",
            label: "Base Reserve",
            render: (row) => (
              <Box display="flex">
                <TokenIcon
                  id={row.liquidityPair?.token0?.id}
                  className={classes.small}
                />
                <Typography variant="subtitle2" noWrap>
                  {formatDecimal(row.liquidityPair?.reserve0)}{" "}
                  {row.liquidityPair?.token0?.symbol}
                </Typography>
              </Box>
            ),
          },
          {
            key: "reserve1",
            label: "Quote Reserve",
            render: (row) => (
              <Box display="flex">
                <TokenIcon
                  id={row.liquidityPair?.token1?.id}
                  className={classes.small}
                />
                <Typography variant="subtitle2" noWrap>
                  {formatDecimal(row.liquidityPair?.reserve1)}{" "}
                  {row.liquidityPair?.token1?.symbol}
                </Typography>
              </Box>
            ),
          },
          {
            key: "tvl",
            label: "TVL",
            align: "right",
            render: (row) => formatCurrency(row.tvl),
          },
        ]}
        rows={pools}
        {...rest}
      />
    </div>
  );
}
