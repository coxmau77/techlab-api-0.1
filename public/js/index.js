const API_URL = window.location.origin;

/**
 * Inicializar página
 */
document.addEventListener("DOMContentLoaded", () => {
  initializePage();
});

/**
 * Inicializar la página
 */
function initializePage() {
  if (sessionManager.isAuthenticated()) {
    displayAuthenticatedUI();
  } else {
    displayAuthenticationForms();
  }

  attachEventListeners();
}

/**
 * Mostrar interfaz de usuario autenticado
 */
function displayAuthenticatedUI() {
  const { user } = sessionManager;

  document.getElementById("notLogged").classList.add("hidden");
  document.getElementById("userInfo").classList.add("active");
  document.getElementById("userUsername").textContent = user.username;
  document.getElementById("userEmail").textContent = user.email;

  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("userActions").classList.add("active");
}

/**
 * Mostrar formularios de autenticación
 */
function displayAuthenticationForms() {
  document.getElementById("notLogged").classList.remove("hidden");
  document.getElementById("userInfo").classList.remove("active");
  document.getElementById("userActions").classList.remove("active");
  document.getElementById("loginForm").classList.add("active");
}

/**
 * Cambiar a formulario de login
 */
function switchToLogin() {
  document.getElementById("loginForm").classList.add("active");
  document.getElementById("registerForm").classList.remove("active");
  clearForm("loginSubmit");
  clearMessage();
}

/**
 * Cambiar a formulario de registro
 */
function switchToRegister() {
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("registerForm").classList.add("active");
  clearForm("registerSubmit");
  clearMessage();
}

/**
 * Adjuntar listeners a los formularios
 */
function attachEventListeners() {
  document
    .getElementById("loginSubmit")
    .addEventListener("submit", handleLogin);
  document
    .getElementById("registerSubmit")
    .addEventListener("submit", handleRegister);
}

/**
 * Manejar login
 */
async function handleLogin(e) {
  e.preventDefault();
  showLoading(true);
  clearMessage();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!username || !password) {
    showMessage("Usuario y contraseña son requeridos", "error");
    showLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      const { token, user } = data.data;
      sessionManager.saveSession(token, user);
      showMessage(`¡Bienvenido, ${user.username}!`, "success");
      setTimeout(() => displayAuthenticatedUI(), 1000);
    } else {
      showMessage(data.message || "Error al iniciar sesión", "error");
    }
  } catch (error) {
    console.error("Error en login:", error);
    showMessage("Error de conexión", "error");
  } finally {
    showLoading(false);
  }
}

/**
 * Manejar registro
 */
async function handleRegister(e) {
  e.preventDefault();
  showLoading(true);
  clearMessage();

  const username = document.getElementById("regUsername").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!username || !email || !password) {
    showMessage("Todos los campos son requeridos", "error");
    showLoading(false);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showMessage("Cuenta creada exitosamente. Iniciando sesión...", "success");
      setTimeout(() => {
        const { token, user } = data.data;
        sessionManager.saveSession(token, user);
        displayAuthenticatedUI();
      }, 1500);
    } else {
      showMessage(data.message || "Error al registrarse", "error");
    }
  } catch (error) {
    console.error("Error en registro:", error);
    showMessage("Error de conexión", "error");
  } finally {
    showLoading(false);
  }
}

/**
 * Logout
 */
function logout() {
  sessionManager.clearSession();
  clearForm("loginSubmit");
  clearForm("registerSubmit");
  displayAuthenticationForms();
  showMessage("Sesión cerrada correctamente", "success");
}

/**
 * Navegar a productos
 */
function goToProducts() {
  window.location.href = "/products.html";
}

/**
 * Mostrar mensaje
 */
function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = `message ${type} active`;

  if (type === "success") {
    setTimeout(clearMessage, 5000);
  }
}

/**
 * Limpiar mensaje
 */
function clearMessage() {
  const messageEl = document.getElementById("message");
  messageEl.className = "message";
  messageEl.textContent = "";
}

/**
 * Limpiar formulario
 */
function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
  }
}

/**
 * Mostrar/ocultar loading
 */
function showLoading(show) {
  document.getElementById("loading").classList.toggle("active", show);
}
