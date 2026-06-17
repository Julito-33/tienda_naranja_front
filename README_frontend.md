# 🖥️ TechStore Paraguay — Frontend

Interfaz de usuario construida con Next.js 16 para la plataforma de e-commerce de componentes informáticos TechStore Paraguay.

---

## 📐 Arquitectura general

```
┌─────────────────────────────────────────────────────────┐
│              FRONTEND (Next.js :3000)                    │
│                                                          │
│  app/                                                    │
│  ├── page.js           → Página de inicio               │
│  ├── catalogo/         → Catálogo con filtros            │
│  ├── producto/[slug]/  → Detalle del producto            │
│  ├── carrito/          → Carrito de compras              │
│  ├── checkout/         → Proceso de pago                 │
│  ├── login/            → Inicio de sesión                │
│  ├── registro/         → Crear cuenta                    │
│  ├── mi-cuenta/        → Historial y facturas            │
│  └── not-found.js      → Página 404                      │
│                                                          │
│  store/                                                  │
│  ├── authStore.js      → Estado de sesión (Zustand)      │
│  └── carritoStore.js   → Estado del carrito (Zustand)    │
│                                                          │
│  services/                                               │
│  └── api.js            → Cliente Axios + interceptor JWT │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP + Bearer Token
                        │ localhost:8000
┌───────────────────────▼─────────────────────────────────┐
│              BACKEND (Django REST API)                   │
│                  localhost:8000                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔗 Conexión con el backend

### Interceptor JWT automático
El archivo `src/services/api.js` configura un interceptor de Axios que:
1. Lee el token JWT del `localStorage`
2. Lo agrega automáticamente en cada request como header `Authorization: Bearer <token>`
3. Si recibe un 401 (sesión vencida), redirige al login — excepto si el 401 viene del propio endpoint de login

```javascript
// src/services/api.js
clienteHttp.interceptors.request.use((config) => {
    const token = localStorage.getItem('token_de_acceso');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

### URL base de la API
```javascript
const clienteHttp = axios.create({
    baseURL: 'http://localhost:8000',
});
```

---

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js 18+
- npm o yarn
- El backend debe estar corriendo en `localhost:8000`

### 1. Clonar el repositorio
```bash
git clone https://github.com/Julito-33/tienda_naranja_front.git
cd tienda_naranja_front
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Correr el servidor de desarrollo
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

---

## 📁 Estructura del proyecto

```
tienda_naranja_front/
│
├── src/
│   ├── app/                         # Páginas (App Router de Next.js)
│   │   ├── layout.js                # Layout global (Navbar + Footer)
│   │   ├── page.js                  # Página de inicio
│   │   ├── not-found.js             # Página 404 personalizada
│   │   ├── globals.css              # Estilos globales
│   │   ├── catalogo/
│   │   │   └── page.js              # Catálogo con filtros
│   │   ├── producto/
│   │   │   └── [slug]/
│   │   │       └── page.js          # Detalle del producto + reseñas
│   │   ├── carrito/
│   │   │   └── page.js              # Carrito de compras
│   │   ├── checkout/
│   │   │   └── page.js              # Proceso de pago en 2 pasos
│   │   ├── login/
│   │   │   └── page.js              # Login con ojito
│   │   ├── registro/
│   │   │   └── page.js              # Registro de usuario
│   │   └── mi-cuenta/
│   │       └── page.js              # Historial + descarga facturas
│   │
│   ├── components/
│   │   └── layout/
│   │       └── Navbar.jsx           # Navegación con contador carrito
│   │
│   ├── services/
│   │   └── api.js                   # Axios + interceptor JWT
│   │
│   └── store/
│       ├── authStore.js             # Estado global de sesión (Zustand)
│       └── carritoStore.js          # Estado global del carrito (Zustand)
│
├── public/                          # Archivos estáticos
├── package.json
├── next.config.mjs
└── tailwind.config.js
```

---

## 🧩 Estado global con Zustand

### authStore — Sesión del usuario
```javascript
// Guarda el estado de autenticación globalmente
{
    esta_logueado: false,
    usuario_autenticado: null,
    token_de_acceso: null,
    iniciar_sesion(),     // POST /api/usuarios/login/
    cerrar_sesion(),      // limpia localStorage
    verificar_sesion_activa(), // al cargar la app
}
```

### carritoStore — Carrito
```javascript
// Sincroniza el carrito con Redis a través del backend
{
    articulos_en_el_carrito: [],
    total_de_articulos: 0,
    precio_total_en_gs: 0,
    traer_carrito_del_servidor(),  // GET /api/carrito/
    agregar_al_carrito(),          // POST /api/carrito/agregar/
    quitar_del_carrito(),          // DELETE /api/carrito/quitar/<id>/
    vaciar_carrito_completo(),     // DELETE /api/carrito/vaciar/
}
```

---

## 📄 Páginas y sus funcionalidades

### Página de inicio (`/`)
- Hero con gradiente azul y estadísticas de la tienda
- Grilla de 10 categorías con iconos
- 8 productos destacados
- Banner de asesoramiento técnico

### Catálogo (`/catalogo`)
- Filtro por categoría (desde el panel lateral y desde el Navbar)
- Búsqueda por nombre de producto
- Filtro por rango de precio en guaraníes
- Detecta cambios de URL automáticamente con `useEffect`

### Detalle del producto (`/producto/[slug]`)
- Imagen del producto con fallback a icono emoji
- Selector de variantes (talla/color)
- Selector de cantidad con límite de stock
- Formulario de reseñas con estrellas interactivas
- Contador de caracteres en el comentario

### Checkout (`/checkout`)
- Paso 1: dirección y ciudad de envío
- Paso 2: método de pago (tarjeta/transferencia/efectivo)
- Tarjetas de prueba visibles para demo
- Indicador visual del paso actual

### Mi cuenta (`/mi-cuenta`)
- Datos del perfil del usuario
- Historial completo de órdenes con estado
- Descarga de factura PDF por orden pagada
- Mensaje de éxito al redirigir desde checkout

---

## 🎨 Diseño y estilos

El proyecto usa **Tailwind CSS** con paleta de colores azul tecnológico:

```
Azul oscuro:  #1e3a8a  (Navbar, encabezados, botones primarios)
Azul medio:   #2563eb  (hover, acentos)
Azul claro:   #dbeafe  (fondos de tarjetas, badges)
Cyan:         #22d3ee  (acentos en el hero)
```

---

## 🧠 Decisiones técnicas

### ¿Por qué Next.js y no React puro?
- Routing automático por carpetas (App Router)
- Mejor SEO con server-side rendering
- Optimización de imágenes incluida
- La misma empresa usa Next.js en producción

### ¿Por qué Zustand y no Redux?
- Mucho más simple (menos boilerplate)
- Suficiente para el scope del proyecto
- API intuitiva con hooks

### ¿Por qué separar frontend y backend en repos distintos?
- Equipos independientes pueden trabajar en paralelo
- El backend puede servir a múltiples clientes (web, mobile)
- Deploy independiente de cada servicio

---

## 🔐 Credenciales de prueba

```
Admin:   admin@tiendanaranja.com  /  Admin2024!
Cliente: julio@tiendanaranja.com  /  Naranja2024!

Tarjeta aprobada:  4111111111111111
Tarjeta rechazada: 4000000000000002
```

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Para qué |
|------------|---------|----------|
| Next.js | 16.2.6 | Framework React con routing |
| React | 18 | Librería UI |
| Tailwind CSS | 4.x | Estilos utilitarios |
| Axios | 1.x | Cliente HTTP + interceptores |
| Zustand | 5.x | Estado global |
| Heroicons | 2.x | Iconos SVG |

---

## 🚦 Cómo correr el proyecto completo

Para correr TechStore Paraguay completo se necesitan **3 terminales**:

**Terminal 1 — Infraestructura (Docker):**
```bash
cd tienda_naranja
docker-compose up -d
```

**Terminal 2 — Backend (Django):**
```bash
cd tienda_naranja
.\venv\Scripts\activate          # Windows
python manage.py runserver
```

**Terminal 3 — Frontend (Next.js):**
```bash
cd tienda_naranja_front
npm run dev
```

Luego abrir `http://localhost:3000` en el navegador.

---

## 👨‍💻 Autor

**Julito** — Estudiante de Programación V  
Universidad — Asunción, Paraguay 🇵🇾  
GitHub: [@Julito-33](https://github.com/Julito-33)

**Repositorio del backend:** [api_ecommerce](https://github.com/Julito-33/api_ecommerce)
