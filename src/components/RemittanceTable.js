import React from "react";
import { formatCurrency, formatDecimal } from "app/core";
import { makeStyles } from "@material-ui/core/styles";
import SortableTable from "./SortableTable";
import { timeFormat } from "d3-time-format";

const formatDate = timeFormat("%x %X");

const useStyles = makeStyles((theme) => ({
  root: {},
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const RemittanceTable = ({ remittances, ...rest }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <SortableTable
        title="Remittances"
        columns={[
          {
            key: "timestamp",
            label: "Date",
            render: (row) => formatDate(new Date(row.timestamp * 1000))
          },
          {
            key: "fees",
            label: "Fees collected",
            render: (row) => `${formatDecimal(row.amount0)} ${row.token0Symbol} / ${formatDecimal(row.amount1)} ${row.token1Symbol}`
          },
          {
            key: "tokenRemitted",
            label: "Token remitted",
            render: (row) => `${formatDecimal(row.tokenRemitted)} USDC`
          },
          {
            key: "usdRemitted",
            label: "USD remitted",
            render: (row) => formatCurrency(row.usdRemitted)
          },
        ]}
        rows={remittances}
        {...rest}
      />
    </div>
  );
}

export default RemittanceTable