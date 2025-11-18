import * as service from "../services/auth.service.js";

/**
 * Registrar un nuevo usuario
 */
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validación básica
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email y contraseña son requeridos"
      });
    }
    
    // Intentar registro
    const result = await service.register(username, email, password);
    
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error) {
    // Errores de validación (400)
    if (
      error.message.includes("requeridos") ||
      error.message.includes("inválido") ||
      error.message.includes("caracteres") ||
      error.message.includes("ya está")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    // Log del error completo para debugging
    console.error("Error en register:", error);
    console.error("Stack:", error.stack);
    
    // Devolver el mensaje de error real para debugging
    // En desarrollo siempre mostrar el error
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
    
    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
      error: isDevelopment ? error.message : undefined,
      details: isDevelopment ? error.stack : undefined
    });
  }
};

/**
 * Login: autenticar usuario y generar token JWT
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validación básica
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuario y contraseña son requeridos"
      });
    }
    
    // Intentar login
    const result = await service.login(username, password);
    
    res.status(200).json({
      success: true,
      message: "Login exitoso",
      data: {
        token: result.token,
        user: result.user
      }
    });
  } catch (error) {
    if (error.message.includes("requeridos") || error.message.includes("inválidas")) {
      return res.status(401).json({
        success: false,
        message: error.message
      });
    }
    
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error al realizar login"
    });
  }
};

