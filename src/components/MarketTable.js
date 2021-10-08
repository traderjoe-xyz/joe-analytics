import { Box, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Link from "./Link";
import React from "react";
import SortableTable from "./SortableTable";
import TokenIcon from "./TokenIcon";
import { currencyFormatter, decimalFormatter } from "app/core";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function MarketTable({ markets, title }) {
  const classes = useStyles();
  const theme = useTheme();

  const SECONDS_PER_YEAR = 86400 * 365

  const rows = markets
    .map((market) => {
      const liquidityUSD =
        parseFloat(market.cash)
      const supplyAPR = 
        decimalFormatter.format(((parseFloat(market.supplyRate || 0) * SECONDS_PER_YEAR) / 1e18) * 100)
      const borrowAPR = 
        decimalFormatter.format(((parseFloat(market.borrowRate || 0) * SECONDS_PER_YEAR) / 1e18) * 100)
      return {
        ...market,
        liquidityUSD: liquidityUSD || 0,
        supplyAPR: supplyAPR || 0,
        borrowAPR: borrowAPR || 0,
      };
    });
  
  return (
    <div className={classes.root}>
      <SortableTable
        title={title}
        orderBy="liquidityUSD"
        columns={[
          {
            key: "name",
            label: "Name",
            render: (row, index) => (
              <Box display="flex" alignItems="center">
                <TokenIcon id={row.underlyingAddress} />
                <Link href={`/lending/${row.id}`}>
                  <Typography variant="body2" style={{color: "#cdc5ff"}} noWrap>
                    {row.underlyingSymbol}
                  </Typography>
                </Link>
              </Box>
            ),
          },
          {
            key: "liquidityUSD",
            align: "right",
            label: "Liquidity",
            render: (row) => currencyFormatter.format(row.liquidityUSD),
          },
          {
            key: "totalSupply",
            align: "right",
            label: "Total Supply",
            render: (row) => currencyFormatter.format(row.totalSupply),
          },
          {
            key: "supplyAPR",
            align: "right",
            label: "Supply APR",
            render: (row) => Number(row.supplyAPR).toFixed(5) + "%",
          },
          {
            key: "totalBorrows",
            align: "right",
            label: "Total Borrow",
            render: (row) => currencyFormatter.format(row.totalBorrows),
          },
          {
            key: "borrowAPR",
            align: "right",
            label: "Borrow APR",
            render: (row) => Number(row.borrowAPR).toFixed(5) + "%",
          },
        ]}
        rows={rows}
      />
    </div>
  );
}
