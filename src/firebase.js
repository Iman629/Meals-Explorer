import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2iCTX1x0kgTNybC4ehc_Q1nC1-4HeJ3Q",
  authDomain: "meals-b24b2.firebaseapp.com",
  projectId: "meals-b24b2",
  storageBucket: "meals-b24b2.firebasestorage.app",
  messagingSenderId: "336897512099",
  appId: "1:336897512099:web:c96932276d52eab899a516"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);