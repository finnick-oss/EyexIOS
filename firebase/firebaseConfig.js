import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';


// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDIUFyvKqUKB1waFEr3d5TLRyztbuZijpE",
  authDomain: "eyexios.firebaseapp.com",
  projectId: "eyexios",
  storageBucket: "eyexios.appspot.com",
  messagingSenderId: "924088052868",
  appId: "1:924088052868:web:16c38ce5ae3284447fa6d1",
  measurementId: "G-EBPFNMSE97"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
