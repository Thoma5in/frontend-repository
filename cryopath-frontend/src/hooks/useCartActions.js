import { useCallback, useState } from 'react';
import { actualizarCantidad, agregarAlCarrito, obtenerCarrito } from '../services/cartApi';

export default function useCartActions({
  session,
  profile,
  isAuthenticated,
  inventarioMap,
  refreshCartCount,
  navigate,
  showToast,
} = {}) {
  const [addingToCart, setAddingToCart] = useState(false);

  const getCartItemsSafe = useCallback(async () => {
    try {
      const raw = await obtenerCarrito(session?.access_token, profile?.id);
      const maybe = raw?.data ?? raw;
      return Array.isArray(maybe)
        ? maybe
        : (Array.isArray(maybe?.items) ? maybe.items : []);
    } catch {
      return [];
    }
  }, [profile?.id, session?.access_token]);

  const addToCart = useCallback(async (product) => {
    try {
      if (addingToCart) return;

      if (!isAuthenticated || !session || !profile?.id) {
        alert('Debes iniciar sesión para agregar productos al carrito');
        navigate('/login');
        return;
      }

      setAddingToCart(true);

      const stock = inventarioMap?.[product?.id_producto] ?? 0;
      if (stock <= 0) {
        showToast?.('Producto sin stock', 'error');
        return;
      }

      const cartItems = await getCartItemsSafe();
      const existing = cartItems.find((it) => Number(it?.id_producto) === Number(product?.id_producto));

      if (existing?.id) {
        const currentQty = Math.max(1, Number(existing?.cantidad ?? 1) || 1);
        const nextQty = currentQty + 1;

        if (nextQty > stock) {
          showToast?.('No hay suficiente stock', 'error');
          return;
        }

        await actualizarCantidad(session.access_token, profile.id, existing.id, nextQty);
        showToast?.('Cantidad actualizada', 'success');
      } else {
        const payload = {
          id_producto: product?.id_producto,
          cantidad: 1,
        };

        await agregarAlCarrito(session.access_token, profile.id, payload);
        showToast?.('Añadido al carrito', 'success');
      }

      console.log('Producto añadido al carrito con éxito');
      await refreshCartCount?.();
    } catch (error) {
      console.error('Error al añadir al carrito', error);
      showToast?.('No se pudo añadir al carrito', 'error');
    } finally {
      setAddingToCart(false);
    }
  }, [addingToCart, getCartItemsSafe, inventarioMap, isAuthenticated, navigate, profile?.id, refreshCartCount, session, showToast]);

  return { addToCart, addingToCart };
}
