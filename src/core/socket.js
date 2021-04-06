import { io } from 'socket.io-client';
import { JOIN } from './action-types';

const socket = io('/synced-media', { secure: true });
socket.emit(JOIN, 'synced-media-room');
export default socket;
