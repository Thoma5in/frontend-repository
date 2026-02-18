import './Home.css';
import Pagination from '../../components/Pagination';
import HomeLeftPanel from '../../components/HomeLeftPanel';
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ChatList from "../chat-list/ChatList.jsx";

import useToast from '../../hooks/useToast';
import useHomeProductsData from '../../hooks/useHomeProductsData';
import useProductListing, { truncateWords } from '../../hooks/useProductListing';
import useCartActions from '../../hooks/useCartActions';

export default function Home({ idSupercategoria = null }) {
    const { session, profile, isAuthenticated, refreshCartCount } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const { toast, showToast } = useToast({ durationMs: 2600 });

    const {
        products,
        loading,
        error,
        imageUrls,
        categoriasPorProducto,
        inventarioMap,
    } = useHomeProductsData({
        idSupercategoria,
        token: session?.access_token,
        productsLimit: 1000,
    });

    const getCategoriaIdFromUrl = () => {
        try {
            const searchId = new URLSearchParams(location.search).get('categoria');
            if (searchId != null && searchId !== '') {
                const n = Number(searchId);
                return Number.isFinite(n) ? n : null;
            }

            const match = String(location.pathname || '').match(/^\/categoria\/(\d+)(?:\/|$)/);
            if (match?.[1]) {
                const n = Number(match[1]);
                return Number.isFinite(n) ? n : null;
            }
        } catch {
            // ignore
        }
        return null;
    };

    const selectedCategoriaId = getCategoriaIdFromUrl();
    const isCategoriaFilterActive = selectedCategoriaId !== null;

    const categoryMetaLoading = isCategoriaFilterActive &&
        products.some((p) => {
            const id = p?.id_producto;
            return id != null && categoriasPorProducto[id] === undefined;
        });

    const {
        minPrice,
        maxPrice,
        minQuantity,
        maxQuantity,
        maxPriceFilter,
        maxQuantityFilter,
        sortOrder,
        currentPage,
        totalPages,
        currentProducts,
        skeletonItems,
        handlePrev,
        handleNext,
        handleMaxPriceChange,
        handleMaxQuantityChange,
        handleSortOrderChange,
    } = useProductListing({
        products,
        inventarioMap,
        categoriasPorProducto,
        selectedCategoriaId,
        pageSize: 9,
        initialSortOrder: 'asc',
    });

    const { addToCart, addingToCart } = useCartActions({
        session,
        profile,
        isAuthenticated,
        inventarioMap,
        refreshCartCount,
        navigate,
        showToast,
    });

    return (
        <div className="home-background">
            <HomeLeftPanel
                minPrice={minPrice}
                maxPrice={maxPrice}
                currentMaxPrice={maxPriceFilter}
                onMaxPriceChange={handleMaxPriceChange}
                minQuantity={minQuantity}
                maxQuantity={maxQuantity}
                currentMaxQuantity={maxQuantityFilter}
                onMaxQuantityChange={handleMaxQuantityChange}
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
            />

            <div className="home-products">
                {loading ? (
                    skeletonItems.map((index) => (
                        <div
                            className="product-card product-card--skeleton"
                            key={`skeleton-${index}`}
                            aria-hidden="true"
                        >
                            <div className="product-image skeleton-block" />
                            <div className="skeleton-line skeleton-line--title" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line skeleton-line--short" />
                            <div className="skeleton-line skeleton-line--medium" />
                            <div className="skeleton-line skeleton-line--price" />
                            <div className="skeleton-button skeleton-button--full" />
                            <div className="skeleton-actions-row">
                                <div className="skeleton-button" />
                                <div className="skeleton-button" />
                            </div>
                        </div>
                    ))
                ) : error ? (
                    <p style={{ color: 'red', textAlign: 'center', width: '100%' }}>{error}</p>
                ) : categoryMetaLoading ? (
                    skeletonItems.map((index) => (
                        <div
                            className="product-card product-card--skeleton"
                            key={`skeleton-category-${index}`}
                            aria-hidden="true"
                        >
                            <div className="product-image skeleton-block" />
                            <div className="skeleton-line skeleton-line--title" />
                            <div className="skeleton-line" />
                            <div className="skeleton-line skeleton-line--short" />
                            <div className="skeleton-line skeleton-line--medium" />
                            <div className="skeleton-line skeleton-line--price" />
                            <div className="skeleton-button skeleton-button--full" />
                            <div className="skeleton-actions-row">
                                <div className="skeleton-button" />
                                <div className="skeleton-button" />
                            </div>
                        </div>
                    ))
                ) : currentProducts.length === 0 ? (
                    <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>No se encontraron productos.</p>
                ) : (
                    currentProducts.map((product) => {

                        const stock = inventarioMap[product.id_producto] ?? 0;
                        const sinStock = stock <= 0;

                        const servicioImageUrl = product.id_producto
                            ? imageUrls[product.id_producto]
                            : null;

                        return (
                            <div className="product-card" key={product.id_producto}>
                                <div className="product-image">
                                    {(() => {
                                        const imagenRelacionada = Array.isArray(product.producto_imagen)
                                            ? product.producto_imagen[0]
                                            : null;

                                        const fallbackImageUrl =
                                            imagenRelacionada?.url ||
                                            imagenRelacionada?.url_imagen ||
                                            product.imagen_url ||
                                            product.imagen?.url ||
                                            product.imagen?.secure_url ||
                                            product.imagen;

                                        const imageUrl =
                                            servicioImageUrl || fallbackImageUrl;

                                        return (
                                            <img
                                                src={imageUrl || "https://placehold.co/300x200?text=No+Image"}
                                                alt={product.nombre}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://placehold.co/300x200?text=Sin+Imagen";
                                                }}
                                            />
                                        );
                                    })()}
                                </div>
                                <h2>{product.nombre}</h2>
                                {categoriasPorProducto[product.id_producto]?.nombre && (
                                    <p style={{ marginTop: "-6px", marginBottom: "10px", color: "#6b7280" }}>
                                        {categoriasPorProducto[product.id_producto].nombre}
                                    </p>
                                )}
                                <p>{truncateWords(product.descripcion)}</p>
                                <p>
                                    Cantidad disponible: {" "}
                                    <strong style={{ color: sinStock ? "red" : "green" }}>{stock}</strong>
                                </p>

                                <p>Precio: ${typeof product.precio_base === 'number' ? product.precio_base.toFixed(2) : product.precio_base}</p>
                                <button className="details-button" onClick={() => navigate(`/product-details/${product.id_producto}`)}>Ver más detalles</button>
                                <div className="product-actions-row">
                                    <button className="buy-button">Comprar</button>
                                    <button
                                        className="cart-button"
                                        onClick={() => addToCart(product)}
                                        disabled={addingToCart || sinStock}
                                        title={sinStock ? "Sin stock" : "Añadir al carrito"}
                                    >
                                        Añadir al carrito
                                    </button>

                                </div>
                            </div>
                        );
                    })
                )}

                {!loading && !error && currentProducts.length > 0 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                )}
            </div>

            {isAuthenticated && (
                <ChatList />
            )}

            {toast && (
                <div
                    className={`home-toast home-toast--${toast.type}`}
                    role="status"
                    aria-live="polite"
                >
                    <span className="home-toast__icon" aria-hidden="true">
                        {toast.type === 'success' ? '✓' : '⚠'}
                    </span>
                    <span className="home-toast__text">{toast.message}</span>
                </div>
            )}
        </div>
    );
}