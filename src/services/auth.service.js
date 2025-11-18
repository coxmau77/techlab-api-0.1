import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as userModel from "../models/users.model.js";

dotenv.config();

/**
 * Validar credenciales de usuario
 */
export const validateCredentials = async (username, password) => {
  // Buscar usuario en Firestore
  const user = await userModel.findByUsername(username);
  
  if (!user) {
    return null;
  }
  
  // Verificar contraseña
  const isPasswordValid = await userModel.verifyPassword(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }
  
  // Retornar usuario sin la contraseña
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Generar token JWT
 */
export const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email
  };
  
  // Token expira en 24 horas
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h"
  });
  
  return token;
};

/**
 * Registrar un nuevo usuario
 */
export const register = async (username, email, password) => {
  // Validar que se proporcionen todos los datos
  if (!username || !email || !password) {
    throw new Error("Username, email y contraseña son requeridos");
  }
  
  // Validar formato de email básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Email inválido");
  }
  
  // Validar longitud de contraseña
  if (password.length < 6) {
    throw new Error("La contraseña debe tener al menos 6 caracteres");
  }
  
  // Validar longitud de username
  if (username.length < 3) {
    throw new Error("El username debe tener al menos 3 caracteres");
  }
  
  // Verificar que el username no exista
  const existingUser = await userModel.findByUsername(username);
  if (existingUser) {
    throw new Error("El username ya está en uso");
  }
  
  // Verificar que el email no exista
  const existingEmail = await userModel.findByEmail(email);
  if (existingEmail) {
    throw new Error("El email ya está registrado");
  }
  
  // Crear usuario
  const newUser = await userModel.create({
    username,
    email,
    password
  });
  
  // Generar token para el nuevo usuario
  const token = generateToken(newUser);
  
  return {
    token,
    user: newUser
  };
};

/**
 * Login: validar credenciales y generar token
 */
export const login = async (username, password) => {
  // Validar que se proporcionen credenciales
  if (!username || !password) {
    throw new Error("Usuario y contraseña son requeridos");
  }
  
  // Validar credenciales
  const user = await validateCredentials(username, password);
  
  if (!user) {
    throw new Error("Credenciales inválidas");
  }
  
  // Generar token
  const token = generateToken(user);
  
  return {
    token,
    user
  };
};

