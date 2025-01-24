// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDGBuFNpKk07GorLfYM1HFf9ZjdStEgKgA",
  authDomain: "flavour-fleet.firebaseapp.com",
  databaseURL: "https://flavour-fleet-default-rtdb.firebaseio.com",
  projectId: "flavour-fleet",
  storageBucket: "flavour-fleet.firebasestorage.app",
  messagingSenderId: "1006401540153",
  appId: "1:1006401540153:web:2f74ce7b57dff648867de8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export { auth, db, onAuthStateChanged };
