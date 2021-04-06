import React from 'react';
import { MediaSyncContext, MediaSync } from './sync';

export const MediaSwitch = (props) => {
  return (
    <MediaSync>
      <MediaSyncContext.Consumer>
        {sync => {
          let match, element;
          React.Children.forEach(props.children, child => {
            if (match == null && React.isValidElement(child)) {
              element = child;
              const typeID = child.props.type;
              match = child.props.type === sync.type ? sync.type : null;
            }
          });

          return match
            ? React.cloneElement(element, { sync, onClose: props.onClose })
            : null;
        }}
      </MediaSyncContext.Consumer>
    </MediaSync>
  )
}
