import React, { useEffect } from 'react';
import { BaseViewer } from './BaseViewer';

export const GalleryViewer = (props) => {
  useEffect(() => {
  }, [props.sync.content])

  return (
    <BaseViewer onClose={props.onClose} >
      <div>Not Implemented</div>
    </BaseViewer>
  )
}