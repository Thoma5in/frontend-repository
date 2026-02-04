import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  obtenerCarrito,
  actualizarCantidad,
  eliminarItem,
  vaciarCarrito,
} from "../../services/cartApi";

export default function Cart() {
  const { session, profile, isAuthenticated, refreshCartCount } = useAuth();
  const navigate = useNavigate();
  const token = session?.access_token;
  const userId =  profile?.id ;

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operatingId, setOperatingId] = useState(null);
  const [error, setError] = useState(null);

  // Selección local (no se persiste en backend)
  const [selectedIds, setSelectedIds] = useState(new Set());

  const allSelected = cart.length > 0 && selectedIds.size === cart.length;

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? new Set(cart.map(i => i.id)) : new Set());
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const fetchCart = async () => {
    if (!isAuthenticated || !token || !userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await obtenerCarrito(token, userId);

      console.log("Datos del carrito obtenidos:", response);

      const data = response.data ?? response;

      const normalized = (data || []).map(item => ({
        ...item,
        id: item.id,
        cantidad: Math.max(1, Number(item.cantidad ||  1)),
        stock: Number(item.stock ?? 0), 
        precio: Number(item.precio || item.precio_base || 0),
        precioOriginal: Number(item.precioOriginal || item.precio || 0),
        descuento: Number(item.descuento || 0)
        
      }));
      setCart(normalized);
      setSelectedIds(new Set()); // limpia selección al recargar

      // Mantiene el badge del header sincronizado sin otro request
      refreshCartCount(normalized);
    } catch (e) {
      setError(e.message || 'Error al cargar carrito');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, [token, userId]);

  const handleQuantity = async (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const nextCantidad = Math.max(1, item.cantidad + delta);

    if (nextCantidad > item.stock) {
      setError('No hay suficiente stock disponible');
      return
    }

    try {
      setOperatingId(id);
      await actualizarCantidad(token, userId, id, nextCantidad);
      await fetchCart();
    } catch (e) {
      setError(e.message || 'No se pudo actualizar la cantidad');
    } finally {
      setOperatingId(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      setOperatingId(id);
      await eliminarItem(token, userId, id);
      await fetchCart();
    } catch (e) {
      setError(e.message || 'No se pudo eliminar el producto');
    } finally {
      setOperatingId(null);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      setOperatingId('bulk');
      const ids = Array.from(selectedIds);
      await Promise.all(ids.map(id => eliminarItem(token, userId, id)));
      await fetchCart();
    } catch (e) {
      setError(e.message || 'No se pudieron eliminar los seleccionados');
    } finally {
      setOperatingId(null);
    }
  };

  const handleClearCart = async () => {
    try {
      setOperatingId('clear');
      await vaciarCarrito(token, userId);
      await fetchCart();
    } catch (e) {
      setError(e.message || 'No se pudo vaciar el carrito');
    } finally {
      setOperatingId(null);
    }
  };

  const total = cart
    .filter(item => selectedIds.has(item.id))
    .reduce((sum, item) => sum + (Number(item.precio) || 0) * item.cantidad, 0);

  const handleBuy = () => {
    const selectedItems = cart.filter(item => selectedIds.has(item.id));
    if (selectedItems.length === 0) return;

    // Persistimos para soportar refresh en /pagos
    try {
      sessionStorage.setItem(
        "checkoutSelection",
        JSON.stringify({ items: selectedItems, createdAt: Date.now() })
      );
    } catch {
      // ignore storage errors
    }

    navigate("/pagos", { state: { items: selectedItems } });
  };

  if (!isAuthenticated) {
    return <div className="cart-container"><p>Inicia sesión para ver tu carrito.</p></div>;
  }

  return (
    <div className="cart-container">
      <div className="cart-list">
        <h2>Carrito de compra ({cart.length} productos)</h2>

        <div className="cart-select-all">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={e => toggleSelectAll(e.target.checked)}
          />
          <span>Seleccionar todo</span>

          <button
            className="delete-selected"
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0 || operatingId === 'bulk'}
            title="Eliminar seleccionados"
          >
            🗑️ Eliminar seleccionados
          </button>

          <button
            className="delete-selected"
            onClick={handleClearCart}
            disabled={cart.length === 0 || operatingId === 'clear'}
            title="Vaciar carrito"
          >
            🗑️ Vaciar carrito
          </button>
        </div>

        {loading && (
          <div className="cart-loading-overlay" aria-live="polite" aria-busy="true">
            <div className="cart-loader" role="status" aria-label="Cargando carrito">
              <span className="cart-spinner" aria-hidden="true" />
              <span className="cart-loader-text">Cargando carrito…</span>
            </div>
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && cart.length === 0 && <p>No tienes productos en el carrito.</p>}

        {cart.map(item => (
          
          <div className={`cart-item ${selectedIds.has(item.id) ? "selected" : ""}`} key={item.id}>
            <input
              type="checkbox"
              checked={selectedIds.has(item.id)}
              onChange={() => toggleSelect(item.id)}
            />
            <img src={item.imagen || "https://placehold.co/120x80?text=IMG"} alt={item.nombre} />

            <div className="cart-item-info">
              <div className="cart-item-title">{item.nombre}</div>
              <div className="cart-item-prices">
                <span className="original">
                  ${Number(item.precioOriginal).toLocaleString()}
                </span>
                <span className="price">
                  ${Number(item.precio).toLocaleString()}
                </span>
                {Number(item.descuento) > 0 && (
                  <span className="discount">{Number(item.descuento)}%OFF</span>
                )}
              </div>
            </div>

            <div className="cart-item-qty">
              <button
                onClick={() => handleQuantity(item.id, -1)}
                disabled={operatingId === item.id}
              >−</button>
              <span>{item.cantidad}</span>
              <button
                onClick={() => handleQuantity(item.id, 1)}
                disabled={operatingId === item.id || item.cantidad >= item.stock
                  
                  
                }
              >+</button>
              <small className="stock">
                Stock disponible: {item.stock}
              </small>
            </div>

            <button className="delete" onClick={() => handleDelete(item.id)} disabled={operatingId === item.id}>
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h3>Resumen del Pedido</h3>
        <div className="cart-total">
          <span>Total:</span>
          <span>${Number(total).toLocaleString()}</span>
        </div>
        <button className="cart-buy" disabled={selectedIds.size === 0} onClick={handleBuy}>
          Comprar
        </button>
        <p className="cart-privacy">
          No venderemos tu información personal por dinero y solo utilizamos tu información de acuerdo con nuestra política de privacidad y cookies para proporcionar y mejorar nuestros servicios.
        </p>
        <div className="cart-payments">
          <span>Métodos de Pago</span>
          <div>
            <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" width={40} />
            <img src="https://seeklogo.com/images/P/pse-logo-6B5B6B6B6B-seeklogo.com.png" alt="PSE" width={40} />
          </div>
        </div>
      </div>
    </div>
  );
}