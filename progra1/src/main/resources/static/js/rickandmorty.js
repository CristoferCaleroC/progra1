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

async function abrirModalDetalle(item) {
    const modalBody = document.getElementById('modalBodyContent');
    const modal = document.getElementById('rmModal');

    if (!modalBody || !modal) return;

    if (seccionActual === 'personajes') {
        // 1. Mostramos un estado de carga mientras el backend procesa las URLs anidadas
        modalBody.innerHTML = `
            <img src="${item.image || ''}" alt="${item.name}">
            <h2>${item.name}</h2>
            <p style="text-align: center; color: #666; margin: 15px 0;">Cargando ubicación y episodios...</p>
        `;
        modal.classList.add('active');

        try {
            // 2. Consumimos nuestro nuevo endpoint anidado del backend
            const response = await fetch(`/api/rickandmorty/personajes/${item.id}/detalles`);
            const detalles = await response.json();

            // 3. Procesamos la lista de episodios para listarlos de forma limpia
            let episodiosHtml = '<p style="color: #888;">Sin episodios registrados</p>';
            if (detalles.episodios && detalles.episodios.length > 0) {
                episodiosHtml = '<ul style="max-height: 150px; overflow-y: auto; text-align: left; padding-left: 20px; margin: 5px 0;">';
                detalles.episodios.forEach(ep => {
                    episodiosHtml += `<li><b>${ep.episode}</b>: ${ep.name}</li>`;
                });
                episodiosHtml += '</ul>';
            }

            // 4. Procesamos la información del lugar
            let lugarNombre = 'Desconocido / Sin locación';
            let lugarTipo = 'N/A';
            let lugarDim = 'N/A';
            if (detalles.lugar && detalles.lugar.name) {
                lugarNombre = detalles.lugar.name;
                lugarTipo = detalles.lugar.type || 'N/A';
                lugarDim = detalles.lugar.dimension || 'N/A';
            } else if (typeof detalles.lugar === 'string') {
                lugarNombre = detalles.lugar;
            }

            // 5. Renderizamos el contenido final en el modal con las 2 secciones clave
            modalBody.innerHTML = `
                <img src="${detalles.characterImage || item.image || ''}" alt="${detalles.characterName || item.name}">
                <h2>${detalles.characterName || item.name}</h2>
                
                <div class="modal-info-list" style="margin-top: 15px;">
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin-bottom: 10px;">
                        <strong style="color: #2c3e50; display: block; margin-bottom: 4px;">📍 Lugar de Residencia / Origen:</strong>
                        <span><b>Nombre:</b> ${lugarNombre}</span><br>
                        <span><b>Tipo:</b> ${lugarTipo} | <b>Dimensión:</b> ${lugarDim}</span>
                    </div>

                    <div style="background: #f8f9fa; padding: 10px; border-radius: 6px;">
                        <strong style="color: #2c3e50; display: block; margin-bottom: 4px;">🎬 Episodios en los que participa (${detalles.episodios ? detalles.episodios.length : 0}):</strong>
                        ${episodiosHtml}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error al obtener los detalles anidados del personaje:', error);
            modalBody.innerHTML = `<p style="color: red; text-align: center;">Error al cargar los detalles del personaje.</p>`;
        }

    } else if (seccionActual === 'lugares') {
        modalBody.innerHTML = `
            <h2>${item.name}</h2>
            <div class="modal-info-list" style="margin-top: 10px;">
                <div><span>ID:</span> ${item.id}</div>
                <div><span>Tipo:</span> ${item.type}</div>
                <div><span>Dimensión:</span> ${item.dimension}</div>
            </div>
        `;
        modal.classList.add('active');
    } else if (seccionActual === 'episodios') {
        modalBody.innerHTML = `
            <h2>${item.name}</h2>
            <div class="modal-info-list" style="margin-top: 10px;">
                <div><span>ID:</span> ${item.id}</div>
                <div><span>Episodio:</span> ${item.episode}</div>
                <div><span>Lanzamiento:</span> ${item.air_date}</div>
            </div>
        `;
        modal.classList.add('active');
    }
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