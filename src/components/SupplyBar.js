import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';
class SupplyBar extends Component {
  render() {
    return <LinearProgress {...this.props} variant={"determinate"}/>;
  }
}

const styles = props => ({
  colorPrimary: {
    backgroundColor: "#a1916c",
  },
  barColorPrimary: {
    backgroundColor: "#ffe7ac",
  }
});

export default withStyles(styles)(SupplyBar);
