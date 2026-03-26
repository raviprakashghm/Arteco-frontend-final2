import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZz0KfwIuzA5P6rGjTXbFnmzNAjrG_vzI",
  authDomain: "arteco-5fd7a.firebaseapp.com",
  projectId: "arteco-5fd7a",
  storageBucket: "arteco-5fd7a.firebasestorage.app",
  messagingSenderId: "528306781487",
  appId: "1:528306781487:web:087e32b2695e8745f7f5da",
  measurementId: "G-V0Z42LG7M1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
