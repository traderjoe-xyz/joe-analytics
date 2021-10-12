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

  let totalLiquidityUSD = 0;
  const rows = markets
    .map((market) => {
      const liquidityUSD =
        parseFloat((market.cash - market.reserves) * market.underlyingPriceUSD)
      totalLiquidityUSD += liquidityUSD
    const supplyAPY = 
      decimalFormatter.format(parseFloat(market.supplyRate * 100).toFixed(2))
    const borrowAPY = 
      decimalFormatter.format(parseFloat(market.borrowRate * 100).toFixed(2))

    return {
      ...market,
      liquidityUSD: liquidityUSD || 0,
      supplyAPY: supplyAPY || 0,
      borrowAPY: borrowAPY || 0,
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
                <Link href={`/lending/${row.id}?tl=${totalLiquidityUSD.toFixed(0)}`}>
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
            key: "supplyAPY",
            align: "right",
            label: "Supply APY",
            render: (row) => Number(row.supplyAPY).toFixed(2) + "%",
          },
          {
            key: "totalBorrows",
            align: "right",
            label: "Total Borrow",
            render: (row) => currencyFormatter.format(row.totalBorrows),
          },
          {
            key: "borrowAPY",
            align: "right",
            label: "Borrow APY",
            render: (row) => Number(row.borrowAPY).toFixed(2) + "%",
          },
        ]}
        rows={rows}
      />
    </div>
  );
}
