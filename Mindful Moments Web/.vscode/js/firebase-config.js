// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5p8AlNyYdRNV-rVGEJIo6WriISUFlE9o",
  authDomain: "mindful-moments-b2c2d.firebaseapp.com",
  projectId: "mindful-moments-b2c2d",
  storageBucket: "mindful-moments-b2c2d.firebasestorage.app",
  messagingSenderId: "808563569743",
  appId: "1:808563569743:web:6630bda7f0fd54a94ca63a",
  measurementId: "G-TMM1YEPGT6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);