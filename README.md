# TechLab API - API REST con Node.js, Firebase y JWT

API REST completa para la gestión de productos, implementada con Node.js, Express, Firebase (Firestore) y autenticación segura mediante JSON Web Tokens (JWT).

##  Tabla de Contenidos

1. [Características Principales](#-características-principales)
2. [Requisitos Previos](#-requisitos-previos)
3. [Instalación y Configuración](#-instalación-y-configuración)
4. [Ejecutar el Proyecto](#-ejecutar-el-proyecto)
5. [Estructura de Respuestas](#-estructura-de-respuestas-y-validaciones)
6. [Endpoints de la API](#-endpoints-de-la-api)
7. [Guía de Pruebas con Postman](#-guía-de-pruebas-con-postman)
8. [Estructura del Proyecto](#-estructura-del-proyecto)
9. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
10. [Solución de Problemas](#-solución-de-problemas-comunes)

---

- **CRUD Completo:** Operaciones de Crear, Leer, Actualizar y Eliminar para la gestión de productos.
- **Autenticación Segura:** Registro de usuarios y login con JWT. Las contraseñas se almacenan **hasheadas con bcrypt** (10 rondas de salt).
- **Rutas Protegidas:** Endpoints de creación, actualización y eliminación requieren un token JWT válido en el header `Authorization`.
- **Tokens JWT con Expiración:** Los tokens generados expiran automáticamente después de **24 horas**.
- **Base de Datos NoSQL:** Integración con Google Firestore para persistencia de datos.
- **Arquitectura por Capas:** Estructura organizada (Rutas → Controladores → Servicios → Modelos) para mantenibilidad.
- **Validación de Entrada:** Validaciones en todos los endpoints (email único, contraseña mínima 6 caracteres, username mínimo 3 caracteres, precios positivos).
- **Timestamps Automáticos:** Cada producto y usuario registra `createdAt` y `updatedAt`.
- **Manejo de Errores:** Respuestas HTTP consistentes con códigos de estado apropados y mensajes descriptivos.

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Una cuenta de Google para usar [Firebase](https://console.firebase.google.com/)

---

## 🔧 Instalación y Configuración

Sigue estos pasos para levantar el proyecto localmente.

### 1\. Clonar e Instalar

```bash
# Navegar a la carpeta del proyecto
cd techlab-api

# Instalar dependencias
npm install
```

### 2\. Configurar Firebase (Paso Crítico)

Necesitas obtener las credenciales de tu propio proyecto en Firebase.

1.  **Crear Proyecto en Firebase:**

    - Ve a la [Consola de Firebase](https://console.firebase.google.com/).
    - Haz clic en **"Agregar proyecto"** y dale un nombre (ej. `techlab-api`).

2.  **Habilitar Firestore:**

    - Dentro de tu proyecto, en el menú lateral, ve a **Firestore Database**.
    - Haz clic en **"Crear base de datos"**.
    - Selecciona **"Modo de prueba"** (para desarrollo) y elige una ubicación.
    - Haz clic en **"Habilitar"**.

3.  **Obtener Credenciales Web:**

    - En la consola, ve a **Configuración del proyecto** (el ícono ⚙️).
    - En la sección "Tus aplicaciones", haz clic en el ícono web **`</>`**.
    - Registra la app (ej. `techlab-api-web`).
    - Firebase te mostrará un objeto `firebaseConfig`. **Copia estos valores.**

### 3\. Configurar Variables de Entorno (.env)

1.  Copia el archivo de ejemplo:

    ```bash
    cp .env.example .env
    ```

2.  Abre el archivo `.env` y llénalo con las credenciales que obtuviste de Firebase.

    ```env
    # Puerto en el que correrá el servidor (por defecto 8080 si no se especifica)
    PORT=8080

    # Clave secreta para firmar tokens JWT (debe ser larga y segura)
    # Los tokens firmados con esta clave expirarán en 24 horas
    JWT_SECRET=tu_secreto_jwt_muy_seguro_y_largo_minimo_32_caracteres

    # Credenciales de Firebase (obtener de la consola de Firebase)
    FIREBASE_PROJECT_ID=tu-proyecto-id
    FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    FIREBASE_AUTH_DOMAIN=tu-proyecto-id.firebaseapp.com
    FIREBASE_STORAGE_BUCKET=tu-proyecto-id.appspot.com
    FIREBASE_MESSAGING_SENDER_ID=123456789012
    FIREBASE_APP_ID=1:123456789012:web:abcdef123456
    ```

    **Importante:** 
    - `JWT_SECRET` debe ser fuerte y privado (no compartir nunca)
    - Todos los valores de `FIREBASE_*` son obligatorios para que la API funcione correctamente
    - Nunca subir el archivo `.env` a un repositorio (está en `.gitignore`)

### 4\. (Opcional) Crear Colección Inicial

- En la base de datos de Firestore, puedes hacer clic en **"Iniciar colección"**.
- Nómbrala `products` para que coincida con el modelo de la API.

---

## 🏃 Ejecutar el Proyecto

Una vez configurado el `.env`, inicia el servidor:

```bash
npm start
```

Si todo está correcto, deberías ver en tu consola:

```
✅ Firebase conectado correctamente
🚀 Servidor corriendo en http://localhost:8080
```

---

##  Estructura de Respuestas y Validaciones

### Estructura Estándar de Respuestas

Todas las respuestas de la API siguen este formato:

```json
{
  "success": true,
  "message": "Descripción de la operación",
  "data": { "contenido específico del endpoint" }
}
```

**Nota:** Algunas respuestas incluyen campos adicionales como `count` o campos anidados según el endpoint.

### Códigos HTTP Utilizados

La API utiliza los siguientes códigos HTTP estándar:

| Código | Significado | Cuándo Ocurre | Ejemplo |
|--------|-----------|---------------|---------|
| **200** | OK - Éxito | GET, PUT, DELETE exitosos | Se obtuvo un producto, se actualizó |
| **201** | Created - Creado | POST exitoso | Se registró un usuario, se creó un producto |
| **400** | Bad Request - Solicitud Inválida | Errores de validación | Falta campo requerido, precio negativo |
| **401** | Unauthorized - No Autenticado | Token falta o credenciales inválidas | No incluiste token, password incorrecto |
| **403** | Forbidden - Prohibido | Token inválido o expirado | Token corrompido o venció hace tiempo |
| **404** | Not Found - No Encontrado | Recurso no existe | Producto con ese ID no existe |
| **500** | Internal Server Error - Error Interno | Error en el servidor | Problema con Firebase o base de datos |

### Validaciones Implementadas

| Campo | Validación | Mensaje de Error |
|-------|-----------|------------------|
| **username** | Mínimo 3 caracteres, único en el sistema | "El username debe tener al menos 3 caracteres" / "El username ya está en uso" |
| **email** | Formato válido (regex básico), único en el sistema | "Email inválido" / "El email ya está registrado" |
| **password** | Mínimo 6 caracteres | "La contraseña debe tener al menos 6 caracteres" |
| **name (producto)** | Obligatorio | "Nombre y precio son requeridos" |
| **price (producto)** | Número positivo, obligatorio | "El precio debe ser un número positivo" |
| **JWT Token** | Formato correcto, vigencia de 24 horas | "Token inválido" / "Token expirado" |

### Seguridad

- **Passwords:** Se hashean con **bcryptjs** (10 rondas de salt) antes de guardarse en la base de datos. Nunca se almacenan en texto plano.
- **JWT:** Los tokens se firman con `JWT_SECRET` y expiran después de **24 horas**. Debe incluirse en el header `Authorization` como `Bearer <token>`.
- **Autenticación:** Las rutas protegidas validan el token antes de procesar la solicitud.
- **Campos sensibles:** Las contraseñas nunca se retornan en las respuestas de la API.

---

## 📚 Endpoints de la API

### Autenticación

#### `POST /auth/register`

Registra un nuevo usuario y devuelve un token JWT automáticamente.

**Validaciones:**
- `username`: Mínimo 3 caracteres, debe ser único
- `email`: Formato válido, debe ser único
- `password`: Mínimo 6 caracteres

**Body:**

```json
{
  "username": "nuevo_usuario",
  "email": "usuario@example.com",
  "password": "password123"
}
```

**Respuesta Exitosa (201 Created):**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "abc123xyz",
      "username": "nuevo_usuario",
      "email": "usuario@example.com",
      "createdAt": "2025-11-17T10:30:00.000Z",
      "updatedAt": "2025-11-17T10:30:00.000Z"
    }
  }
}
```

**Errores Posibles:**

| Código | Causa | Solución |
|--------|-------|----------|
| `400` | Username menor a 3 caracteres | Usar un username de al menos 3 caracteres |
| `400` | Email inválido | Usar un formato válido (ejemplo@dominio.com) |
| `400` | Password menor a 6 caracteres | Usar una contraseña de al menos 6 caracteres |
| `400` | Username ya registrado | Usar otro username único |
| `400` | Email ya registrado | Usar otro email único |
| `500` | Error del servidor | Verificar logs y conexión con Firebase |

---

#### `POST /auth/login`

Autentica un usuario con sus credenciales y devuelve un token JWT válido por 24 horas.

**Validaciones:**
- `username`: Obligatorio
- `password`: Obligatorio y debe coincidir con la registrada

**Body:**

```json
{
  "username": "nuevo_usuario",
  "password": "password123"
}
```

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "abc123xyz",
      "username": "nuevo_usuario",
      "email": "usuario@example.com",
      "createdAt": "2025-11-17T10:30:00.000Z",
      "updatedAt": "2025-11-17T10:30:00.000Z"
    }
  }
}
```

**Errores Posibles:**

| Código | Causa | Solución |
|--------|-------|----------|
| `400` | Username o password no proporcionados | Enviar ambos campos en el body |
| `401` | Credenciales inválidas (usuario no existe o password incorrecto) | Verificar username y password |
| `500` | Error del servidor | Verificar logs y conexión con Firebase |

**Nota:** El token expira en **24 horas**. Después deberá hacer login nuevamente.

---

### Productos

#### `GET /api/products` 🟢 Público

Obtiene todos los productos registrados. No requiere autenticación.

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "doc1",
      "name": "Laptop Gaming",
      "price": 2500,
      "stock": 10,
      "description": "Laptop de alto rendimiento para gaming",
      "createdAt": "2025-11-17T09:00:00.000Z",
      "updatedAt": "2025-11-17T09:00:00.000Z"
    },
    {
      "id": "doc2",
      "name": "Smartphone Pro X",
      "price": 1200,
      "stock": 25,
      "description": "Smartphone con cámara avanzada",
      "createdAt": "2025-11-17T09:15:00.000Z",
      "updatedAt": "2025-11-17T09:15:00.000Z"
    }
  ],
  "count": 2
}
```

**Errores Posibles:**

| Código | Causa | Solución |
|--------|-------|----------|
| `500` | Error de conexión con Firebase | Verificar configuración de FIREBASE_* en .env |

---

#### `GET /api/products/:id` 🟢 Público

Obtiene un producto específico por su ID. No requiere autenticación.

**Parámetros:**
- `id`: ID del producto (Firestore doc ID)

**Ejemplo:** `GET /api/products/doc1`

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "doc1",
    "name": "Laptop Gaming",
    "price": 2500,
    "stock": 10,
    "description": "Laptop de alto rendimiento para gaming",
    "createdAt": "2025-11-17T09:00:00.000Z",
    "updatedAt": "2025-11-17T09:00:00.000Z"
  }
}
```

**Errores Posibles:**

| Código | Causa | Solución |
|--------|-------|----------|
| `400` | ID no proporcionado | Incluir /:id en la URL |
| `404` | Producto no encontrado | Verificar que el ID sea correcto |
| `500` | Error del servidor | Verificar logs y conexión con Firebase |

---

#### `POST /api/products/create` 🔒 Protegido

Crea un nuevo producto. **Requiere autenticación JWT.**

**Headers Obligatorios:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Validaciones:**
- `name`: Obligatorio
- `price`: Obligatorio, debe ser número positivo

**Body:**

```json
{
  "name": "Laptop X",
  "price": 1500,
  "stock": 10,
  "description": "Equipo profesional"
}
```

**Respuesta Exitosa (201 Created):**

```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "data": {
    "id": "newDocId123"
  }
}
```

**Errores Posibles:**

| Código | Causa | Solución |
|--------|-------|----------|
| `400` | Falta `name` o `price` | Incluir ambos campos en el body |
| `400` | `price` no es número positivo | Enviar un número > 0 |
| `401` | Sin header `Authorization` | Agregar header: `Authorization: Bearer <token>` |
| `403` | Token inválido o expirado | Hacer login nuevamente para obtener token vigente |
| `500` | Error del servidor | Verificar logs y conexión con Firebase |

---

#### `PUT /api/products/:id` 🔒 Protegido

Actualiza un producto existente. **Requiere autenticación JWT.**

**Headers Obligatorios:**
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

**Parámetros:**
- `id`: ID del producto a actualizar

**Validaciones:**
- Si se proporciona `price`, debe ser número positivo
- El producto debe existir

**Body (todos los campos son opcionales):**

```json
{
  "name": "Laptop X Pro",
  "price": 1800,
  "stock": 15,
  "description": "Equipo profesional mejorado"
}
```

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Producto actualizado exitosamente",
  "data": {
    "id": "doc1"
  }
}
```

**Errores Posibles:**

| Código | Causa | Solución |
|--------|-------|----------|
| `400` | ID no proporcionado | Incluir /:id en la URL |
| `400` | `price` no es número positivo | Enviar un número > 0 o no enviar el campo |
| `401` | Sin header `Authorization` | Agregar header: `Authorization: Bearer <token>` |
| `403` | Token inválido o expirado | Hacer login nuevamente |
| `404` | Producto no encontrado | Verificar que el ID sea correcto |
| `500` | Error del servidor | Verificar logs y conexión con Firebase |

---

#### `DELETE /api/products/:id` 🔒 Protegido

Elimina un producto. **Requiere autenticación JWT.**

**Headers Obligatorios:**
```
Authorization: Bearer <token_jwt>
```

**Parámetros:**
- `id`: ID del producto a eliminar

**Ejemplo:** `DELETE /api/products/doc1`

**Respuesta Exitosa (200 OK):**

```json
{
  "success": true,
  "message": "Producto eliminado exitosamente",
  "data": {
    "id": "doc1"
  }
}
```

**Errores Posibles:**

| Código | Causa | Solución |
|--------|-------|----------|
| `400` | ID no proporcionado | Incluir /:id en la URL |
| `401` | Sin header `Authorization` | Agregar header: `Authorization: Bearer <token>` |
| `403` | Token inválido o expirado | Hacer login nuevamente |
| `404` | Producto no encontrado | Verificar que el ID sea correcto |
| `500` | Error del servidor | Verificar logs y conexión con Firebase |

---

## 📮 Guía de Pruebas con Postman

**Antes de comenzar:** Asegúrate de tener el servidor corriendo (`npm start`) y que Firebase esté configurado correctamente en el `.env`.

Sigue este flujo para probar la API correctamente.

### Paso 1: Registrar un Usuario

1.  **Método:** `POST`
2.  **URL:** `http://localhost:8080/auth/register`
3.  **Headers:**
    - `Content-Type: application/json`
4.  **Body:**
    - Selecciona **`raw`** y **`JSON`**.
    - Pega el JSON de registro:
      ```json
      {
        "username": "test_user",
        "email": "test@example.com",
        "password": "test123"
      }
      ```
5.  Recibirás un token en la respuesta.

### Paso 2: Iniciar Sesión (Login)

Si ya te registraste, ahora haz login para obtener un token.

1.  **Método:** `POST`
2.  **URL:** `http://localhost:8080/auth/login`
3.  **Headers:**
    - `Content-Type: application/json`
4.  **Body (raw, JSON):**
    ```json
    {
      "username": "test_user",
      "password": "test123"
    }
    ```
5.  **Copia el `token`** de la respuesta. Lo necesitarás para el siguiente paso.

### Paso 3: Probar Rutas Protegidas (Ej: Crear Producto)

Ahora usaremos el token para autenticarnos.

1.  **Método:** `POST`

2.  **URL:** `http://localhost:8080/api/products/create`

3.  **Headers (¡Muy Importante\!):**

    - `Content-Type: application/json`
    - `Authorization: Bearer <tu_token_copiado_del_login>`

    > **Nota:** Asegúrate de que diga `Bearer` seguido de un espacio y luego el token.

4.  **Body (raw, JSON):**

    ```json
    {
      "name": "Laptop Gaming",
      "price": 2500,
      "stock": 10,
      "description": "Laptop de alto rendimiento para gaming"
    }
    ```

5.  Envía la petición. Deberías recibir una respuesta `201 Created`.

### 💡 Pro Tip (Postman): Guardar Token Automáticamente

Para no copiar y pegar el token manualmente:

1.  En el request de **Login**, ve a la pestaña **"Tests"**.
2.  Pega este código:
    ```javascript
    if (pm.response.code === 200) {
      const response = pm.response.json();
      if (response.success && response.data.token) {
        pm.environment.set("token", response.data.token);
        console.log("Token guardado automáticamente");
      }
    }
    ```
3.  Crea un "Entorno" en Postman (icono ⚙️).
4.  En tus requests protegidos (Create, Update, Delete), en el header `Authorization`, usa: `Bearer {{token}}`.

---

## 📁 Estructura del Proyecto

```
techlab-api/
├── config/
│   └── firebase.js              # Configuración de Firebase e inicialización
├── controllers/
│   ├── auth.controller.js       # Lógica de las rutas de autenticación
│   └── products.controller.js   # Lógica de las rutas de productos
├── middlewares/
│   └── auth.middleware.js       # Middleware para validar JWT en rutas protegidas
├── models/
│   ├── products.model.js        # Operaciones CRUD en Firestore (Productos)
│   └── users.model.js           # Operaciones en Firestore (Usuarios)
├── routes/
│   ├── auth.routes.js           # Definición de rutas de autenticación
│   └── products.routes.js       # Definición de rutas de productos
├── services/
│   ├── auth.service.js          # Lógica de negocio de autenticación (validaciones, JWT)
│   └── products.service.js      # Lógica de negocio de productos (validaciones, etc)
├── utils/                       # (Carpeta para utilidades adicionales)
├── .env                         # Variables de entorno (NO versionar)
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore                   # Archivos a ignorar en git
├── index.js                     # Punto de entrada de la aplicación
├── package.json                 # Dependencias del proyecto
└── README.md                    # Este archivo
```

**Flujo de Datos:**
```
Request → Routes → Middlewares → Controllers → Services → Models → Firestore
```

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| **Node.js** | v14+ | Entorno de ejecución de JavaScript backend |
| **Express** | ^5.1.0 | Framework web para crear rutas y middlewares |
| **Firebase** | ^12.6.0 | Plataforma de Google para Firestore (base de datos) |
| **JWT (jsonwebtoken)** | ^9.0.2 | Generación y validación de tokens de autenticación |
| **bcryptjs** | ^3.0.3 | Hashing seguro de contraseñas |
| **dotenv** | ^17.2.3 | Manejo de variables de entorno (.env) |
| **CORS** | ^2.8.5 | Habilitar peticiones desde otros dominios |
| **body-parser** | ^2.2.0 | Middleware para parsear JSON en requests |

---

## 💡 Datos de Ejemplo

Puedes usar esta lista para poblar tu base de datos usando el endpoint `POST /api/products/create`.

```json
[
  {
    "name": "Laptop Gaming",
    "price": 2500,
    "stock": 10,
    "description": "Laptop de alto rendimiento para gaming"
  },
  {
    "name": "Smartphone Pro X",
    "price": 1200,
    "stock": 25,
    "description": "Smartphone con cámara avanzada y procesador de última generación"
  },
  {
    "name": "Auriculares Inalámbricos Alpha",
    "price": 180,
    "stock": 40,
    "description": "Auriculares con cancelación de ruido y batería extendida"
  },
  {
    "name": "Monitor UltraWide 34''",
    "price": 800,
    "stock": 15,
    "description": "Monitor curvo ultrawide ideal para productividad y diseño"
  },
  {
    "name": "Teclado Mecánico RGB",
    "price": 95,
    "stock": 60,
    "description": "Teclado mecánico con switches táctiles y retroiluminación RGB"
  }
]
```

---

## 🐛 Solución de Problemas Comunes

### 🔴 Errores de Servidor / Firebase

#### "Firebase conectado correctamente" no aparece en consola

**Síntomas:** 
- La consola no muestra el mensaje de Firebase conectado
- Errores de conexión al intentar hacer requests

**Causas Posibles:**
1. Variables `FIREBASE_*` incorrectas en `.env`
2. Firestore no habilitado en la consola de Firebase
3. Archivo `.env` no existe o no se cargó

**Solución:**
```bash
# 1. Verifica que el archivo .env existe en la raíz del proyecto
ls -la .env

# 2. Verifica que todos los valores estén correctamente copiados (sin espacios extra)
cat .env

# 3. Reinicia el servidor después de actualizar .env
npm start

# 4. En Firebase Console, verifica:
#    - El proyecto existe
#    - Firestore Database está habilitado
#    - Las credenciales coinciden
```

**Nota:** Si cambias `.env`, debes reiniciar el servidor para que cargue los nuevos valores.

---

#### "Permission denied" (Permiso denegado) al consultar Firestore

**Síntomas:** 
- Errores 403 o permisos denegados al intentar leer/escribir en Firestore
- Mensajes como "Missing or insufficient permissions"

**Solución:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database** → **Rules**
4. Para desarrollo, usa estas reglas (⚠️ SOLO para pruebas, no para producción):
   ```firestore
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
5. Haz clic en **"Publicar"**

**Advertencia:** Estas reglas permiten acceso total. Para producción, implementa reglas de seguridad adecuadas.

---

### 🔴 Errores de Autenticación y Tokens

#### Error `401: "Token de autenticación requerido"`

**Síntomas:** 
- Intentas hacer POST, PUT o DELETE sin incluir el token
- Recibes error 401 en rutas protegidas

**Causas:**
- No incluiste el header `Authorization`
- El header está vacío

**Solución en Postman:**
1. Abre la solicitud de creación/actualización/eliminación de producto
2. Ve a la pestaña **"Headers"**
3. Añade una nueva fila:
   - **Key:** `Authorization`
   - **Value:** `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (tu token actual)

---

#### Error `401: "Formato de token inválido. Use: Bearer <token>"`

**Síntomas:** 
- Token en formato incorrecto
- No reconoce el token aunque lo incluyas

**Causas:**
- El header `Authorization` falta la palabra `Bearer`
- Falta el espacio entre `Bearer` y el token
- El token está vacío

**Soluciones:**
- ❌ Incorrecto: `Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- ❌ Incorrecto: `Authorization: Bearer-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- ✅ Correcto: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

---

#### Error `403: "Token inválido"` o `403: "Token expirado"`

**Síntomas:** 
- El token que copió antes ahora no funciona
- Recibe error 403 en rutas que funcionaban

**Causas:**
- El token expiró (válido por 24 horas)
- El token se copió mal
- El `JWT_SECRET` en `.env` cambió

**Solución:**
1. Haz login nuevamente: `POST /auth/login`
   ```json
   {
     "username": "tu_usuario",
     "password": "tu_contraseña"
   }
   ```
2. Copia el nuevo token de la respuesta
3. Actualiza el header `Authorization` con el nuevo token
4. Intenta la solicitud nuevamente

**Tip de Productividad en Postman:**
- Después de hacer login, guarda el token en una variable de entorno
- Usa esa variable en todas las solicitudes protegidas (verifica la sección "Guía de Pruebas" arriba)

---

### 🔴 Errores de Validación

#### Error `400: "Nombre y precio son requeridos"`

**Síntomas:** 
- No puedes crear productos
- Recibes error 400

**Causas:**
- El body no incluye `name` o `price`
- Los campos están vacíos

**Solución:**
```json
{
  "name": "Nombre del Producto",
  "price": 1500,
  "stock": 10,
  "description": "Descripción"
}
```
- `name` y `price` son **obligatorios**
- `stock` y `description` son **opcionales**

---

#### Error `400: "El precio debe ser un número positivo"`

**Síntomas:** 
- Intentas crear/actualizar un producto con precio inválido

**Causas:**
- `price` es 0 o negativo
- `price` no es un número

**Soluciones:**
- ❌ `"price": 0` → No permitido
- ❌ `"price": -100` → No permitido
- ❌ `"price": "1500"` → Debe ser número, no texto
- ✅ `"price": 1500` → Correcto

---

#### Error `400: "El username debe tener al menos 3 caracteres"`

**Síntomas:** 
- No puedes registrar usuarios con usernames cortos

**Solución:**
- Username mínimo: **3 caracteres**
- ❌ `username: "ab"` → Muy corto
- ✅ `username: "abc"` → Válido

---

#### Error `400: "La contraseña debe tener al menos 6 caracteres"`

**Síntomas:** 
- No puedes registrar usuarios con contraseñas débiles

**Solución:**
- Password mínimo: **6 caracteres**
- ❌ `password: "12345"` → Muy corta
- ✅ `password: "123456"` → Válida

---

#### Error `400: "Email inválido"`

**Síntomas:** 
- No puedes registrar con ciertos emails

**Solución:**
- El email debe tener formato válido: `usuario@dominio.com`
- ❌ `email: "usuario"` → Falta @
- ❌ `email: "usuario@"` → Falta dominio
- ✅ `email: "usuario@example.com"` → Válido

---

#### Error `400: "El username ya está en uso"` o `"El email ya está registrado"`

**Síntomas:** 
- No puedes registrar con ese username/email

**Causas:**
- Ya existe una cuenta con ese username/email

**Solución:**
- Usa otro username o email único
- O intenta hacer login si ya tienes una cuenta

---

### 🔴 Errores de Rutas

#### Error `404: "Ruta no encontrada"`

**Síntomas:** 
- Recibes error 404 en cualquier solicitud

**Causas Posibles:**

| URL Incorrecta | Corrección | Razón |
|---|---|---|
| `http://localhost:8080/products` | `http://localhost:8080/api/products` | Falta `/api` en el prefijo |
| `http://localhost:8080/api/product` | `http://localhost:8080/api/products` | Singular en lugar de plural |
| `http://localhost:8080/auth/create` | `http://localhost:8080/auth/register` | Endpoint incorrecto |
| `POST http://localhost:8080/api/products` | `POST http://localhost:8080/api/products/create` | Método o ruta incorrecta |

**Solución:**
- Verifica que la URL coincida exactamente con los endpoints documentados
- Verifica que el método HTTP (GET/POST/PUT/DELETE) sea el correcto
- Los endpoints son case-sensitive (minúsculas)

---

### 🔴 Errores en Postman

#### El body está vacío o no se envía

**Síntomas:**
- Recibe "Nombre y precio son requeridos" aunque completaste los campos

**Causa:**
- La pestaña **Body** no está configurada correctamente

**Solución en Postman:**
1. Abre la solicitud
2. Haz clic en la pestaña **"Body"**
3. Selecciona **`raw`** (radio button)
4. En el dropdown, selecciona **`JSON`** (no `Text`)
5. Pega tu JSON
6. Verifica que el header `Content-Type: application/json` esté presente (Postman lo añade automáticamente)

---

#### No puedo copiar el token correctamente

**Síntomas:**
- Copias el token pero sigue dando error "Token inválido"

**Soluciones:**
1. **Copia solo el valor del token** (sin comillas)
   ```json
   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   //          ↑ Copia desde aquí
   ```

2. **Usa la funcionalidad de variables de Postman** (más fácil):
   - En el request de login, ve a **Tests**
   - Pega:
     ```javascript
     if (pm.response.code === 200) {
       const response = pm.response.json();
       pm.environment.set("token", response.data.token);
     }
     ```
   - En otros requests, usa `{{token}}` en el header `Authorization`

---

### 🟢 Verificar Configuración Rápidamente

Para verificar que todo está bien configurado, ejecuta esto:

```bash
# 1. Verifica que el servidor esté corriendo
curl http://localhost:8080

# Deberías recibir:
# {"message":"API TechLab funcionando correctamente"}

# 2. Intenta registrar un usuario
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'

# 3. Intenta obtener productos (sin autenticación)
curl http://localhost:8080/api/products
```

---

## 📝 Notas Adicionales

### Diferencias entre Desarrollo y Producción

**Desarrollo (Actual):**
- Firestore en "Modo de prueba" (permisos abiertos)
- JWT_SECRET puede ser más simple
- Logs detallados de errores
- CORS permitido desde cualquier origen

**Producción:**
- Firestore con reglas de seguridad robustas
- JWT_SECRET debe ser fuerte y única
- Limitar logs a información esencial
- Configurar CORS específicamente para dominios permitidos

### Próximos Pasos Recomendados

1. **Implementar Base de Datos de Auditoría:** Registrar quién creó/modificó cada producto
2. **Roles y Permisos:** Diferenciar entre usuarios regulares y administradores
3. **Paginación:** Cuando haya muchos productos, implementar limit y offset
4. **Testing:** Crear pruebas automatizadas con Jest o similar
5. **Documentación Automática:** Generar documentación con Swagger/OpenAPI
6. **Rate Limiting:** Proteger la API contra ataques de fuerza bruta
7. **Logging y Monitoreo:** Usar servicios como CloudWatch o Sentry

### Contacto y Soporte

Para dudas o problemas:
- Revisa la sección [Solución de Problemas Comunes](#-solución-de-problemas-comunes)
- Verifica los logs en la consola del servidor
- Consulta la documentación oficial de [Firebase](https://firebase.google.com/docs) o [Express](https://expressjs.com/es/)

---

**Versión del Documento:** 2.0  
**Última Actualización:** Noviembre 2025  
**Autor:** Mauricio Cox - TechLab Team
