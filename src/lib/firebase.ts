import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB2TNfCiRHG15B8WxOw-wvVgGt3V6ODqxI",
  authDomain: "employee-81134.firebaseapp.com",
  projectId: "employee-81134",
  storageBucket: "employee-81134.appspot.com",
  messagingSenderId: "305128820101",
  appId: "1:305128820101:web:21f459a2b8876fc59148ec",
  measurementId: "G-E2VVPGE1W3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
