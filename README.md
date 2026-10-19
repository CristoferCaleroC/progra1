# 🚀 Sistema de Gestión de Productos & Módulo Rick and Morty API

Este proyecto es una aplicación web full-stack desarrollada con **Spring Boot** y **Java** en el backend, conectada a una base de datos **PostgreSQL**, con un frontend dinámico e interactivo contruido con **HTML5, CSS3 y JavaScript (ES6+)**.

---

## 🛠️ Tecnologías Utilizadas

- **Backend:** Java 17+, Spring Boot (Spring Web, Spring Data JPA, RestTemplate)
- **Base de Datos:** PostgreSQL
- **Frontend:** HTML5, CSS3, JavaScript (Fetch API, Async/Await)
- **Consumo de APIs Externas:** Rick and Morty API (`https://rickandmortyapi.com/`)
- **Herramientas de Desarrollo:** Visual Studio Code / NetBeans, Maven, Git, GitHub

---

## 📌 Características Principales

### 1. 📦 Módulo de Gestión de Productos (CRUD Completo)
- **Crear (POST):** Registro de nuevos productos en la base de datos PostgreSQL.
- **Leer (GET):** Listado general e individual de productos.
- **Actualizar (PUT):** Edición de información de productos existentes.
- **Eliminar (DELETE):** Borrado de productos.

### 2. 🛸 Módulo Rick & Morty API (Patrón Backend-for-Frontend / BFF)
- **Endpoints Intermediarios (Proxy):** El backend consume la API pública mediante `RestTemplate` y expone 3 endpoints propios:
  - `GET /api/rickandmorty/personajes` — Listado completo de personajes.
  - `GET /api/rickandmorty/lugares` — Listado completo de ubicaciones.
  - `GET /api/rickandmorty/episodios` — Listado completo de episodios.
- **Recuperación Recursiva:** Paginación iterativa automática en JavaScript para recuperar el 100% de los registros disponibles en la API externa.
- **Optimización de Búsqueda (Debounce):** Implementación de una función de retraso de 4 segundos en la caja de búsqueda para reducir la carga de peticiones.
- **Vista de Detalle (Modal):** Ventana emergente con traducciones de estado, género y especie para cada ítem seleccionado.

---

## ⚙️ Configuración del Entorno de Desarrollo

### Requisitos Previos
- Java JDK 17 o superior
- PostgreSQL (Base de datos creada y configurada)
- Maven

### Configuración de la Base de Datos (`application.properties`)
Asegúrate de configurar los datos de conexión a tu base de datos local PostgreSQL en el archivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tu_base_de_datos
spring.datasource.username=postgres
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
