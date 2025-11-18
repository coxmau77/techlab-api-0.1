import { Router } from "express";
import * as controller from "../controllers/auth.controller.js";

const router = Router();

// Ruta de registro (pública)
router.post("/register", controller.register);

// Ruta de login (pública)
router.post("/login", controller.login);

export default router;

