importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyCsDaMhTA02u_19asrfg0mhRiPvlrDF3yo",
  authDomain: "crimesight-e7c58.firebaseapp.com",
  projectId: "crimesight-e7c58",
  storageBucket: "crimesight-e7c58.appspot.com", 
  messagingSenderId: "733708422855",
  appId: "1:733708422855:web:7638918d042eed7a66b8e2",
  measurementId: "G-NF05DZWZKT"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/firebase-logo.png", // optional icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
