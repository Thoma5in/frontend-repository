import React from 'react';
import './HomeLeftPanel.css';

const HomeLeftPanel = ({
  minPrice,
  maxPrice,
  currentMaxPrice,
  onMaxPriceChange,
  minQuantity,
  maxQuantity,
  currentMaxQuantity,
  onMaxQuantityChange,
  sortOrder,
  onSortOrderChange,
}) => {

  const safeMinPrice = Number.isFinite(Number(minPrice)) ? Number(minPrice) : 0;
  const safeMaxPrice = Number.isFinite(Number(maxPrice)) ? Number(maxPrice) : 0;
  const sliderMinPrice = Math.floor(safeMinPrice);
  const sliderMaxPrice = Math.ceil(Math.max(safeMinPrice, safeMaxPrice));
  const sliderValuePrice = Math.min(Number(currentMaxPrice) || 0, sliderMaxPrice);

  const priceStep = (() => {
    const range = sliderMaxPrice - sliderMinPrice;
    if (!Number.isFinite(range) || range <= 0) return 1;
    // Aproximadamente 1000 pasos (evita saltos gigantes si el rango es grande)
    return Math.max(1, Math.round(range / 1000));
  })();

  const handlePriceChange = (event) => {
    onMaxPriceChange(Number(event.target.value));
  };

  const handleQuantityChange = (event) => {
    onMaxQuantityChange(Number(event.target.value));
  };

  return (
    <div className="home-left-panel">

      {/* Precio */}
      <h3 className="home-left-panel-title">Precio</h3>
      <div className="price-slider-container">
        <input
          type="range"
          min={sliderMinPrice}
          max={sliderMaxPrice}
          step={priceStep}
          value={sliderValuePrice}
          onChange={handlePriceChange}
          className="price-slider"
        />
        <div className="price-values">
          <span>Mín: ${sliderMinPrice.toLocaleString()}</span>
          <span>Máx: ${Number(sliderValuePrice).toLocaleString()}</span>
        </div>
      </div>

      {/* Cantidad */}
      <h3 className="home-left-panel-title">Cantidad de productos</h3>
      <div className="price-slider-container">
        <input
          type="range"
          min={minQuantity}
          max={maxQuantity}
          step="1"
          value={currentMaxQuantity}
          onChange={handleQuantityChange}
          className="price-slider"
        />
        <div className="price-values">
          <span>Mín: {minQuantity}</span>
          <span>Máx: {currentMaxQuantity}</span>
        </div>
      </div>

      {/* Orden */}
      <h3 className="home-left-panel-title">Ordenar</h3>
      <div className="sort-container">
        <button
          type="button"
          className={`sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
          onClick={() => onSortOrderChange('asc')}
        >
          Menor a mayor
        </button>
        <button
          type="button"
          className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
          onClick={() => onSortOrderChange('desc')}
        >
          Mayor a menor
        </button>
        <button
          type="button"
          className={`sort-button ${sortOrder === null ? 'active' : ''}`}
          onClick={() => onSortOrderChange(null)}
        >
          Predeterminado
        </button>
      </div>

    </div>
  );
};

export default HomeLeftPanel;
