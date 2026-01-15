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
          min={minPrice}
          max={maxPrice}
          step="0.1"
          value={currentMaxPrice}
          onChange={handlePriceChange}
          className="price-slider"
        />
        <div className="price-values">
          <span>Mín: ${minPrice}</span>
          <span>Máx: ${currentMaxPrice}</span>
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
