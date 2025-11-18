import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Middleware de autenticación JWT
 * Verifica que el token sea válido antes de permitir el acceso a rutas protegidas
 */
const authMiddleware = (req, res, next) => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Token de autenticación requerido"
      });
    }
    
    // El formato esperado es: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido. Use: Bearer <token>"
      });
    }
    
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar información del usuario al request para uso posterior
    req.user = decoded;
    
    // Continuar con la siguiente función
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({
        success: false,
        message: "Token inválido"
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Token expirado"
      });
    }
    
    console.error("Error en authMiddleware:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar autenticación"
    });
  }
};

export default authMiddleware;

