import firebase from "firebase/app";

import "firebase/messaging";
const initializedFirebaseApp = firebase.initializeApp({
  // Project Settings => Add Firebase to your web app
  apiKey: "AIzaSyBktMSARrymotiQkTz0bPp9Oy__3CGHoXs",
  authDomain: "pte-benchmark.firebaseapp.com",
  databaseURL: "https://pte-benchmark.firebaseio.com",
  projectId: "pte-benchmark",
  storageBucket: "pte-benchmark.appspot.com",
  messagingSenderId: "201534765862",
  appId: "1:201534765862:web:3afdaa8559d7585aa61fe7",
  measurementId: "G-ELW20SVYX4",
});
let messaging = null;
if (process.browser) {
  if (window.Notification && firebase.messaging.isSupported()) {
    messaging = initializedFirebaseApp.messaging();
    messaging.usePublicVapidKey(
      // Project Settings => Cloud Messaging => Web Push certificates
      "BCu4PmY7WiN_bGjp-FKxc67U55_DLlbZ51hfBShzRqtBZlsX9teT7e7ukmSgy6Fi2zVyqW19c-tOLpqevh_xsl8"
    );
  }
}
export { messaging };
