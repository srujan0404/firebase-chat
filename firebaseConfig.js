// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getReactNativePersistence, initializeAuth} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getFirestore, collection} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6xuZiU4o4gzDub0jHmg2QlBAdxWmkU40",
  authDomain: "fir-chat-a87b9.firebaseapp.com",
  projectId: "fir-chat-a87b9",
  storageBucket: "fir-chat-a87b9.appspot.com",
  messagingSenderId: "279320801372",
  appId: "1:279320801372:web:69a5a77c604ad430cf7699",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const usersRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');