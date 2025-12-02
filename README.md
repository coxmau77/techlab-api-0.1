# TechLab API

API REST para la gestión de productos, desarrollada con Node.js, Express, Firebase (Firestore) y autenticación mediante JSON Web Tokens (JWT).

## Tabla de Contenidos

1. [Características Principales](#características-principales)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación y Configuración](#instalación-y-configuración)
4. [Ejecutar el Proyecto](#ejecutar-el-proyecto)
5. [Estructura de Respuestas y Validaciones](#estructura-de-respuestas-y-validaciones)
6. [Endpoints de la API](#endpoints-de-la-api)
7. [Guía de Pruebas con Postman](#guía-de-pruebas-con-postman)
8. [Estructura del Proyecto](#estructura-del-proyecto)
9. [Tecnologías Utilizadas](#tecnologías-utilizadas)
10. [Solución de Problemas Comunes](#solución-de-problemas-comunes)

## Características Principales

- CRUD completo de productos.
- Autenticación segura mediante JWT.
- Contraseñas protegidas con bcrypt (10 rondas de salt).
- Rutas protegidas mediante verificación de token.
- Tokens con expiración automática de 24 horas.
- Persistencia de datos en Firestore (Firebase).
- Arquitectura por capas: Rutas, Controladores, Servicios, Modelos.
- Validaciones en todos los endpoints.
- Registros con timestamps automáticos (`createdAt`, `updatedAt`).
- Manejo consistente de errores y códigos HTTP estándar.

## Requisitos Previos

- Node.js v14 o superior
- npm o yarn
- Cuenta en Firebase: [https://console.firebase.google.com/](https://console.firebase.google.com/)

## Instalación y Configuración

### 1. Clonar el proyecto e instalar dependencias

```bash
cd techlab-api
npm install
```

### 2. Configurar Firebase

1. Crear un proyecto en la consola de Firebase.
2. Habilitar Firestore y configurarlo en modo de prueba para desarrollo.
3. Crear una app Web dentro del proyecto y obtener el objeto `firebaseConfig`.

### 3. Variables de entorno

Copiar el archivo base:

```bash
cp .env.example .env
```

Completar `.env` con los valores correspondientes:

```env
PORT=8080
JWT_SECRET=clave_segura_de_32_caracteres_o_más

FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=tu-proyecto-id.firebaseapp.com
FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

Recomendaciones:

- Mantener `JWT_SECRET` privado.
- No subir `.env` al repositorio.

### 4. Crear colección inicial (opcional)

En Firestore, crear la colección `products` si deseas iniciarla manualmente.

## Ejecutar el Proyecto

```bash
npm start
```

Si la configuración es correcta, deberías ver:

```
Firebase conectado correctamente
Servidor corriendo en http://localhost:8080
```

## Estructura de Respuestas y Validaciones

### Formato estándar de respuesta

```json
{
  "success": true,
  "message": "Descripción de la operación",
  "data": {}
}
```

### Códigos HTTP utilizados

| Código | Descripción                | Caso típico                             |
| ------ | -------------------------- | --------------------------------------- |
| 200    | Operación exitosa          | GET, PUT, DELETE                        |
| 201    | Recurso creado             | Registro o creación de producto         |
| 400    | Error de validación        | Datos incorrectos o faltantes           |
| 401    | No autenticado             | Falta token, credenciales inválidas     |
| 403    | Token inválido o expirado  | Token vencido o manipulado              |
| 404    | Recurso no encontrado      | ID inexistente                          |
| 500    | Error interno del servidor | Problema con Firebase u otros servicios |

### Validaciones por campo

| Campo    | Regla                      | Error                            |
| -------- | -------------------------- | -------------------------------- |
| username | Mínimo 3 caracteres, único | "Username ya registrado"         |
| email    | Formato válido, único      | "Email inválido"                 |
| password | Mínimo 6 caracteres        | "Contraseña muy corta"           |
| name     | Obligatorio                | "Nombre y precio son requeridos" |
| price    | Número positivo            | "El precio debe ser positivo"    |
| token    | Vigente 24 horas           | "Token expirado"                 |

### Seguridad aplicada

- Hash de contraseñas con bcrypt.
- Tokens firmados y con expiración.
- Autenticación en rutas protegidas.
- Nunca se retorna información sensible.

## Endpoints de la API

A continuación se presenta un resumen claro de cada endpoint con validaciones incluidas.

### Autenticación

### POST /auth/register

Registra un nuevo usuario.

Body:

```json
{
  "username": "nuevo_usuario",
  "email": "usuario@example.com",
  "password": "password123"
}
```

Retorna token y datos del usuario.

### POST /auth/login

Autentica usuario y devuelve token válido durante 24 horas.

Body:

```json
{
  "username": "nuevo_usuario",
  "password": "password123"
}
```

## Productos

### GET /api/products

Público. Devuelve todos los productos.

### GET /api/products/:id

Público. Devuelve un producto por ID.

### POST /api/products/create

Protegido. Requiere token JWT.

Headers:

```
Authorization: Bearer <token>
```

Body:

```json
{
  "name": "Laptop X",
  "price": 1500,
  "stock": 10,
  "description": "Equipo profesional"
}
```

### PUT /api/products/:id

Protegido. Actualiza un producto existente.

Body opcional:

```json
{
  "name": "Laptop X Pro",
  "price": 1800
}
```

### DELETE /api/products/:id

Protegido. Elimina un producto.

## Guía de Pruebas con Postman

Incluye:

- Crear entorno con variables: `base_url`, `token`.
- Registrar usuario.
- Loguearse y guardar token.
- Probar endpoints protegidos.
- Probar flujos de error (token expirado, datos inválidos, etc.).

## Estructura del Proyecto

Ejemplo de arquitectura:

```
src/
│── config/
│── controllers/
│── services/
│── routes/
│── models/
│── middlewares/
│── utils/
│── app.js
│── server.js
```

## Tecnologías Utilizadas

- Node.js
- Express
- Firebase Firestore
- JSON Web Tokens
- bcryptjs
- Dotenv

## Solución de Problemas Comunes

| Problema                | Causa                      | Solución                       |
| ----------------------- | -------------------------- | ------------------------------ |
| Firebase no conecta     | Credenciales incorrectas   | Revisar archivo .env           |
| Token inválido          | Token expirado             | Loguearse nuevamente           |
| Firestore falla         | Proyecto no inicializado   | Habilitar Firestore en consola |
| 401 en rutas protegidas | Falta header Authorization | Agregar Bearer Token           |
