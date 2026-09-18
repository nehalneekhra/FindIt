import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBmT2tf8Kp0yTr8Il_dXYAdOF9bKCx5Q4E",
  authDomain: "findit-41562.firebaseapp.com",
  projectId: "findit-41562",
  storageBucket: "findit-41562.firebasestorage.app",
  messagingSenderId: "549811969988",
  appId: "1:549811969988:web:1fe05320684eb2016bce91"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);