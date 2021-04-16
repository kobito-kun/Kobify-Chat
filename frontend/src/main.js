import { createApp } from 'vue'
import App from './App.vue'
import socketio from 'socket.io';
import VueSocketIO from 'vue-socket.io';

export const SocketInstance = socketio('http://localhost:3000');

Vue.use(VueSocketIO, SocketInstance)

createApp(App).mount('#app')