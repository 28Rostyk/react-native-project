// import firebase from "firebase/app";
// import "firebase/auth";
// import "firebase/storage";
// import "firebase/firestore";

// import * as firebase from "firebase";
// import "firebase/auth";
// import "firebase/storage";
// import "firebase/firestore";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/storage";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA50LFXWxSPMEz40OBufp6iMgvg1INvNnc",
  authDomain: "rn-social-1b4f7.firebaseapp.com",
  projectId: "rn-social-1b4f7",
  storageBucket: "rn-social-1b4f7.appspot.com",
  messagingSenderId: "669222814430",
  appId: "1:669222814430:web:9e99f2791143cf3551b84f",
  measurementId: "G-MNY78EQRLH",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
