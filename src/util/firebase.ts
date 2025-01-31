// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDGBuFNpKk07GorLfYM1HFf9ZjdStEgKgA",
  authDomain: "flavour-fleet.firebaseapp.com",
  databaseURL: "https://flavour-fleet-default-rtdb.firebaseio.com",
  projectId: "flavour-fleet",
  storageBucket: "flavour-fleet.firebasestorage.app",
  messagingSenderId: "1006401540153",
  appId: "1:1006401540153:web:2f74ce7b57dff648867de8",
};

const firebaseConfig2 = {
  apiKey: "AIzaSyDwHkkIpte86JXQ6sja6HydSOzb840BMiU",
  authDomain: "yumhub-d8edd.firebaseapp.com",
  projectId: "yumhub-d8edd",
  storageBucket: "yumhub-d8edd.appspot.com",
  messagingSenderId: "12957115981",
  appId: "1:12957115981:web:f3201f6d21ebe023c2de04",
};

const app = initializeApp(firebaseConfig);
// Initialize Firebase
const app2 = initializeApp(firebaseConfig2, "storage");

// Initialize Firebase

const auth1 = getAuth(app);

const db1 = getFirestore(app);
const storage1 = getStorage(app2);

export { auth1, db1, storage1, onAuthStateChanged };
