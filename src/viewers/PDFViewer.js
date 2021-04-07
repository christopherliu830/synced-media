import React, { useEffect } from 'react';
import * as pdfjs from 'pdfjs-dist';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import 'pdfjs-dist/web/pdf_viewer.css';
import { BaseViewer } from './BaseViewer';
import * as actions from '../core/action-types';
pdfjs.GlobalWorkerOptions.workerSrc = '/js/pdf.worker.min.js';

export const PDFViewer = (props) => {
  const containerRef = React.useRef();
  const viewerRef = React.useRef();
  const [ viewer, setViewer ] = React.useState();

  const { path, page, dispatch } = props.sync;

  // Load PDF
  useEffect(() => {
    if (path && viewer) {
      const loadingTask = pdfjs.getDocument(path)
      console.log(loadingTask.promise);
      loadingTask.promise.then((pdfDocument) => {
        viewer.setDocument(pdfDocument);
        console.log('synced done');
      })
    }
  }, [path, viewer])

  useEffect(() => {
    if (page && viewer) {
      viewer.currentPageNumber = page;
    }
  }, [page, viewer])

  useEffect(() => {
    if (containerRef.current) {
      const viewer = new PDFJSViewer.PDFSinglePageViewer({
        container: containerRef.current,
        eventBus: new PDFJSViewer.EventBus(),
        textLayerMode: 0, // Disable text selection for the PDFs.
      })
      setViewer(viewer);
    }
  }, [containerRef])

  const handleSetPage = (num) => {
    dispatch(actions.SET_STATE, {page: num})
  };

  return (
    <BaseViewer 
      onLeft={() => handleSetPage(viewer.currentPageNumber - 1)}
      onRight={() => handleSetPage(viewer.currentPageNumber + 1)}
      onClose={props.onClose} 
    >
      <div style={{position: 'absolute'}} ref={containerRef}>
        <div ref={viewerRef} />
      </div>
    </BaseViewer>
  )
}
