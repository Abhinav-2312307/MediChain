import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyApU7jWOE-LU2BK4on9RdqhgZAQ3Ade8Ug",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "retailgeniusai.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "retailgeniusai",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "retailgeniusai.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "119502277011",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID || "1:119502277011:web:cd31539a0a02d79f434066",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, GoogleAuthProvider };
