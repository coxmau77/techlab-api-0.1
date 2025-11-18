/**
 * Manejador silencioso para errores de runtime (extensiones)
 */
if (typeof chrome !== "undefined" && chrome.runtime) {
  chrome.runtime.onMessage.addListener(() => {
    // Handler vacío para evitar errores de extensiones
  });
}

/**
 * Gestor de Sesión del Usuario
 * Maneja autenticación, almacenamiento de token y datos del usuario
 */
class SessionManager {
  constructor() {
    this.token = localStorage.getItem("authToken");
    this.user = this._parseUser();
  }

  /**
   * Parsear datos del usuario de localStorage con manejo de errores
   * @private
   */
  _parseUser() {
    try {
      const userStr = localStorage.getItem("authUser");
      if (!userStr) {
        return null;
      }
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error al parsear usuario de localStorage:", error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated() {
    return !!(this.token && this.user && this.user.id && this.user.username);
  }

  /**
   * Guardar sesión del usuario
   * @param {string} token - Token JWT
   * @param {Object} user - Datos del usuario (id, username, email)
   */
  saveSession(token, user) {
    if (!token || !user || !user.id || !user.username) {
      throw new Error("Token, id y username del usuario son requeridos");
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("authUser", JSON.stringify(user));
    this.token = token;
    this.user = user;
  }

  /**
   * Limpiar sesión del usuario
   */
  clearSession() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    this.token = null;
    this.user = null;
  }

  /**
   * Obtener token JWT
   */
  getToken() {
    return this.token;
  }

  /**
   * Obtener headers de autorización
   */
  getAuthHeaders() {
    if (!this.token) {
      throw new Error("No hay token disponible");
    }
    return {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Realizar petición autenticada
   * @param {string} url - URL de la petición
   * @param {Object} options - Opciones de fetch
   */
  async authenticatedFetch(url, options = {}) {
    if (!this.isAuthenticated()) {
      this.clearSession();
      window.location.href = "/";
      throw new Error("No autenticado");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    // Manejar respuestas de autenticación fallida
    if (response.status === 401 || response.status === 403) {
      this.clearSession();
      window.location.href = "/";
      throw new Error("Sesión expirada o no autorizado");
    }

    return response;
  }
}

// Instancia global del gestor de sesión
const sessionManager = new SessionManager();

/**
 * Proteger rutas verificando autenticación
 * @param {string} redirectTo - URL a redirigir si no está autenticado
 * @returns {boolean} true si está autenticado, false en caso contrario
 */
function protectRoute(redirectTo = "/") {
  if (!sessionManager.isAuthenticated()) {
    window.location.href = redirectTo;
    return false;
  }
  return true;
}
