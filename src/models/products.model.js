import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";
import { db } from "../config/firebase.js";

const COLLECTION_NAME = "products";

/**
 * Obtener todos los productos
 */
export const getAll = async () => {
  try {
    const productsCollection = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(productsCollection);
    
    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return products;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    throw error;
  }
};

/**
 * Obtener un producto por ID
 */
export const getById = async (id) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    const productSnap = await getDoc(productRef);
    
    if (!productSnap.exists()) {
      return null;
    }
    
    return {
      id: productSnap.id,
      ...productSnap.data()
    };
  } catch (error) {
    console.error("Error al obtener producto:", error);
    throw error;
  }
};

/**
 * Crear un nuevo producto
 */
export const create = async (data) => {
  try {
    const productsCollection = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(productsCollection, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

/**
 * Actualizar un producto
 */
export const update = async (id, data) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(productRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    
    return id;
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

/**
 * Eliminar un producto
 */
export const remove = async (id) => {
  try {
    const productRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(productRef);
    
    return id;
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    throw error;
  }
};

