import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';
class PurpleBar extends Component {
  render() {
    return <LinearProgress {...this.props} variant={"determinate"}/>;
  }
}

const styles = props => ({
  colorPrimary: {
    backgroundColor: "#4c4766",
  },
  barColorPrimary: {
    backgroundColor: "#cdc5ff",
  }
});

export default withStyles(styles)(PurpleBar);
