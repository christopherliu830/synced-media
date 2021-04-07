import React from 'react';

// import {
//   Button,
//   makeStyles
// } from '@material-ui/core';
import { useSyncedMedia } from '../core/sync';


const Button = (props) => {
  return (
    <button className="synced-media--button" {...props} />
  )
}

export const BaseViewer = (props) => {
  const classes = {};
  return (
    <div className="synced-media--root">
      <div className="synced-media--header">
        <Button onClick={props.onRotate}>Rotate</Button>
        <Button onClick={props.onClose} >Close</Button>
      </div>
      <div className="synced-media--body">
        <Button onClick={props.onLeft}>L</Button>
        <div className="synced-media--container">
          { React.Children.only(props.children) }
        </div>
        <Button onClick={props.onRight}>R</Button>
      </div>
    </div>
  );
};
