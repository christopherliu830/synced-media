import { MediaSwitch } from './core/MediaSwitch';
import { PDFViewer } from './viewers/PDFViewer';
import { BaseViewer } from './viewers/BaseViewer';
import { GalleryViewer } from './viewers/GalleryViewer';
import socket from './core/socket';
import * as actions from './core/action-types';

import './styles/index.scss';

/**
 * @param {Object} options
 * @param {Object} options.room the room name to join.
 * @param {Object} options.member member data.
 */
export const init = (options) => {
}

export default {
  open(path) {
    console.log('synced-media', path);
    console.log('synced-media', socket);
    console.log(socket.emit)
    socket.emit(actions.OPEN, path);
  },
  close() {
    socket.emit(actions.CLOSE);
  }
}

export {
  MediaSwitch as SyncedMedia,
  PDFViewer,
  GalleryViewer,
  BaseViewer,
};
