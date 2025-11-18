import * as model from "../models/products.model.js";

/**
 * Obtener todos los productos
 */
export const getAllProducts = async () => {
  return await model.getAll();
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (id) => {
  const product = await model.getById(id);
  
  if (!product) {
    throw new Error("Producto no encontrado");
  }
  
  return product;
};

/**
 * Crear un nuevo producto
 */
export const createProduct = async (data) => {
  // Validaciones básicas
  if (!data.name || !data.price) {
    throw new Error("Nombre y precio son requeridos");
  }
  
  // Validar que el precio sea un número positivo
  if (typeof data.price !== "number" || data.price <= 0) {
    throw new Error("El precio debe ser un número positivo");
  }
  
  return await model.create(data);
};

/**
 * Actualizar un producto
 */
export const updateProduct = async (id, data) => {
  // Verificar que el producto existe
  const existingProduct = await model.getById(id);
  if (!existingProduct) {
    throw new Error("Producto no encontrado");
  }
  
  // Validar precio si se está actualizando
  if (data.price !== undefined && (typeof data.price !== "number" || data.price <= 0)) {
    throw new Error("El precio debe ser un número positivo");
  }
  
  return await model.update(id, data);
};

/**
 * Eliminar un producto
 */
export const deleteProduct = async (id) => {
  // Verificar que el producto existe
  const existingProduct = await model.getById(id);
  if (!existingProduct) {
    throw new Error("Producto no encontrado");
  }
  
  return await model.remove(id);
};

