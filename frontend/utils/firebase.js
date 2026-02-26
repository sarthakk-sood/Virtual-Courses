// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "loginvirtualcourses-e78e3.firebaseapp.com",
  projectId: "loginvirtualcourses-e78e3",
  storageBucket: "loginvirtualcourses-e78e3.firebasestorage.app",
  messagingSenderId: "527055032367",
  appId: "1:527055032367:web:7cb4d9a58adf1f4f2436da",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}