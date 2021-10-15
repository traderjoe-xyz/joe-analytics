import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';

class BorrowBar extends Component {
  render() {
    return <LinearProgress {...this.props} variant={"determinate"}/>;
  }
}

const styles = props => ({
  colorPrimary: {
    backgroundColor: "#2e5957",
  },
  barColorPrimary: {
    backgroundColor:"#B2DFDB",
  }
});

export default withStyles(styles)(BorrowBar);
