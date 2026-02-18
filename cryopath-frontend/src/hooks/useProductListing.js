import { useEffect, useMemo, useState } from 'react';

const DEFAULT_PAGE_SIZE = 9;

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

export function truncateWords(text, limit = 20) {
  if (text === null || text === undefined) return '';
  const normalized = String(text).trim().replace(/\s+/g, ' ');
  if (!normalized) return '';

  const words = normalized.split(' ');
  if (words.length <= limit) return normalized;
  return `${words.slice(0, limit).join(' ')}...`;
}

export default function useProductListing({
  products,
  inventarioMap,
  categoriasPorProducto,
  selectedCategoriaId,
  pageSize = DEFAULT_PAGE_SIZE,
  initialSortOrder = 'asc',
} = {}) {
  const isCategoriaFilterActive = selectedCategoriaId !== null && selectedCategoriaId !== undefined;

  const hasInventory = useMemo(() => Object.keys(inventarioMap || {}).length > 0, [inventarioMap]);

  const numericPrices = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products
      .map((p) => parsePrice(p?.precio_base))
      .filter((p) => typeof p === 'number');
  }, [products]);

  const minPrice = useMemo(() => (numericPrices.length > 0 ? Math.min(...numericPrices) : 0), [numericPrices]);
  const maxPrice = useMemo(() => (numericPrices.length > 0 ? Math.max(...numericPrices) : 0), [numericPrices]);

  const numericQuantities = useMemo(() => {
    if (!hasInventory) return [];
    return Object.values(inventarioMap || {})
      .map((q) => Number(q))
      .filter((q) => Number.isFinite(q) && q >= 0);
  }, [inventarioMap, hasInventory]);

  const minQuantity = useMemo(() => (numericQuantities.length > 0 ? Math.min(...numericQuantities) : 0), [numericQuantities]);
  const maxQuantity = useMemo(() => (numericQuantities.length > 0 ? Math.max(...numericQuantities) : 0), [numericQuantities]);

  const [currentPage, setCurrentPage] = useState(1);
  const [maxPriceFilter, setMaxPriceFilter] = useState(maxPrice || 0);
  const [maxQuantityFilter, setMaxQuantityFilter] = useState(maxQuantity || 0);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  useEffect(() => {
    if (maxPrice <= 0) return;
    setMaxPriceFilter((prev) => {
      if (!Number.isFinite(prev) || prev <= 0) return maxPrice;
      return Math.min(prev, maxPrice);
    });
  }, [maxPrice]);

  useEffect(() => {
    if (!hasInventory || maxQuantity <= 0) return;
    setMaxQuantityFilter((prev) => {
      if (!Number.isFinite(prev) || prev <= 0) return maxQuantity;
      return Math.min(prev, maxQuantity);
    });
  }, [hasInventory, maxQuantity]);

  const filteredAndSortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    return products
      .filter((product) => {
        if (!isCategoriaFilterActive) return true;
        const info = categoriasPorProducto?.[product?.id_producto];
        if (info === undefined) return false;
        return Number(info?.id) === Number(selectedCategoriaId);
      })
      .filter((product) => {
        const priceValue = parsePrice(product?.precio_base);
        if (typeof priceValue !== 'number') return true;
        return priceValue <= maxPriceFilter;
      })
      .filter((product) => {
        if (!hasInventory) return true;
        const stock = Number(inventarioMap?.[product?.id_producto]);
        if (!Number.isFinite(stock)) return true;
        return stock <= maxQuantityFilter;
      })
      .sort((a, b) => {
        const priceA = parsePrice(a?.precio_base) ?? 0;
        const priceB = parsePrice(b?.precio_base) ?? 0;
        return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
      });
  }, [
    products,
    isCategoriaFilterActive,
    categoriasPorProducto,
    selectedCategoriaId,
    maxPriceFilter,
    hasInventory,
    inventarioMap,
    maxQuantityFilter,
    sortOrder,
  ]);

  const totalPages = useMemo(() => Math.ceil(filteredAndSortedProducts.length / pageSize) || 1, [filteredAndSortedProducts.length, pageSize]);

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedProducts.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedProducts, currentPage, pageSize]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  const handleMaxPriceChange = (value) => {
    setMaxPriceFilter(value);
    setCurrentPage(1);
  };

  const handleMaxQuantityChange = (value) => {
    setMaxQuantityFilter(value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  const skeletonItems = useMemo(() => Array.from({ length: pageSize }, (_, index) => index), [pageSize]);

  return {
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
    filteredAndSortedProducts,
    hasInventory,
    skeletonItems,
    setCurrentPage,
    handlePrev,
    handleNext,
    handleMaxPriceChange,
    handleMaxQuantityChange,
    handleSortOrderChange,
  };
}
