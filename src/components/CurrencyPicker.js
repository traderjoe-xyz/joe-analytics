import {
  Box,
  Button,
  Typography,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";

import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  currencySwitch: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
  },
}));

export default function CurrencyPicker({ useUSD, onCurrencySwitch }) {
  const theme = useTheme();
  const classes = useStyles();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <>
      <div style={{ position: "absolute", left: 12, bottom: 20 }}>
        <div className={classes.currencySwitch}>
          <Button
            type="button"
            value="USD"
            aria-label="USD currency"
            variant={useUSD ? "contained" : "outlined"}
            size="small"
            color="default"
            onClick={onCurrencySwitch}
          >
            USD
          </Button>
          <Button
            type="button"
            value="AVAX"
            aria-label="AVAX currency"
            variant={useUSD ? "outlined" : "contained"}
            size="small"
            color="default"
            onClick={onCurrencySwitch}
          >
            AVAX
          </Button>
        </div>
      </div>
    </>
  );
}
