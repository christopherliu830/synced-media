import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { BaseViewer } from './BaseViewer';

export const PDFViewer = (props) => {
  console.log('pdf viewrrerrrr', props.sync);

  useEffect(() => {
  }, [props.sync.content])

  return (
    <BaseViewer onClose={props.onClose} >
      <div>PDF!</div>
    </BaseViewer>
  )
}

PDFViewer.propTypes = {
  onClose: PropTypes.func,
}