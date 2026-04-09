import { useMemo, useState } from 'react';
import { parsePrice } from '../utils/formatters';

const DEFAULT_PAGE_SIZE = 9;

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
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);

  const effectiveMaxPriceFilter = useMemo(() => {
    if (!Number.isFinite(maxPrice) || maxPrice <= 0) return 0;
    if (!Number.isFinite(maxPriceFilter) || maxPriceFilter <= 0) return maxPrice;
    return Math.min(maxPriceFilter, maxPrice);
  }, [maxPrice, maxPriceFilter]);

  const effectiveMaxQuantityFilter = useMemo(() => {
    if (!hasInventory || !Number.isFinite(maxQuantity) || maxQuantity <= 0) return 0;
    if (!Number.isFinite(maxQuantityFilter) || maxQuantityFilter <= 0) return maxQuantity;
    return Math.min(maxQuantityFilter, maxQuantity);
  }, [hasInventory, maxQuantity, maxQuantityFilter]);

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
        return priceValue <= effectiveMaxPriceFilter;
      })
      .filter((product) => {
        if (!hasInventory) return true;
        const stock = Number(inventarioMap?.[product?.id_producto]);
        if (!Number.isFinite(stock)) return true;
        return stock <= effectiveMaxQuantityFilter;
      })
      .filter((product) => {
        if (!onlyAvailable || !hasInventory) return true;
        const stock = Number(inventarioMap?.[product?.id_producto]);
        return Number.isFinite(stock) && stock > 0;
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
    effectiveMaxPriceFilter,
    hasInventory,
    inventarioMap,
    effectiveMaxQuantityFilter,
    onlyAvailable,
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

  const handleOnlyAvailableChange = (value) => {
    setOnlyAvailable(Boolean(value));
    setCurrentPage(1);
  };

  const skeletonItems = useMemo(() => Array.from({ length: pageSize }, (_, index) => index), [pageSize]);

  return {
    minPrice,
    maxPrice,
    minQuantity,
    maxQuantity,
    maxPriceFilter: effectiveMaxPriceFilter,
    maxQuantityFilter: effectiveMaxQuantityFilter,
    onlyAvailable,
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
    handleOnlyAvailableChange,
    handleSortOrderChange,
  };
}
