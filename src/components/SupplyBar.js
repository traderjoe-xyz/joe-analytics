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
    backgroundColor: "#e9edfb",
  },
  barColorPrimary: {
    background: "linear-gradient(180deg, #6CE7D9 0%, #6383E2 100%)",
  }
});

export default withStyles(styles)(SupplyBar);
