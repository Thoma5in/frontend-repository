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
