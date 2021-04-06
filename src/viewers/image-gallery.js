import * as actions from '../action-types';
import Panzoom from '@panzoom/panzoom';
import { debounce } from 'lodash';

const html = `
  <div class="synced-pdf--image-gallery"></div>
`;


/**
 * inspired by pdfjs/web/base_viewer.js
 */
export class ImageGalleryViewer {

  constructor(imageConfig, container, events) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    this.domElement = template.content.firstChild;

    this._imageViews = [];
    this._previousImageNumber = 1;
    this._currentImageNumber = 1;

    for(let i = 0; i < imageConfig.images.length; i++) {
      const view = new ImageView(imageConfig.images[i]);
      this._imageViews.push(view);
    }

    this._shadowViewer = document.createDocumentFragment();
    container.innerHTML = '';
    container.appendChild(this.domElement);
    this.container = container;

    this._enablePanzoom();
    this._update();

    this.events = events;
    this.events.on(actions.SET_PAGE, this._handleSetImage);
    this.events.on(actions.SET_MATRIX, this._handlePanzoom);
  }

  static create(config, container, eventBus) {
    return new ImageGalleryViewer(config, container, eventBus);
  }

  get currentPageNumber() {
    return this._currentImageNumber;
  }
  set currentPageNumber(value) {
    if (value == 0) this._currentImageNumber = this._imageViews.length;
    else this._currentImageNumber = ((value - 1) % this._imageViews.length) + 1;
    this._update();
  }

  get pagesRotation() {
    return 0;
  }
  set pagesRotation(value) {
  }

  /**
   * Immediately call onload when set, since image 
   * galleries load immediately.
   */
  set onload(value) {
    value();
  }

  setPanzoom = ({scale, x, y}) => {
    const imageNo = this.currentPageNumber - 1;
    const image = this._imageViews[imageNo];

    const { width, height } = image;

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

  close() {
    this.events.off(actions.SET_PAGE, this._handleSetImage);
    this.events.off(actions.SET_MATRIX, this._handlePanzoom);
    this.domElement.removeEventListener('panzoomend', this._handleLocalPanzoomChange);
    this.container.removeEventListener('wheel', this._handleWheel);
    this.panzoom?.destroy();
  }

  _update = () => {
    const imageView = this._imageViews[this._currentImageNumber - 1];
    const previousImageView = this._imageViews[this._previousImageNumber - 1];

    const viewerNodes = this.domElement.childNodes;
    switch(viewerNodes.length) {
      case 0:
        this.domElement.appendChild(imageView.div);
        break;
      case 1:
        if (viewerNodes[0] !== previousImageView.div) {
          throw new Error('_update: Unexpected previous image');
        }
        if (imageView === previousImageView) {
          break;
        };
        // Switch out the images.
        this._shadowViewer.appendChild(previousImageView.div);
        this.domElement.appendChild(imageView.div);
        break;
      default:
        throw new Error('_update: Should only expect 1 image shown')
    }

    this._previousImageNumber = this._currentImageNumber;
  }

  _enablePanzoom = () => {
    this.panzoom = Panzoom(this.domElement, {
      setTransform: (elem, to) => {
        this.setPanzoom(to);
      }
    });
    this.container.addEventListener('wheel', this._handleWheel);
    this.domElement.addEventListener('panzoomend', this._handleLocalPanzoomChange);
  }

  /**
   * Handler for when the pan/zoom changes locally (i.e. user interaction)
   */
  _handleLocalPanzoomChange = debounce(({detail}) => {
    this.events.emit(actions.SET_MATRIX, detail);
  }, 50)

  /**
   * Handler for when the pan/zoom changes from remote. Don't trigger
   * a panzoomend event.
   */
  _handlePanzoom = (to) => {
    this.setPanzoom(to);
  }

  _handleSetImage = (number) => {
    this.currentPageNumber = number;
  }

  _handleWheel = (event) => {
    this.panzoom?.zoomWithWheel(event);
  }
}

class ImageView {
  constructor(options) {
    this.div = document.createElement('div');
    const image = new Image();
    image.src = options.src;
    image.onload = this._onload;
    this.image = image;
    this.div.appendChild(image);
  }

  _onload = () => {
    this.width = this.image.width;
    this.height = this.image.height;
  }
}
