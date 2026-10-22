// src/main/resources/static/js/rickandmorty.js
let seccionActual = 'personajes';
let paginaActual = 1;
let timeoutId = null;
let intervalId = null;

async function cargarDatos() {
    try {
        const response = await fetch(`/api/rickandmorty/${seccionActual}?page=${paginaActual}`);
        const data = await response.json();
        
        const items = data.results || data;
        mostrarResultados(items);
        
        document.getElementById('pageIndicator').textContent = `Página ${paginaActual}`;
        document.getElementById('paginationControls').style.display = 'flex';
    } catch (error) {
        console.error('Error al consumir la API de Rick and Morty:', error);
    }
}

function mostrarResultados(items) {
    const grid = document.getElementById('rmGrid');
    grid.innerHTML = '';

    const lista = Array.isArray(items) ? items : [items];

    if (!lista || lista.length === 0 || !lista[0]) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #aaa;">No se encontraron resultados.</p>';
        return;
    }

    lista.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.style.cursor = 'pointer';

        if (seccionActual === 'personajes') {
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="card-body">
                    <div class="card-title">${item.name}</div>
                    <div class="card-subtitle">ID: ${item.id} | ${item.species}</div>
                </div>
            `;
        } else if (seccionActual === 'lugares') {
            card.innerHTML = `
                <div class="card-body" style="padding: 30px 15px;">
                    <div class="card-title">${item.name}</div>
                    <div class="card-subtitle">ID: ${item.id} | Tipo: ${item.type}</div>
                </div>
            `;
        } else if (seccionActual === 'episodios') {
            card.innerHTML = `
                <div class="card-body" style="padding: 30px 15px;">
                    <div class="card-title">${item.name}</div>
                    <div class="card-subtitle">ID: ${item.id} | Ep: ${item.episode}</div>
                </div>
            `;
        }

        card.addEventListener('click', () => {
            abrirModalDetalle(item);
        });

        grid.appendChild(card);
    });
}

// Búsqueda con cuenta regresiva de 4 segundos
function manejarBusquedaConDelay() {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const counterEl = document.getElementById('countdownIndicator');

    clearTimeout(timeoutId);
    clearInterval(intervalId);

    if (query === '') {
        counterEl.textContent = '';
        cargarDatos();
        return;
    }

    let segundosRestantes = 4;
    counterEl.textContent = `Búsqueda en curso en ${segundosRestantes} segundos...`;

    intervalId = setInterval(() => {
        segundosRestantes--;
        if (segundosRestantes > 0) {
            counterEl.textContent = `Búsqueda en curso en ${segundosRestantes} segundos...`;
        } else {
            counterEl.textContent = '¡Buscando...!';
            clearInterval(intervalId);
        }
    }, 1000);

    timeoutId = setTimeout(() => {
        counterEl.textContent = '';
        ejecutarBusquedaServidor(query);
    }, 4000);
}

async function ejecutarBusquedaServidor(query) {
    try {
        let url = `/api/rickandmorty/${seccionActual}`;
        let response;

        // Si escriben un número, intentamos buscar por ID específico
        if (!isNaN(query)) {
            response = await fetch(`${url}/${query}`);
            if (response.ok) {
                const item = await response.json();
                mostrarResultados([item]);
                document.getElementById('paginationControls').style.display = 'none';
                return;
            }
        }

        // Búsqueda por nombre utilizando parámetros
        response = await fetch(`${url}?name=${query}`);
        if (response.ok) {
            const data = await response.json();
            mostrarResultados(data.results || data);
        } else {
            mostrarResultados([]);
        }

        document.getElementById('paginationControls').style.display = 'none';
    } catch (error) {
        console.error('Error detallado en la búsqueda:', error);
        mostrarResultados([]);
    }
}

function abrirModalDetalle(item) {
    const modalBody = document.getElementById('modalBodyContent');
    const modal = document.getElementById('rmModal');

    if (!modalBody || !modal) return;

    if (seccionActual === 'personajes') {
        modalBody.innerHTML = `
            <img src="${item.image || ''}" alt="${item.name}">
            <h2>${item.name}</h2>
            <div class="modal-info-list">
                <div><span>ID:</span> ${item.id}</div>
                <div><span>Especie:</span> ${item.species}</div>
                <div><span>Estado:</span> ${item.status}</div>
                <div><span>Género:</span> ${item.gender}</div>
                <div><span>Origen:</span> ${item.origin ? item.origin.name : 'Unknown'}</div>
            </div>
        `;
    } else if (seccionActual === 'lugares') {
        modalBody.innerHTML = `
            <h2>${item.name}</h2>
            <div class="modal-info-list" style="margin-top: 10px;">
                <div><span>ID:</span> ${item.id}</div>
                <div><span>Tipo:</span> ${item.type}</div>
                <div><span>Dimensión:</span> ${item.dimension}</div>
            </div>
        `;
    } else if (seccionActual === 'episodios') {
        modalBody.innerHTML = `
            <h2>${item.name}</h2>
            <div class="modal-info-list" style="margin-top: 10px;">
                <div><span>ID:</span> ${item.id}</div>
                <div><span>Episodio:</span> ${item.episode}</div>
                <div><span>Lanzamiento:</span> ${item.air_date}</div>
            </div>
        `;
    }

    modal.classList.add('active');
}

function cerrarModal() {
    const modal = document.getElementById('rmModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function cerrarModalExterno(event) {
    if (event.target.classList.contains('modal-overlay')) {
        cerrarModal();
    }
}

function cambiarSeccion(seccion) {
    seccionActual = seccion;
    paginaActual = 1;
    document.getElementById('searchInput').value = '';
    document.getElementById('countdownIndicator').textContent = '';

    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    cargarDatos();
}

function cambiarPagina(direccion) {
    if (paginaActual + direccion > 0) {
        paginaActual += direccion;
        cargarDatos();
    }
}

cargarDatos();