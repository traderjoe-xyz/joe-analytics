import {
  AccountTreeOutlined,
  AppsOutlined,
  Brightness4,
  Brightness4Outlined,
  Brightness7,
  CloseOutlined,
  DashboardOutlined,
  DetailsOutlined,
  ExpandLess,
  ExpandMore,
  FastfoodOutlined,
  FiberNewOutlined,
  HistoryOutlined,
  LinkOutlined,
  ListAltOutlined,
  Menu,
  MoneyOutlined,
  RadioButtonUncheckedOutlined,
  ReorderOutlined,
  SettingsEthernetOutlined,
  StarBorder,
  TrendingDownOutlined,
  TrendingUpOutlined,
  ViewStreamOutlined,
  WavesOutlined,
} from "@material-ui/icons";
import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";

import Joe from "./Joe";
import { useRouter } from "next/router";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {},
  list: {
    // "& > *": {
    //   paddingLeft: theme.spacing(3),
    // },
  },
  nested: {
    paddingLeft: theme.spacing(3),
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
}));

export default function AppNavigation() {
  const classes = useStyles();
  const theme = useTheme();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const [address, setAddress] = React.useState("");

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <div classes={classes.root}>
      <div className={classes.toolbar}>
        <Hidden smUp implementation="css">
          <Box display="flex" alignItems="center" py={0.5}>
            <IconButton edge={false} onClick={() => router.push("/")}>
              <Joe />
            </IconButton>
            <Typography variant="subtitle1" color="textPrimary" noWrap>
              Trader Joe
            </Typography>
          </Box>
        </Hidden>
      </div>
      <List className={classes.list} direction="horizontal">
        <ListItem
          key="/"
          button
          selected={router.pathname === "/"}
          onClick={() => router.push("/")}
        >
          <ListItemIcon>
            <DashboardOutlined />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>

        <ListItem
          key="/stake"
          button
          selected={router.pathname === "/stake"}
          onClick={() => router.push("/stake")}
        >
          <ListItemIcon>
            <FastfoodOutlined />
          </ListItemIcon>
          <ListItemText primary="Stake" />
        </ListItem>

        <ListItem
          key="/pools"
          button
          selected={router.pathname === "/pools"}
          onClick={() => router.push("/pools")}
        >
          <ListItemIcon>
            <WavesOutlined />
          </ListItemIcon>
          <ListItemText primary="Pools" />
        </ListItem>

        <ListItem
          key="/pairs"
          button
          selected={router.pathname === "/pairs"}
          onClick={() => router.push("/pairs")}
        >
          <ListItemIcon>
            <LinkOutlined />
          </ListItemIcon>
          <ListItemText primary="Pairs" />
        </ListItem>

        <ListItem
          key="/tokens"
          button
          selected={router.pathname.includes("tokens")}
          onClick={() => router.push("/tokens")}
        >
          <ListItemIcon>
            <MoneyOutlined />
          </ListItemIcon>
          <ListItemText primary="Tokens" />
        </ListItem>
        <ListItem
          button
          key="/portfolio"
          selected={router.pathname.includes("/portfolio")}
          onClick={() => {
            const defaultAddress = localStorage.getItem("defaultAddress");
            if (defaultAddress) {
              router.push("/users/" + defaultAddress);
            } else {
              handleClickOpen();
            }
          }}
        >
          <ListItemIcon>
            <AccountTreeOutlined />
          </ListItemIcon>
          <ListItemText primary="Portfolio" />
        </ListItem>
        <ListItem
          button
          key="/lending"
          selected={router.pathname.includes("/lending")}
          onClick={() => router.push("/lending")}
        >
          <ListItemIcon>
            <StarBorder />
          </ListItemIcon>
          <ListItemText primary="Lending" />
        </ListItem>
      </List>
      <Dialog
        maxWidth="sm"
        open={dialogOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Portfolio</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter an address and click load.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            onChange={(event) => {
              setAddress(event.target.value);
            }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              localStorage.setItem("defaultAddress", address);
              router.push("/users/" + address);
              handleClose();
            }}
            color="primary"
          >
            Load
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
