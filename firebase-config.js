// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWIkY9UxaasYzJ0_GFs_Lf_PzKNmkbWqs",
  authDomain: "finalproject-367b7.firebaseapp.com",
  projectId: "finalproject-367b7",
  storageBucket: "finalproject-367b7.appspot.com", 
  messagingSenderId: "569944402024",
  appId: "1:569944402024:web:9b60a5e8ef872cc72133dd",
  measurementId: "G-GV48FSW86W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication setup
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const signInWithGoogle = () => signInWithPopup(auth, provider);

// Firestore setup
export const db = getFirestore(app);

// Firestore Storage (للصور والملفات)
export const storage = getStorage(app);

// Function to get medicines by category
export const getMedicinesByCategory = async (categoryName) => {
  const medicinesRef = collection(db, `pharmacy/${categoryName}/medicines`);
  const snapshot = await getDocs(medicinesRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function to add a new medicine (لو حابة تضيفي أدوية من لوحة تحكم)
export const addMedicine = async (categoryName, medicineData) => {
  const medicinesRef = collection(db, `pharmacy/${categoryName}/medicines`);
  return await addDoc(medicinesRef, medicineData);
};

export {createUserWithEmailAndPassword };
export {signInWithEmailAndPassword };

