const DEFAULT_LOCALE = 'es-ES';
const DEFAULT_CURRENCY = import.meta.env.VITE_CURRENCY || 'USD';

const percentFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const currencyFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  style: 'currency',
  currency: DEFAULT_CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

const decimalFormatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export const formatDateEs = (fecha) => {
  if (!fecha) return '-';
  const parsed = new Date(fecha);
  if (Number.isNaN(parsed.getTime())) return '-';
  return parsed.toLocaleDateString(DEFAULT_LOCALE, {
    year: 'numeric',
    month: 'short',
    day: '2-digit'
  });
};

export const formatDiscountValue = (tipoDescuento, valorDescuento) => {
  const parsed = Number(valorDescuento);
  if (!Number.isFinite(parsed)) return '-';
  const isPercent = typeof tipoDescuento === 'string' && /porcent|%/i.test(tipoDescuento);
  if (isPercent) {
    return percentFormatter.format(parsed / 100);
  }
  try {
    return currencyFormatter.format(parsed);
  } catch (error) {
    return decimalFormatter.format(parsed);
  }
};

/**
 * Convierte un valor de precio (número, string, etc) a número decimal
 * Maneja múltiples formatos: "1.234,56" (EU), "1,234.56" (US), "1234.56", etc
 * @param {number|string|null|undefined} raw - Valor a convertir
 * @returns {number|null} Número decimal o null si no es válido
 */
export function parsePrice(raw) {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }

  if (raw == null) return null;

  if (typeof raw === 'string') {
    const cleaned = raw.trim().replace(/[^0-9.,-]/g, '');
    if (!cleaned) return null;

    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');

    let normalized = cleaned;
    if (lastDot !== -1 && lastComma !== -1) {
      if (lastComma > lastDot) {
        normalized = cleaned.replace(/\./g, '').replace(',', '.');
      } else {
        normalized = cleaned.replace(/,/g, '');
      }
    } else if (lastComma !== -1) {
      normalized = cleaned.replace(',', '.');
    }

    const n = Number.parseFloat(normalized);
    return Number.isFinite(n) ? n : null;
  }

  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Trunca un texto a un número máximo de palabras
 * @param {string} text - Texto a truncar
 * @param {number} limit - Número máximo de palabras (default: 20)
 * @returns {string} Texto truncado con "..." al final si fue necesario
 */
export function truncateWords(text, limit = 20) {
  if (text === null || text === undefined) return '';
  const normalized = String(text).trim().replace(/\s+/g, ' ');
  if (!normalized) return '';

  const words = normalized.split(' ');
  if (words.length <= limit) return normalized;
  return `${words.slice(0, limit).join(' ')}...`;
}

/**
 * Formatea un valor numérico como precio en Pesos Colombianos (COP).
 * Usa separador de miles con punto (ej: 2000 → "$ 2.000").
 * @param {number|string|null|undefined} value - Valor a formatear
 * @returns {string} Precio formateado en COP
 */
const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatCOP(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return '$ 0';
  return copFormatter.format(num);
}
