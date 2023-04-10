// import firebase from "firebase/compat/app";
// import "firebase/auth";
// import "firebase/storage";
// import "firebase/firestore";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

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
// firebase.initializeApp(firebaseConfig);

// export default firebase;
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
export const storage = getStorage(app);
export const database = getDatabase(app);
