// import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import dotenv from "dotenv";

// // Importar rutas
// import productsRoutes from "./src/routes/products.routes.js";
// import authRoutes from "./src/routes/auth.routes.js";

// // Cargar variables de entorno
// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middlewares globales
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Servir archivos estáticos desde el directorio public
// app.use(express.static("public"));

// // Rutas
// app.use("/api/products", productsRoutes);
// app.use("/auth", authRoutes);

// // Ruta raíz - redireccionar a index.html
// app.get("/", (req, res) => {
//   res.sendFile(new URL("./public/index.html", import.meta.url).pathname);
// });

// // Manejo de rutas no encontradas (404)
// app.use((req, res) => {
//   res.status(404).json({ message: "Ruta no encontrada" });
// });

// // Manejo de errores global
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Error interno del servidor" });
// });

// // Iniciar servidor
// app.listen(PORT, () => {
//   console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
// });

// ------------------------------------------------------------------------------------

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Rutas
import productsRoutes from "./src/routes/products.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

// Configurar variables de entorno
dotenv.config();

// Necesario para manejar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());

// Express ya tiene json y urlencoded integrados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rutas API
app.use("/api/products", productsRoutes);
app.use("/auth", authRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Manejo de rutas inexistentes
app.use((req, res) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Error interno del servidor" });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
