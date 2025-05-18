import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAV1qLGtSI6n7qjEUX76Nawn0CD9kaq4YM",
  authDomain: "globetube-b0e8b.firebaseapp.com",
  projectId: "globetube-b0e8b",
  storageBucket: "globetube-b0e8b.firebasestorage.app",
  messagingSenderId: "480962392780",
  appId: "1:480962392780:web:686980ed71382aa1164869",
  measurementId: "G-JDWTK5K79G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;