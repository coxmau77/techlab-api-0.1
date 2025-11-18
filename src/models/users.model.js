import { 
  collection, 
  getDoc, 
  doc, 
  addDoc, 
  query,
  where,
  getDocs
} from "firebase/firestore";
import { db } from "../config/firebase.js";
import bcrypt from "bcryptjs";

const COLLECTION_NAME = "users";

/**
 * Buscar usuario por username
 */
export const findByUsername = async (username) => {
  try {
    const usersCollection = collection(db, COLLECTION_NAME);
    const q = query(usersCollection, where("username", "==", username));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const userDoc = snapshot.docs[0];
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    throw error;
  }
};

/**
 * Buscar usuario por email
 */
export const findByEmail = async (email) => {
  try {
    const usersCollection = collection(db, COLLECTION_NAME);
    const q = query(usersCollection, where("email", "==", email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const userDoc = snapshot.docs[0];
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error("Error al buscar usuario por email:", error);
    throw error;
  }
};

/**
 * Crear un nuevo usuario
 */
export const create = async (userData) => {
  try {
    const usersCollection = collection(db, COLLECTION_NAME);
    
    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const userDoc = {
      username: userData.username,
      email: userData.email,
      password: hashedPassword, // Guardar contraseña hasheada
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const docRef = await addDoc(usersCollection, userDoc);
    
    // Retornar usuario sin la contraseña
    const { password, ...userWithoutPassword } = userDoc;
    
    return {
      id: docRef.id,
      ...userWithoutPassword
    };
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

/**
 * Verificar contraseña
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

