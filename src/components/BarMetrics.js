import React from "react";

import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { KPI } from "app/components";

const useStyles = makeStyles((theme) => ({
    root: {},
    small: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  }));

export default function BarMetrics({metrics, ...rest }) {
    const classes = useStyles();
    
    return (
        <div className={classes.root}>
            <Grid item xs={12}>
            <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <KPI title="APY (24h)" value={metrics.apyDay} format="percent" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <KPI title="APY (Avg)" value={metrics.apyAvg} format="percent" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <KPI title="xJoe" value={metrics.totalSupply} format="integer" />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <KPI title="xJoe:Joe" value={metrics.ratio} />
            </Grid>
            </Grid>
        </Grid>
      </div>
    )
}
