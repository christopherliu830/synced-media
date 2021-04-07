import React, { useEffect } from 'react';
import Socket from './socket';
import * as actions from './action-types';

export const MediaSyncContext = React.createContext();

export const MediaSync = (props) => {
  const [ socket ] = React.useState(Socket);
  const dispatch = socket.emit.bind(socket);

  const [ sync, setSync ] = React.useState({ dispatch }); 

  const handleOpen = (state) => {
    setSync({...state, dispatch});
  }
  
  const handleClose = () => {
    // Clear state
    setSync({ });
  }

  const handleStateUpdate = (newState) => {
    setSync(oldState => ({...oldState, ...newState, dispatch}));
  }

  useEffect(() => {
    if (socket) {
      console.log(props.room);
      socket.emit(actions.JOIN, props.room);
      socket.emit(actions.CLAIM_HOST, true);
      socket.on(actions.SET_STATE, handleStateUpdate);
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