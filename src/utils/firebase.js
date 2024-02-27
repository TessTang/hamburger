import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCshhPg6NX7GyFg1U5-DlvOIFhZTCb0kUo",
    authDomain: "hamburger-1beeb.firebaseapp.com",
    projectId: "hamburger-1beeb",
    storageBucket: "hamburger-1beeb.appspot.com",
    messagingSenderId: "175226307687",
    appId: "1:175226307687:web:25f1064f4a61d2b66cc0c2"
};

const app = initializeApp(firebaseConfig);

export const auth =  getAuth(app);
export const db = getFirestore(app);