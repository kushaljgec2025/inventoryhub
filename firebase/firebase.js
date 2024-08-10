// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAjpc1RSagdRIdVA_wNRAtsQzGXedciiLM",
    authDomain: "myproject-8a725.firebaseapp.com",
    projectId: "myproject-8a725",
    storageBucket: "myproject-8a725.appspot.com",
    messagingSenderId: "161563681914",
    appId: "1:161563681914:web:34a4beeec1904a1a50c7c3",
    measurementId: "G-7593Z19EHX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore }