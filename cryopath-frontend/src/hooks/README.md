# Hooks Personalizados - Cryopath Frontend

## 📋 Índice
1. [Visión General](#visión-general)
2. [Patrones y Convenciones](#patrones-y-convenciones)
3. [Hooks Disponibles](#hooks-disponibles)
4. [Cuándo Crear Hooks vs Lógica Local](#cuándo-crear-hooks-vs-lógica-local)
5. [Estructura Escalable](#estructura-escalable-futura)
6. [Ejemplos de Implementación](#ejemplos-de-implementación)

---

## 🎯 Visión General

Este directorio contiene **hooks personalizados reutilizables** que encapsulan lógica común para facilitar su reutilización en múltiples componentes.

Los **hooks de contexto** (como `useAuth` y `useTheme`) residen en `src/context/` siguiendo el patrón estándar de React.

**Funciones utilitarias puras** (como `parsePrice`, `truncateWords`) están en `src/utils/` y pueden ser importadas directamente o usadas dentro de hooks.

---

## 🏗️ Patrones y Convenciones

### 1. **Nombres de Hooks**
- Todos comienzan con `use` (ej: `useCartActions`, `useToast`)
- Describen QUÉ hacen, no CÓMO lo hacen
- Usar camelCase: `useProductListing`, NO `useProduct_listing`

### 2. **Estructura de un Hook**
```javascript
import { useEffect, useMemo, useState } from 'react';
import { someUtility } from '../utils/formatters';

/**
 * Breve descripción del propósito del hook
 * @param {Object} options - Configuración
 * @param {Array} options.items - Ítems a procesar
 * @param {number} options.limit - Límite (default: 10)
 * @returns {Object} { state, handlers, computed values }
 */
export default function useMyHook({ items = [], limit = 10 } = {}) {
  const [state, setState] = useState(initialState);

  const computedValue = useMemo(() => {
    // Lógica costosa
    return result;
  }, [dependencies]);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handler = (arg) => {
    // Manejar acciones
  };

  return {
    state,
    computedValue,
    handler,
  };
}
```

### 3. **Importación en Componentes**
```javascript
// ✅ Correcto
import useProductListing from '@/hooks/useProductListing';
import { useAuth } from '@/context/AuthContext';
import { parsePrice } from '@/utils/formatters';

// ❌ Evitar
import { default as MyHook } from '...'
```

### 4. **Separación de Concerns**
- **Hooks (`src/hooks/`)**: Encapsulan estado + lógica reutilizable
- **Context (`src/context/`)**: Estado global (autenticación, tema, etc)
- **Utils (`src/utils/`)**: Funciones puras, sin estado
- **Componentes**: Presentación y orquestación

---

## 🎁 Hooks Disponibles

### 1. **useCartActions**
**Archivo:** `useCartActions.js`  
**Propósito:** Gestionar acciones del carrito (agregar, actualizar cantidad)

```javascript
const { addToCart, updateCartQuantity } = useCartActions();
addToCart(product, quantity);
```

**Validaciones incluidas:**
- Verificación de stock disponible
- Validación de cantidad mínima

---

### 2. **useHomeProductsData**
**Archivo:** `useHomeProductsData.js`  
**Propósito:** Obtener productos, imágenes, categorías e inventario para la página principal

```javascript
const { 
  products, 
  imagenesMap, 
  categoriasPorProducto, 
  inventarioMap, 
  isLoading 
} = useHomeProductsData();
```

**Responsabilidades:**
- Fetch inicial de datos
- Almacenamiento en memoria
- Manejo de errores

---

### 3. **useProductListing**
**Archivo:** `useProductListing.js`  
**Propósito:** Filtrado, paginación y ordenamiento de productos

```javascript
const {
  currentProducts,
  totalPages,
  currentPage,
  minPrice,
  maxPrice,
  sortOrder,
  handleMaxPriceChange,
  handleSortOrderChange,
  handlePrev,
  handleNext,
} = useProductListing({
  products,
  inventarioMap,
  categoriasPorProducto,
  selectedCategoriaId: null,
});
```

**Características:**
- Filtrado por categoría
- Filtrado por rango de precio
- Filtrado por stock disponible
- Ordenamiento ascendente/descendente
- Paginación automática

---

### 4. **useToast**
**Archivo:** `useToast.js`  
**Propósito:** Mostrar notificaciones temporales con diferentes tipos

```javascript
const toast = useToast();
toast.success('Producto agregado');
toast.error('Error al guardar');
toast.warning('Advertencia');
```

**Tipos soportados:** `success`, `error`, `warning`, `info`

---

## ❓ Cuándo Crear Hooks vs Lógica Local

### ✅ Crear un Hook si:
- [ ] La lógica se reutiliza en 2+ componentes
- [ ] Contiene estado que necesita ser compartido
- [ ] Encapsula side effects complejos
- [ ] La lógica hace más de una cosa clara
- [ ] Mejora la legibilidad del componente

### ❌ Dejar la lógica en el componente si:
- [ ] Solo la usa un componente
- [ ] Es muy simple (< 3 líneas)
- [ ] No tiene estado
- [ ] Es específica del UI del componente

### 📝 Ejemplo: Cuándo Refactorizar a Hook
```javascript
// ❌ Lógica en componente (pero se usa en 2+ lugares)
function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // API call, localStorage, etc
  };
  
  return <div>...</div>;
}

// ✅ Refactor a Hook
export default function useFavorite(productId) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const toggleFavorite = useCallback(() => {
    // Lógica reutilizable
  }, [productId]);
  
  return { isFavorite, toggleFavorite };
}

// Uso en múltiples componentes
function ProductCard({ product }) {
  const { isFavorite, toggleFavorite } = useFavorite(product.id);
  return <div>...</div>;
}
```

---

## 🚀 Estructura Escalable (Futura)

A medida que el proyecto crece, se puede reorganizar en dominios:

```
src/hooks/
├── README.md (este archivo)
├── product/
│   ├── useProductListing.js      (filtrado, paginación, orden)
│   ├── useProductDetail.js       (detalles de producto)
│   └── useProductSearch.js       (búsqueda y filtros avanzados)
├── cart/
│   ├── useCartActions.js         (agregar, actualizar, eliminar)
│   └── useCartSummary.js         (totales, cantidades)
├── form/
│   ├── useToast.js               (notificaciones)
│   ├── useFormValidation.js      (validar campos)
│   └── useFormState.js           (estado de formulario)
├── user/
│   ├── useFavorites.js           (productos favoritos)
│   └── useUserPreferences.js     (preferencias personales)
└── vendor/
    ├── useVendorProducts.js      (productos del vendedor)
    └── useVendorSales.js         (ventas del vendedor)
```

**Ventajas:**
- Mejor organización por dominio
- Facilita búsqueda de hooks relacionados
- Reduce conflictos de nombres
- Facilita la escalabilidad

**Migrando a esta estructura:**
1. Crear carpeta de dominio: `src/hooks/product/`
2. Mover hooks: `src/hooks/useProductListing.js` → `src/hooks/product/useProductListing.js`
3. Actualizar imports en componentes
4. No requiere cambios funcionales

---

## 📚 Ejemplos de Implementación

### Ejemplo 1: Hook Simple (Sin Estado)
```javascript
// src/hooks/useDebounce.js
import { useEffect, useState } from 'react';

/**
 * Hook para debounce de valores
 * @param {any} value - Valor a debounce
 * @param {number} delay - Delay en ms (default: 500)
 * @returns {any} Valor debounceado
 */
export default function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Uso
function SearchProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch) {
      // API call con valor debounceado
    }
  }, [debouncedSearch]);
}
```

### Ejemplo 2: Hook con State y Effects
```javascript
// src/hooks/form/useFormState.js
import { useCallback, useState } from 'react';

/**
 * Hook para manejar estado de formularios
 * @param {Object} initialValues - Valores iniciales
 * @param {Function} onSubmit - Callback al enviar
 * @returns {Object} Estado y handlers del formulario
 */
export default function useFormState(initialValues = {}, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      setErrors(error.validationErrors || {});
    } finally {
      setIsSubmitting(false);
    }
  }, [values, onSubmit]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
    setErrors,
  };
}

// Uso
function LoginForm() {
  const form = useFormState(
    { email: '', password: '' },
    async (values) => {
      await loginApi(values);
    }
  );

  return (
    <form onSubmit={form.handleSubmit}>
      <input
        name="email"
        value={form.values.email}
        onChange={form.handleChange}
      />
      {form.errors.email && <span>{form.errors.email}</span>}
    </form>
  );
}
```

### Ejemplo 3: Hook Complejo (Múltiples Estados, Efectos, Lógica)
```javascript
// src/hooks/product/useProductSearch.js
import { useCallback, useEffect, useMemo, useState } from 'react';
import { searchProductsApi } from '../services/productosApi';
import { parsePrice } from '../utils/formatters';

export default function useProductSearch({ 
  initialQuery = '', 
  filters = {} 
} = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);

  // Debounce manual
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch cuando cambia la búsqueda
  useEffect(() => {
    if (!debouncedQuery && page === 1) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchProductsApi({
          query: debouncedQuery,
          page,
          ...filters,
        });
        setResults(data.products || []);
      } catch (err) {
        setError(err.message);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery, page, filters]);

  // Computaciones
  const priceStats = useMemo(() => {
    if (results.length === 0) return { min: 0, max: 0 };
    const prices = results.map(p => parsePrice(p.precio_base)).filter(p => p !== null);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }, [results]);

  const handlers = useCallback({
    search: setQuery,
    nextPage: () => setPage(p => p + 1),
    prevPage: () => setPage(p => Math.max(1, p - 1)),
    reset: () => {
      setQuery(initialQuery);
      setPage(1);
      setResults([]);
    },
  }, [initialQuery]);

  return {
    query,
    results,
    isLoading,
    error,
    page,
    priceStats,
    ...handlers,
  };
}
```

---

## 🔍 Checklist al Crear un Nuevo Hook

- [ ] Nombre empieza con `use`
- [ ] Tiene JSDoc con descripción y parámetros
- [ ] Solo hace una cosa bien (Single Responsibility)
- [ ] Maneja errores apropiadamente
- [ ] usa `useMemo` para valores computados costosos
- [ ] usa `useCallback` para funciones memoizadas
- [ ] Retorna un objeto limpio y documentado
- [ ] Archivo en `src/hooks/` (o subcarpeta si crece)
- [ ] Nombre del archivo coincide con el hook: `useMyHook.js`
- [ ] Validado en al menos 2 componentes (o documentar si es específico)

---

## 📞 Preguntas Frecuentes

**P: ¿Puedo tener múltiples hooks en un archivo?**  
R: No, un archivo = un hook. Facilita búsqueda y mantenimiento.

**P: ¿Qué pasa si necesito combinar hooks?**  
R: Crea un hook compositor:
```javascript
export default function useProductWithCart(productId) {
  const product = useProductDetail(productId);
  const { addToCart } = useCartActions();
  return { product, addToCart };
}
```

**P: ¿Los hooks pueden hacer API calls?**  
R: Sí, pero encapsula la lógica en `useEffect`. Considera usar librerías como `react-query` para proyectos grandes.

**P: ¿Debo exportar funciones utilitarias desde hooks?**  
R: No, las funciones puras van en `src/utils/`. Los hooks solo exportan estado y handlers.

---

## 🔗 Referencias
- [React Hooks Documentation](https://react.dev/reference/react)
- [Custom Hooks Best Practices](https://react.dev/learn/reusing-logic-with-custom-hooks)
- Estructura del proyecto: `src/` → `hooks/`, `context/`, `utils/`, `components/`

