import { Box } from "@material-ui/core";
import Link from "./Link";
import { PAIR_DENY } from "app/core/constants";
import PairIcon from "./PairIcon";
import Percent from "./Percent";
import React from "react";
import SortableTable from "./SortableTable";
import { currencyFormatter } from "app/core";
import { makeStyles } from "@material-ui/core/styles";

const FEE_RATE = 0.0025 // 0.25% of volume are fees

const useStyles = makeStyles((theme) => ({
  root: {},
}));

/*
 * PairTable displays pool trading volume and fees
 * We calc fees based on volume and fee rate (assumes rate is fixed)
 * We calc annual yield (APY) based on last 7 day volume if available
 */ 
export default function PairTable({ pairs, title, ...rest }) {
  const classes = useStyles();

  const rows = pairs
    .filter((row) => {
      return !PAIR_DENY.includes(row.id);
    })
    .map((pair) => {

      const displayName = getDisplayName(pair)

      // last 1 day
      const oneDayVolumeUSD = 
      pair?.oneDay?.volumeUSD === "0"
          ? pair?.oneDay?.untrackedVolumeUSD
          : pair?.oneDay?.volumeUSD;
      const oneDayVolume = !isNaN(oneDayVolumeUSD) ? oneDayVolumeUSD : 0 // check for 'undefined'
      const oneDayFees = oneDayVolume * FEE_RATE

      // last 7 days
      const sevenDayVolumeUSD =
      pair?.sevenDay?.volumeUSD === "0"
        ? pair?.sevenDay?.untrackedVolumeUSD
        : pair?.sevenDay?.volumeUSD;
      const sevenDayVolume = !isNaN(sevenDayVolumeUSD) ? sevenDayVolumeUSD : 0 // check for 'undefined'
      const sevenDayFees = sevenDayVolume * FEE_RATE

      // APY in percentage, calc from 7 day fees if available, else 1 day. 
      const annualYieldPct = sevenDayVolume > 0 
        ? sevenDayFees * 365 / 7 * 100 / pair.reserveUSD
        : oneDayFees * 365 * 100 / pair.reserveUSD

      return {
        ...pair,
        displayName, 
        oneDayVolume, 
        sevenDayVolume, 
        oneDayFees,
        sevenDayFees, 
        annualYieldPct
      };
    });

  return (
    <div className={classes.root}>
      <SortableTable
        orderBy="reserveUSD"
        title={title}
        {...rest}
        columns={[
          {
            key: "displayName",
            numeric: false,
            render: (row, index) => (
              <Box display="flex" alignItems="center">
                <PairIcon base={row.token0.id} quote={row.token1.id} />
                <Link href={`/pairs/${row.id}`} variant="body2" noWrap>
                  {row.displayName}
                </Link>
              </Box>
            ),
            label: "Name",
          },
          {
            key: "reserveUSD",
            render: (row) => currencyFormatter.format(row.reserveUSD),
            align: "right",
            label: "Liquidity",
          },
          {
            key: "oneDayVolume",
            render: (row) => currencyFormatter.format(row.oneDayVolume),
            align: "right",
            label: "Volume (24h)",
          },
          {
            key: "sevenDayVolume",
            render: (row) => currencyFormatter.format(row.sevenDayVolume),
            align: "right",
            label: "Volume (7d)",
          },
          {
            key: "oneDayFees",
            render: (row) => currencyFormatter.format(row.oneDayFees),
            align: "right",
            label: "Fees (24h)",
          },
          {
            key: "sevenDayFees",
            render: (row) =>
              currencyFormatter.format(row.sevenDayFees),
            align: "right",
            label: "Fees (7d)",
          },
          {
            key: "annualYieldPct",
            render: (row) => <Percent percent={row.annualYieldPct} />,
            align: "right",
            label: "Fees APY%",
          },
        ]}
        rows={rows}
      />
    </div>
  );
}

/*
 * Make a nice pool name
 *
 */
function getDisplayName(pair) {
  const symbol0 = pair.token0.symbol.replace("WAVAX", "AVAX").replace("WETH", "ETH")
  const symbol1 = pair.token1.symbol.replace("WAVAX", "AVAX").replace("WETH", "ETH")
  return `${symbol0}-${symbol1}`
}
