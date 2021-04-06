import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BaseViewer } from './BaseViewer';

export const GalleryViewer = (props) => {
  useEffect(() => {
  }, [props.sync.content])

  return (
    <BaseViewer onClose={props.onClose} >
      <div>PDF!</div>
    </BaseViewer>
  )
}