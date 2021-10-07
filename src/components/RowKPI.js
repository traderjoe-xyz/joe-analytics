import { Box, ListItem, Typography } from "@material-ui/core";
import React from "react";
import { formatCurrency } from "app/core";

const formatters = {
  none: (value) => value,
  percent: (value) => (!Number.isNaN(value) ? `${Number(value).toFixed(2)}%` : `0%`),
  integer: (value) => (!Number.isNaN(value) ? parseInt(value) : 0),
  currency: (value) => (!Number.isNaN(value) ? formatCurrency(value) : `$0`),
};

function RowKPI({
  className,
  title = "",
  difference = "",
  value = "",
  valueUSD = "",
  format = "none",
  ...rest
}) {

  return (
    <ListItem style={{ padding: "12px" }}>
      <Box style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <Typography> 
          {title}
        </Typography>
        <Typography style={{ marginLeft: "auto" }}> 
          {formatters[format](value)} 
        </Typography>
      </Box>
    </ListItem>  
  );
}

export default RowKPI;
