// src/main/resources/static/js/productos.js
let listaProductos = [];
let timeoutId = null;
let intervalId = null;

async function cargarProductos() {
    try {
        const response = await fetch('/api/productos');
        listaProductos = await response.json();
        mostrarProductos(listaProductos);
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

function mostrarProductos(productos) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';

    if (!productos || productos.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #7f8c8d;">No se encontraron productos.</p>';
        return;
    }

    productos.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => abrirModalDetalle(prod.id);

        const imagenProd = prod.imagen || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60';
        const nombreProd = prod.nombre || 'Sin nombre';
        const precioProd = prod.precio !== undefined ? prod.precio : '0.00';

        card.innerHTML = `
            <img src="${imagenProd}" alt="${nombreProd}">
            <div class="card-body">
                <div class="card-title">${nombreProd}</div>
                <div class="card-subtitle">ID: ${prod.id} | $ ${precioProd}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Búsqueda con cuenta regresiva de 4 segundos por Nombre o ID
function manejarBusquedaConDelay() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const counterEl = document.getElementById('countdownIndicator');

    // Limpiar temporizadores anteriores si el usuario sigue escribiendo
    clearTimeout(timeoutId);
    clearInterval(intervalId);

    if (query === '') {
        counterEl.textContent = '';
        mostrarProductos(listaProductos);
        return;
    }

    let segundosRestantes = 4;
    counterEl.textContent = `Búsqueda en curso en ${segundosRestantes} segundos...`;

    // Cuenta regresiva visual cada 1 segundo (4, 3, 2, 1)
    intervalId = setInterval(() => {
        segundosRestantes--;
        if (segundosRestantes > 0) {
            counterEl.textContent = `Búsqueda en curso en ${segundosRestantes} segundos...`;
        } else {
            counterEl.textContent = '¡Buscando...!';
            clearInterval(intervalId);
        }
    }, 1000);

    // Temporizador principal de 4 segundos (4000ms) para realizar el filtrado real
    timeoutId = setTimeout(() => {
        counterEl.textContent = '';
        const filtrados = listaProductos.filter(p => {
            const coincideNombre = p.nombre.toLowerCase().includes(query);
            const coincideId = p.id.toString() === query;
            return coincideNombre || coincideId;
        });
        mostrarProductos(filtrados);
    }, 4000);
}

// Abrir Modal de Detalle con botones Editar (PUT) y Borrar (DELETE)
function abrirModalDetalle(id) {
    const prod = listaProductos.find(p => p.id === id);
    if (!prod) return;

    const modalBody = document.getElementById('modalBody');
    const imagenProd = prod.imagen || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60';

    modalBody.innerHTML = `
        <img src="${imagenProd}" alt="${prod.nombre}">
        <h2 style="font-size: 20px; color: #2c3e50; margin-bottom: 5px;">${prod.nombre}</h2>
        <p style="color: #7f8c8d; font-size: 13px; margin-bottom: 10px;">ID: ${prod.id} | <strong>$ ${prod.precio}</strong></p>
        <p style="font-size: 14px; color: #555; text-align: left; margin-bottom: 15px;">${prod.descripcion || 'Sin descripción.'}</p>
        
        <div class="modal-actions">
            <button class="btn-editar" onclick="abrirModalEditar(${prod.id})">Editar (PUT)</button>
            <button class="btn-borrar" onclick="eliminarProducto(${prod.id})">Borrar (DELETE)</button>
        </div>
    `;

    document.getElementById('productModal').classList.add('active');
}

// Abrir Modal para Crear Nuevo Producto
function abrirModalNuevo() {
    document.getElementById('formModalTitle').textContent = "Nuevo Producto";
    document.getElementById('productForm').reset();
    document.getElementById('prodId').value = "";
    document.getElementById('formModal').classList.add('active');
}

// Abrir Modal para Editar Producto Existente
function abrirModalEditar(id) {
    cerrarModal('productModal');
    const prod = listaProductos.find(p => p.id === id);
    if (!prod) return;

    document.getElementById('formModalTitle').textContent = "Editar Producto";
    document.getElementById('prodId').value = prod.id;
    document.getElementById('prodNombre').value = prod.nombre;
    document.getElementById('prodPrecio').value = prod.precio;
    document.getElementById('prodDescripcion').value = prod.descripcion || "";
    document.getElementById('prodImagen').value = prod.imagen || "";

    document.getElementById('formModal').classList.add('active');
}

// Guardar (POST para crear o PUT para actualizar)
async function guardarProductoForm(event) {
    event.preventDefault();
    const id = document.getElementById('prodId').value;
    
    const productoData = {
        nombre: document.getElementById('prodNombre').value,
        precio: parseFloat(document.getElementById('prodPrecio').value),
        descripcion: document.getElementById('prodDescripcion').value,
        imagen: document.getElementById('prodImagen').value
    };

    const url = id ? `/api/productos/${id}` : '/api/productos';
    const method = id ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productoData)
        });

        if (response.ok) {
            cerrarModal('formModal');
            cargarProductos();
        } else {
            alert('Error al guardar el producto.');
        }
    } catch (error) {
        console.error('Error en la petición:', error);
    }
}

// Eliminar Producto (DELETE)
async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        const response = await fetch(`/api/productos/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            cerrarModal('productModal');
            cargarProductos();
        } else {
            alert('No se pudo eliminar el producto.');
        }
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}

function cerrarModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function cerrarModalExterno(event, modalId) {
    if (event.target.classList.contains('modal-overlay')) {
        cerrarModal(modalId);
    }
}

// Cargar al iniciar
cargarProductos();