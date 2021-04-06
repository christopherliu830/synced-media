import * as PDFJS from 'pdfjs-dist/webpack';
import * as PDFJSViewer from 'pdfjs-dist/web/pdf_viewer';
import Panzoom from '@panzoom/panzoom';
import { debounce } from 'lodash';
import * as actions from '../action-types';
import 'pdfjs-dist/web/pdf_viewer.css';

/**
 * PDF Viewer with panzoom functionality.
 *
 * @typedef {Object} PDFViewerOptions
 * @property {HTMLDivElement} container - The container for the viewer element.
 * @property {HTMLDivElement} [viewer] - The viewer element.
 * @property {EventBus} eventBus - The application event bus.
 * @property {IPDFLinkService} linkService - The navigation/linking service.
 * @property {DownloadManager} [downloadManager] - The download manager
 *   component.
 * @property {PDFFindController} [findController] - The find controller
 *   component.
 * @property {PDFScriptingManager} [scriptingManager] - The scripting manager
 *   component.
 * @property {PDFRenderingQueue} [renderingQueue] - The rendering queue object.
 * @property {boolean} [removePageBorders] - Removes the border shadow around
 *   the pages. The default value is `false`.
 * @property {number} [textLayerMode] - Controls if the text layer used for
 *   selection and searching is created, and if the improved text selection
 *   behaviour is enabled. The constants from {TextLayerMode} should be used.
 *   The default value is `TextLayerMode.ENABLE`.
 * @property {string} [imageResourcesPath] - Path for image resources, mainly
 *   mainly for annotation icons. Include trailing slash.
 * @property {boolean} [renderInteractiveForms] - Enables rendering of
 *   interactive form elements. The default value is `true`.
 * @property {boolean} [enablePrintAutoRotate] - Enables automatic rotation of
 *   landscape pages upon printing. The default is `false`.
 * @property {string} renderer - 'canvas' or 'svg'. The default is 'canvas'.
 * @property {boolean} [enableWebGL] - Enables WebGL accelerated rendering for
 *   some operations. The default value is `false`.
 * @property {boolean} [useOnlyCssZoom] - Enables CSS only zooming. The default
 *   value is `false`.
 * @property {number} [maxCanvasPixels] - The maximum supported canvas size in
 *   total pixels, i.e. width * height. Use -1 for no limit. The default value
 *   is 4096 * 4096 (16 mega-pixels).
 * @property {IL10n} l10n - Localization service.
 * @property {boolean} [enableScripting] - Enable embedded script execution
 *   (also requires {scriptingManager} being set). The default value is `false`.
 */
export class PDFViewer extends PDFJSViewer.PDFSinglePageViewer {
  constructor(options) {
    super(options)
    this.eventBus.on('pagesinit', () => {
      this._enablePanzoom();
      this.onload && this.onload();
    });
  }

  /**
   * Load a PDF.
   * @param {HTMLElement} el element to load pdf into.
   */
  static create(path, container, events) {
    const loadingTask = PDFJS.getDocument(path);

    container.innerHTMl = '';
    const div = document.createElement('div');
    container.appendChild(div);
    this.container = container;

    const viewer = new PDFViewer({
      container: container,
      // The PDF Viewer uses its own event bus for internal events
      eventBus: new PDFJSViewer.EventBus(),
      textLayerMode: 0, // Disable text selection for the PDFs.
    })

    viewer.events = events;
    viewer.events.on(actions.SET_MATRIX, viewer._handlePanzoom);
    viewer.events.on(actions.SET_PAGE, viewer._handleSetPage);
    viewer.events.on(actions.SET_ROTATION, viewer._handleRotation)
    loadingTask.promise.then((pdfDocument) => {
      viewer.setDocument(pdfDocument);
    })

    return viewer;
  }

  setPanzoom = ({scale, x, y}) => {

    // Not enabled yet, wait until later
    if (!this.panzoom) {
      this._pendingSetPanzoom = { scale, x, y };
      return;
    }

    const pageNo = this.currentPageNumber - 1;
    const page = this.getPageView(pageNo);
    const { width, height } = page.viewport;

    // Clamp transitions
    const minX = -width/2;
    const maxX = width/2;
    const minY = -height/2;
    const maxY = height/2;
    if (x < minX) {
      this.panzoom.pan(minX, y);
    } else if (x > maxX) {
      this.panzoom.pan(maxX, y);
    } else if (y < minY) {
      this.panzoom.pan(x, minY);
    } else if (y > maxY) {
      this.panzoom.pan(x, maxY);
    } else {
      this.panzoom.setStyle('transform', `scale(${scale}) translate(${x}px, ${y}px)`);
    }
  }

  _enablePanzoom = () => {
    this.panzoom = Panzoom(this.viewer, {
      setTransform: (elem, to) => {
        this.setPanzoom(to);
      }
    });

    this._pendingSetPanzoom && this.setPanzoom(this._pendingSetPanzoom);

    // Add a callback to the DOM element for when the user pans the div.
    this.viewer.addEventListener('panzoomend', this._handleLocalPanzoomChange);
    this.container.addEventListener('wheel', this._handleWheel);
  }

  _handlePanzoom = (to) => {
    this.setPanzoom(to);
  }

  _handleLocalPanzoomChange = debounce(({detail}) => {
    this.events.emit(actions.SET_MATRIX, detail);
  }, 100)


  _handleSetPage = (page) => {
    if (!this.pdfDocument) return;
    if (page < 1 || page > this.pdfDocument.numPages) return;
    this.currentPageNumber = page;
  }

  _handleRotation = (degrees) => {
    this.pagesRotation = degrees;
  }

  _handleWheel = (event) => {
    this.panzoom?.zoomWithWheel(event);
  }


  close = () => {
    this.events.off(actions.SET_MATRIX, this._handlePanzoom);
    this.events.off(actions.SET_PAGE, this._handleSetPage);
    this.events.off(actions.SET_ROTATION, this._handleRotation)
    this.viewer.removeEventListener('panzoomend', this._handleLocalPanzoomChange);
    this.container.removeEventListener('wheel', this._handleWheel);
    this.panzoom?.destroy();
  }

  /**
   * Override the currentPageNumber getter/setter so that
   * the page view gets reset
   */
  set currentPageNumber(val) {
    super.currentPageNumber = val;
    this.panzoom?.reset();
  }

  get currentPageNumber() {
    return super.currentPageNumber;
  }
}
