import './skeleton.css';
import { SkeletonBlock, SkeletonText, SkeletonCircle, SkeletonButton } from './SkeletonBase';

/* ================================================================
   SkeletonProductCard
   Mirror de .product-card en Home.css
   ================================================================ */
export function SkeletonProductCard() {
  return (
    <div className="skeleton-product-card" aria-hidden="true">
      <div className="skeleton skeleton-product-card__image skeleton-block" />
      <SkeletonText lines={1} widths={['70%']} lineHeight="18px" />
      <SkeletonText lines={1} widths={['100%']} />
      <SkeletonText lines={1} widths={['45%']} />
      <SkeletonText lines={1} widths={['60%']} />
      <SkeletonText lines={1} widths={['35%']} lineHeight="16px" />
      <SkeletonButton width="100%" height="30px" />
      <div className="skeleton-product-card__actions">
        <div className="skeleton skeleton-button" />
        <div className="skeleton skeleton-button" />
      </div>
    </div>
  );
}

/* ================================================================
   SkeletonCartItem
   Mirror de .cart-item en Cart.css
   ================================================================ */
export function SkeletonCartItem() {
  return (
    <div className="skeleton-cart-item" aria-hidden="true">
      <div className="skeleton skeleton-cart-item__checkbox" />
      <div className="skeleton skeleton-cart-item__image skeleton-block" />
      <div className="skeleton-cart-item__info">
        <SkeletonText lines={1} widths={['80%']} lineHeight="15px" />
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <SkeletonBlock width="60px" height="14px" borderRadius="4px" />
          <SkeletonBlock width="70px" height="14px" borderRadius="4px" />
          <SkeletonBlock width="45px" height="14px" borderRadius="4px" />
        </div>
      </div>
      <div className="skeleton-cart-item__qty">
        <div className="skeleton skeleton-cart-item__qty-btn" />
        <div className="skeleton skeleton-cart-item__qty-num" />
        <div className="skeleton skeleton-cart-item__qty-btn" />
      </div>
      <div className="skeleton skeleton-cart-item__delete" />
    </div>
  );
}

/* ================================================================
   SkeletonCartSummary
   Mirror de .cart-summary en Cart.css
   ================================================================ */
export function SkeletonCartSummary() {
  return (
    <div className="skeleton-cart-summary" aria-hidden="true">
      <SkeletonText lines={1} widths={['60%']} lineHeight="18px" />
      <div className="skeleton-cart-summary__row">
        <SkeletonBlock width="50px" height="16px" borderRadius="4px" />
        <SkeletonBlock width="80px" height="16px" borderRadius="4px" />
      </div>
      <SkeletonButton width="100%" height="44px" pill />
      <SkeletonText lines={3} widths={['100%', '100%', '70%']} />
      <div className="skeleton-cart-summary__row">
        <SkeletonBlock width="40px" height="40px" borderRadius="6px" />
        <SkeletonBlock width="40px" height="40px" borderRadius="6px" />
      </div>
    </div>
  );
}

/* ================================================================
   SkeletonDetailProduct
   Mirror del layout en DetalleProductoParte1
   ================================================================ */
export function SkeletonDetailProduct() {
  return (
    <div className="product-detail-container" role="status" aria-busy="true" aria-label="Cargando producto">
      <div className="skeleton-detail">
        {/* Columna de imágenes */}
        <div className="skeleton-detail__images">
          <div className="skeleton skeleton-detail__main-image skeleton-block" />
          <div className="skeleton-detail__thumbnails">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="skeleton skeleton-detail__thumb skeleton-block" />
            ))}
          </div>
        </div>

        {/* Columna de info */}
        <div className="skeleton-detail__info">
          <SkeletonText lines={1} widths={['72%']} lineHeight="24px" />

          <div className="skeleton-detail__rating">
            <SkeletonBlock width="52px" height="12px" borderRadius="999px" />
            <SkeletonBlock width="120px" height="12px" borderRadius="999px" />
            <SkeletonBlock width="80px" height="12px" borderRadius="999px" />
          </div>

          <div className="skeleton-detail__pricing">
            <SkeletonBlock width="46%" height="28px" borderRadius="12px" />
            <SkeletonBlock width="92px" height="22px" borderRadius="999px" />
          </div>

          <div className="skeleton skeleton-detail__card">
            <SkeletonText lines={1} widths={['45%']} lineHeight="16px" />
            <SkeletonText lines={4} widths={['100%', '80%', '60%', '90%']} />
          </div>

          <div className="skeleton skeleton-detail__card skeleton-detail__card--seller">
            <SkeletonText lines={1} widths={['45%']} lineHeight="16px" />
            <SkeletonText lines={3} widths={['100%', '80%', '60%']} />
          </div>

          <div className="skeleton-detail__actions">
            <div className="skeleton skeleton-detail__shipping skeleton-block" />
            <div className="skeleton skeleton-detail__action-btn" />
            <div className="skeleton skeleton-detail__action-btn" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   SkeletonFormCard
   Para Login / Register
   @param {{ fields?: number, showDivider?: boolean }} props
   ================================================================ */
export function SkeletonFormCard({ fields = 2, showDivider = true }) {
  return (
    <div style={{ minHeight: 'calc(100vh - 120px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="skeleton-form-card" role="status" aria-busy="true" aria-label="Cargando formulario">
        {/* Logo */}
        <div className="skeleton skeleton-form-card__logo skeleton-block" />

        {/* Título + Subtítulo */}
        <SkeletonText lines={1} widths={['65%']} lineHeight="22px" />
        <SkeletonText lines={1} widths={['50%']} lineHeight="14px" />

        {/* Campos */}
        {Array.from({ length: fields }, (_, i) => (
          <div className="skeleton-form-card__field" key={i}>
            <div className="skeleton skeleton-form-card__label" />
            <div className="skeleton skeleton-form-card__input" />
          </div>
        ))}

        {/* Botón submit */}
        <div className="skeleton skeleton-form-card__submit" />

        {/* Divider */}
        {showDivider && <div className="skeleton-form-card__divider" />}

        {/* Footer */}
        <div className="skeleton skeleton-form-card__footer" />
      </div>
    </div>
  );
}

/* ================================================================
   SkeletonFilterPanel
   Mirror de HomeLeftPanel
   ================================================================ */
export function SkeletonFilterPanel() {
  return (
    <div className="skeleton-filter-panel home-left-panel" aria-hidden="true">
      {/* Precio */}
      <SkeletonText lines={1} widths={['40%']} lineHeight="18px" />
      <div className="skeleton skeleton-filter-panel__slider" />
      <div className="skeleton-filter-panel__values">
        <SkeletonBlock width="60px" height="14px" borderRadius="4px" />
        <SkeletonBlock width="60px" height="14px" borderRadius="4px" />
      </div>

      {/* Cantidad */}
      <SkeletonText lines={1} widths={['55%']} lineHeight="18px" />
      <div className="skeleton skeleton-filter-panel__slider" />
      <div className="skeleton-filter-panel__values">
        <SkeletonBlock width="40px" height="14px" borderRadius="4px" />
        <SkeletonBlock width="40px" height="14px" borderRadius="4px" />
      </div>

      {/* Ordenar */}
      <SkeletonText lines={1} widths={['35%']} lineHeight="18px" />
      <div className="skeleton-filter-panel__btn-group">
        <div className="skeleton skeleton-filter-panel__btn" />
        <div className="skeleton skeleton-filter-panel__btn" />
        <div className="skeleton skeleton-filter-panel__btn" />
      </div>
    </div>
  );
}

/* ================================================================
   SkeletonBanner
   Para hero / banners principales
   ================================================================ */
export function SkeletonBanner() {
  return (
    <div className="skeleton-banner" aria-hidden="true">
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <SkeletonText lines={1} widths={['50%']} lineHeight="28px" />
        <SkeletonText lines={1} widths={['70%']} lineHeight="14px" />
      </div>
    </div>
  );
}

/* ================================================================
   SkeletonProductGrid
   Grilla de N product cards skeleton
   @param {{ count?: number }} props
   ================================================================ */
export function SkeletonProductGrid({ count = 9 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonProductCard key={`skel-product-${i}`} />
      ))}
    </>
  );
}
