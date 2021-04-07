import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimes, faRedo } from '@fortawesome/free-solid-svg-icons';

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
      <div className="synced-media--top-bar">
        <Button className="synced-media--button-close" onClick={props.onClose} >
          <FontAwesomeIcon icon={faTimes} /> Close
        </Button>
      </div>
      <div className="synced-media--body">
        <Button className="synced-media--button-left" onClick={props.onLeft}>
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <div className="synced-media--container">
          { React.Children.only(props.children) }
        </div>
        <Button className="synced-media--button-right" onClick={props.onRight}>
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
    </div>
  );
};
