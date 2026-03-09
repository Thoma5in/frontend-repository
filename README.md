# Cryopath Frontend

Plataforma de comercio electrónico moderna con panel de administración, sistema de pagos, carrito de compras y asistente IA integrado.

## 📋 Descripción

Cryopath es una aplicación web de e-commerce desarrollada con React y Vite que ofrece:

- **Tienda en línea**: Catálogo de productos con filtros, búsqueda y paginación
- **Carrito de compras**: Gestión completa de productos y checkout
- **Sistema de pagos**: Integración con procesadores de pago
- **Panel de administración**: Gestión de productos, usuarios, categorías y roles
- **Autenticación**: Sistema de login/registro con roles (usuario, vendedor, admin)
- **Asistente IA**: Chatbot integrado para ayuda al usuario
- **Mensajería**: Sistema de conversaciones entre usuarios
- **Perfil de usuario**: Edición de información personal
- **Reseñas**: Sistema de valoraciones y comentarios de productos

## 🚀 Tecnologías

- **React** 19.2.0 - Biblioteca UI
- **Vite** 7.3.1 - Build tool y dev server
- **React Router** 7.11.0 - Enrutamiento
- **Axios** 1.13.2 - Cliente HTTP
- **ESLint** - Linting de código
- **pnpm** 10.26.2 - Gestor de paquetes

## 📦 Instalación y ejecución

### 1) Instalar pnpm (si no lo tienes)

Instala pnpm de forma global:

```bash
npm install -g pnpm
```

Verifica la instalación:

```bash
pnpm -v
```

### 2) Instalar dependencias

Entra a la carpeta del frontend y instala:

```bash
cd cryopath-frontend
pnpm install
```

### 3) Ejecutar en modo desarrollo

```bash
pnpm dev
```

La app se levantará con Vite y te mostrará la URL (por defecto `http://localhost:5173`).

### 4) Construir para producción

```bash
pnpm build
```

### 5) Previsualizar el build

```bash
pnpm preview
```

Esto sirve para verificar el paquete generado antes de desplegar.

## 📜 Scripts disponibles

- `pnpm dev` - Inicia el servidor de desarrollo
- `pnpm build` - Genera el build de producción
- `pnpm lint` - Ejecuta ESLint para verificar el código
- `pnpm preview` - Previsualiza el build de producción

## 📁 Estructura del proyecto

```
cryopath-frontend/
├── public/          # Archivos estáticos
├── src/
│   ├── assets/      # Iconos y recursos
│   ├── components/  # Componentes reutilizables
│   │   ├── dashboard-components/    # Componentes del admin
│   │   ├── detalle-producto-parte*/  # Componentes de detalle
│   │   ├── layout/                   # Header, Footer, Layout
│   │   └── vendedor-*/               # Componentes de vendedor
│   ├── context/     # Contextos de React (Auth, Theme)
│   ├── hooks/       # Custom hooks
│   ├── pages/       # Páginas principales
│   │   ├── assistant/      # Asistente IA
│   │   ├── carrito/        # Carrito de compras
│   │   ├── dashboard/      # Panel admin
│   │   ├── home/           # Página principal
│   │   ├── login/          # Autenticación
│   │   ├── pagos/          # Procesamiento de pagos
│   │   ├── product-detail/ # Detalle de producto
│   │   └── supermarket/    # Catálogo de productos
│   ├── services/    # APIs y servicios
│   └── utils/       # Utilidades y helpers
├── index.html
├── package.json
└── vite.config.js
```

## 🔑 Características principales

### Para usuarios
- Navegación de productos con filtros y búsqueda
- Carrito de compras con gestión de cantidades
- Proceso de checkout y pagos
- Sistema de reseñas y valoraciones
- Chat con asistente IA
- Gestión de perfil personal

### Para vendedores
- Agregar y editar productos propios
- Gestión de descuentos y promociones
- Control de inventario

### Para administradores
- Panel de control completo
- Gestión de usuarios y roles
- Administración de productos y categorías
- Control de estado de usuarios
- Eliminación de productos y usuarios

## 🔒 Rutas protegidas

El proyecto implementa rutas protegidas según el rol del usuario:
- Rutas públicas: Home, Login, Register, Productos
- Rutas autenticadas: Carrito, Perfil, Mensajes
- Rutas de vendedor: Agregar productos, Gestionar inventario
- Rutas de admin: Dashboard completo

