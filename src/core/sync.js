import React, { useEffect } from 'react';
import Socket from './socket';
import * as actions from './action-types';

export const MediaSyncContext = React.createContext();

export const MediaSync = (props) => {
  const [ sync, setSync ] = React.useState({}); 
  const [ socket ] = React.useState(Socket);

  const handleOpen = (p) => {
    setSync((old) => ({ ...old, ...p }));
  }
  
  const handleClose = () => {
    // Clear state
    setSync({});
  }

  useEffect(() => {
    if (socket) {
      console.log(props.room);
      socket.emit(actions.JOIN, props.room);
      socket.on(actions.OPEN, handleOpen);
      socket.on(actions.CLOSE, handleClose);
      return () => {
        socket.off(actions.OPEN, handleOpen)
        socket.off(actions.CLOSE, handleClose);
      }
    }
  }, [socket])

  return (
    <MediaSyncContext.Provider
      value={sync}
      children={props.children || null}
    />
  )
}

export const useSyncedMedia = () => React.useContext(MediaSyncContext);

export const withSync = () => (Component) => {
  return (props) => (
    <MediaSyncContext.Consumer>
      {value => <Component sync={value}/>}
    </MediaSyncContext.Consumer>
  )
}