import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDZ7Y5Tg0nRttdAZGUdW8uOzRG-4XbA5Ns",
    authDomain: "docugallery-app-8d54a.firebaseapp.com",
    projectId: "docugallery-app-8d54a",
    storageBucket: "docugallery-app-8d54a.firebasestorage.app",
    messagingSenderId: "387632739364",
    appId: "1:387632739364:web:8d71a74ed15dd6104e54b1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);