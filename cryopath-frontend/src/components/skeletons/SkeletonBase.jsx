import './skeleton.css';

/**
 * SkeletonBlock — Bloque rectangular genérico.
 * @param {{ width?: string, height?: string, borderRadius?: string, className?: string, style?: object }} props
 */
export function SkeletonBlock({ width, height, borderRadius, className = '', style = {} }) {
  return (
    <div
      className={`skeleton skeleton-block ${className}`}
      aria-hidden="true"
      style={{ width, height, borderRadius, ...style }}
    />
  );
}

/**
 * SkeletonText — Renderiza N líneas de texto skeleton con anchos variados.
 * @param {{ lines?: number, widths?: string[], lineHeight?: string, className?: string }} props
 */
export function SkeletonText({ lines = 3, widths, lineHeight, className = '' }) {
  const defaultWidths = ['90%', '100%', '75%', '60%', '85%', '50%', '95%'];

  return (
    <div className={`skeleton-text-group ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, i) => {
        const w = widths?.[i] ?? defaultWidths[i % defaultWidths.length];
        return (
          <div
            key={i}
            className="skeleton skeleton-text"
            style={{ width: w, height: lineHeight }}
          />
        );
      })}
    </div>
  );
}

/**
 * SkeletonCircle — Círculo skeleton (para avatares, iconos).
 * @param {{ size?: string|number, className?: string }} props
 */
export function SkeletonCircle({ size = 48, className = '' }) {
  const s = typeof size === 'number' ? `${size}px` : size;
  return (
    <div
      className={`skeleton skeleton-circle ${className}`}
      aria-hidden="true"
      style={{ width: s, height: s }}
    />
  );
}

/**
 * SkeletonButton — Bloque skeleton con proporción de botón.
 * @param {{ width?: string, height?: string, pill?: boolean, className?: string }} props
 */
export function SkeletonButton({ width = '100%', height = '40px', pill = false, className = '' }) {
  return (
    <div
      className={`skeleton skeleton-button ${pill ? 'skeleton-button--pill' : ''} ${className}`}
      aria-hidden="true"
      style={{ width, height }}
    />
  );
}
