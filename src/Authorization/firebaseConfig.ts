import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyBFPpmaYnRzTRFDMyMYwrH1wE_rMXMY7mU",
    authDomain: "tasks-90d23.firebaseapp.com",
    databaseURL: "https://tasks-90d23-default-rtdb.firebaseio.com",
    projectId: "tasks-90d23",
    storageBucket: "tasks-90d23.firebasestorage.app",
    messagingSenderId: "222546983804",
    appId: "1:222546983804:web:b0a45bb87ba9a0cbc542f9",
    measurementId: "G-SLMG7EV67R"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
export const usersCollection = collection(db, "users");
export const tasksCollection = collection(db, "tasks");
