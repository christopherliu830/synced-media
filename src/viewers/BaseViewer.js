import React from 'react';
import PropTypes from 'prop-types';

import {
  Button,
  makeStyles
} from '@material-ui/core';
import { useSyncedMedia } from '../core/sync';

const useStyles = makeStyles(() => ({
  root: {
    color: 'white',
    background: 'black',
    flexFlow: 'column nowrap',
    position: 'fixed',
    display: 'flex',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  topBar: {
    display: 'flex',
    flex: '0 0 2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  closeButton: {
    marginLeft: 'auto',
  },
  button: {
    color: 'white',
    background: 'black',
    borderRadius: 0,
  },
  body: {
    flex: '1 1 auto',
    width: '100%', 
    minHeight: 0,
    display: 'flex',
    alignItems: 'stretch',
  },
  container: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
    overflow: 'scroll',
  }
}))

const StyledButton = (props) => {
  const classes = useStyles();
  return (
    <Button 
      classes={{
        root: classes.button
      }}
      {...props} 
    />
  )
}

export const BaseViewer = (props) => {
  const classes = useStyles();
  return (
    <div id="synced-media-viewer" className={classes.root}>
      <div className={classes.topBar}>
        <StyledButton onClick={props.onRotate}>Rotate</StyledButton>
        <StyledButton onClick={props.onClose} className={classes.closeButton}>Close</StyledButton>
      </div>
      <div className={classes.body}>
        <StyledButton onClick={props.onLeft}>L</StyledButton>
        <div className={classes.container}>
          { React.Children.only(props.children) }
        </div>
        <StyledButton onClick={props.onRight}>R</StyledButton>
      </div>
    </div>
  );
};

BaseViewer.propTypes = {
  onLeft: PropTypes.func,
  onRight: PropTypes.func,
  onClose: PropTypes.func,
  onRotate: PropTypes.func,
}