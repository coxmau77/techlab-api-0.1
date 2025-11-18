import * as service from "../services/products.service.js";

/**
 * Obtener todos los productos
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await service.getAllProducts();
    res.status(200).json({
      success: true,
      data: products,
      count: products.length
    });
  } catch (error) {
    console.error("Error en getAllProducts:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener productos"
    });
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de producto requerido"
      });
    }
    
    const product = await service.getProductById(id);
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    console.error("Error en getProductById:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener producto"
    });
  }
};

/**
 * Crear un nuevo producto
 */
export const createProduct = async (req, res) => {
  try {
    const data = req.body;
    
    // Validación básica
    if (!data.name || !data.price) {
      return res.status(400).json({
        success: false,
        message: "Nombre y precio son requeridos"
      });
    }
    
    const id = await service.createProduct(data);
    
    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente",
      data: { id }
    });
  } catch (error) {
    if (error.message.includes("requeridos") || error.message.includes("precio")) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    console.error("Error en createProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear producto"
    });
  }
};

/**
 * Actualizar un producto
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de producto requerido"
      });
    }
    
    const updatedId = await service.updateProduct(id, data);
    
    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      data: { id: updatedId }
    });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message.includes("precio")) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    console.error("Error en updateProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar producto"
    });
  }
};

/**
 * Eliminar un producto
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID de producto requerido"
      });
    }
    
    await service.deleteProduct(id);
    
    res.status(200).json({
      success: true,
      message: "Producto eliminado exitosamente"
    });
  } catch (error) {
    if (error.message === "Producto no encontrado") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    console.error("Error en deleteProduct:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar producto"
    });
  }
};

