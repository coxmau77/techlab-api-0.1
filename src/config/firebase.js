import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import dotenv from "dotenv";

dotenv.config();

// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con tus credenciales reales de Firebase
const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || "tu-proyecto-id",
  // Si tienes todas las credenciales, Firebase funcionará mejor
  ...(process.env.FIREBASE_API_KEY && { apiKey: process.env.FIREBASE_API_KEY }),
  ...(process.env.FIREBASE_AUTH_DOMAIN && {
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  }),
  ...(process.env.FIREBASE_STORAGE_BUCKET && {
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  }),
  ...(process.env.FIREBASE_MESSAGING_SENDER_ID && {
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  }),
  ...(process.env.FIREBASE_APP_ID && { appId: process.env.FIREBASE_APP_ID }),
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

console.log("✅ Firebase conectado correctamente");
