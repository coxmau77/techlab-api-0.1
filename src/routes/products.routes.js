import { Router } from "express";
import * as controller from "../controllers/products.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

// Rutas públicas (no requieren autenticación)
router.get("/", controller.getAllProducts);
router.get("/:id", controller.getProductById);

// Rutas protegidas (requieren autenticación JWT)
router.post("/create", authMiddleware, controller.createProduct);
router.put("/:id", authMiddleware, controller.updateProduct);
router.delete("/:id", authMiddleware, controller.deleteProduct);

export default router;

