// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_KEY1,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN1,
  databaseURL: process.env.REACT_APP_DATABASE_URL1,
  projectId: process.env.REACT_APP_PROJECT_ID1,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET1,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID1,
  appId: process.env.REACT_APP_APP_ID1,
};

const firebaseConfig2 = {
  apiKey: process.env.REACT_APP_KEY2,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN2,
  projectId: process.env.REACT_APP_PROJECT_ID2,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET2,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID2,
  appId: process.env.REACT_APP_APP_ID2,
};

const app = initializeApp(firebaseConfig);
// Initialize Firebase
const app2 = initializeApp(firebaseConfig2, "storage");

// Initialize Firebase

const auth1 = getAuth(app);

const db1 = getFirestore(app);
const storage1 = getStorage(app2);

export { auth1, db1, storage1, onAuthStateChanged };
