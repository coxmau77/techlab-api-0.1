const API_URL = window.location.origin;

document.addEventListener("DOMContentLoaded", () => {
  if (!protectRoute("/")) {
    return;
  }
  displayUserInfo();
  loadProducts();
  document
    .getElementById("productForm")
    .addEventListener("submit", handleCreateProduct);
});

function displayUserInfo() {
  const { user } = sessionManager;
  document.getElementById("userEmail").textContent =
    user.email || user.username;
}

async function loadProducts() {
  try {
    document.getElementById("loading").classList.add("active");
    document.getElementById("productsList").innerHTML = "";

    const response = await sessionManager.authenticatedFetch(
      `${API_URL}/api/products`
    );
    const data = await response.json();

    document.getElementById("loading").classList.remove("active");

    if (response.ok && data.success) {
      if (!data.data || data.data.length === 0) {
        document.getElementById("productsList").innerHTML =
          '<div class="empty-state">No hay productos registrados</div>';
      } else {
        displayProducts(data.data);
      }
    } else {
      showMessage(data.message || "Error al cargar productos", "error");
    }
  } catch (error) {
    document.getElementById("loading").classList.remove("active");
    console.error("Error:", error);
    showMessage("Error de conexión", "error");
  }
}

let productsCache = {};

function displayProducts(products) {
  productsCache = {};
  const html = products
    .map((product) => {
      productsCache[product.id] = product;
      return `
                <div class="product-card">
                    <div class="product-header">
                        <div class="product-name">${escapeHtml(
                          product.name
                        )}</div>
                    </div>
                    <div class="product-body">
                        <div class="product-price">$${parseFloat(
                          product.price
                        ).toFixed(2)}</div>
                        ${
                          product.stock !== undefined
                            ? `<div class="product-field">
                            <span class="product-label">Stock:</span> ${product.stock}
                        </div>`
                            : ""
                        }
                        ${
                          product.description
                            ? `<div class="product-field">
                            <span class="product-label">Descripción:</span> ${escapeHtml(
                              product.description
                            )}
                        </div>`
                            : ""
                        }
                        <div class="product-actions">
                            <button class="action-btn btn-edit" onclick="openEditModal('${
                              product.id
                            }')">Editar</button>
                            <button class="action-btn btn-delete" onclick="handleDeleteProduct('${
                              product.id
                            }')">Eliminar</button>
                        </div>
                    </div>
                </div>
            `;
    })
    .join("");

  document.getElementById("productsList").innerHTML = html;
}

async function handleCreateProduct(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const description = document.getElementById("description").value.trim();

  if (!name || !price) {
    showMessage("Nombre y precio son requeridos", "error");
    return;
  }

  if (parseFloat(price) <= 0) {
    showMessage("El precio debe ser un número positivo", "error");
    return;
  }

  try {
    const body = {
      name,
      price: parseFloat(price),
    };

    if (stock) {
      body.stock = parseInt(stock);
    }

    if (description) {
      body.description = description;
    }

    const response = await sessionManager.authenticatedFetch(
      `${API_URL}/api/products/create`,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      showMessage("Producto agregado exitosamente", "success");
      document.getElementById("productForm").reset();
      loadProducts();
    } else {
      showMessage(data.message || "Error al agregar producto", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage("Error de conexión", "error");
  }
}

async function handleDeleteProduct(id) {
  if (!confirm("¿Está seguro de que desea eliminar este producto?")) {
    return;
  }

  try {
    const response = await sessionManager.authenticatedFetch(
      `${API_URL}/api/products/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      showMessage("Producto eliminado exitosamente", "success");
      loadProducts();
    } else {
      showMessage(data.message || "Error al eliminar producto", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage("Error de conexión", "error");
  }
}

function handleLogout() {
  sessionManager.clearSession();
  window.location.href = "/";
}

function showMessage(text, type) {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = `message ${type} ${text ? "active" : ""}`;

  if (type === "success" && text) {
    setTimeout(() => {
      messageEl.className = "message";
      messageEl.textContent = "";
    }, 5000);
  }
}

function escapeHtml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function openEditModal(productId) {
  const product = productsCache[productId];
  if (!product) {
    showMessage("Producto no encontrado", "error");
    return;
  }

  document.getElementById("editName").value = product.name;
  document.getElementById("editPrice").value = product.price;
  document.getElementById("editStock").value = product.stock || "";
  document.getElementById("editDescription").value = product.description || "";
  document.getElementById("editModal").dataset.productId = productId;
  document.getElementById("editModal").showModal();
}

function closeEditModal() {
  document.getElementById("editModal").close();
  document.getElementById("editForm").reset();
  document.getElementById("editModal").dataset.productId = "";
}

document.getElementById("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const productId = document.getElementById("editModal").dataset.productId;
  const name = document.getElementById("editName").value.trim();
  const price = document.getElementById("editPrice").value;
  const stock = document.getElementById("editStock").value;
  const description = document.getElementById("editDescription").value.trim();

  if (!name || !price) {
    showMessage("Nombre y precio son requeridos", "error");
    return;
  }

  if (parseFloat(price) <= 0) {
    showMessage("El precio debe ser un número positivo", "error");
    return;
  }

  try {
    const body = {
      name,
      price: parseFloat(price),
    };

    if (stock) {
      body.stock = parseInt(stock);
    }

    if (description) {
      body.description = description;
    }

    const response = await sessionManager.authenticatedFetch(
      `${API_URL}/api/products/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      showMessage("Producto actualizado exitosamente", "success");
      closeEditModal();
      loadProducts();
    } else {
      showMessage(data.message || "Error al actualizar producto", "error");
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage("Error de conexión", "error");
  }
});

// Cerrar modal al presionar Escape (nativo de dialog)
document.getElementById("editModal").addEventListener("cancel", (e) => {
  e.preventDefault();
  closeEditModal();
});
