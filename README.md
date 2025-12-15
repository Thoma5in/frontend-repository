# Instalación y ejecución (pnpm)

Sigue estos pasos simples después de clonar el repositorio. Este proyecto usa pnpm.

## 1) Instalar pnpm (si no lo tienes)

Instala pnpm de forma global:

```bash
npm install -g pnpm
```

Verifica la instalación:

```bash
pnpm -v
```

## 2) Instalar dependencias

Entra a la carpeta del frontend y instala:

```bash
cd cryopath-frontend
pnpm install
```

## 3) Ejecutar en modo desarrollo

```bash
pnpm dev
```

La app se levantará con Vite y te mostrará la URL (por defecto suele ser `http://localhost:5173`).

## 4) Construir para producción

```bash
pnpm build
```

## 5) Previsualizar el build

```bash
pnpm preview
```

Esto sirve para verificar el paquete generado antes de desplegar.

# cryopath-frontend
