import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCsDaMhTA02u_19asrfg0mhRiPvlrDF3yo",
  authDomain: "crimesight-e7c58.firebaseapp.com",
  projectId: "crimesight-e7c58",
  storageBucket: "crimesight-e7c58.firebasestorage.app",
  messagingSenderId: "733708422855",
  appId: "1:733708422855:web:7638918d042eed7a66b8e2",
  measurementId: "G-NF05DZWZKT"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };