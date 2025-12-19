import React from 'react';
import './HomeLeftPanel.css';

const HomeLeftPanel = ({ minPrice, maxPrice, currentMaxPrice, onMaxPriceChange, sortOrder, onSortOrderChange }) => {
  const handleChange = (event) => {
    const value = Number(event.target.value);
    onMaxPriceChange(value);
  };

  return (
    <div className="home-left-panel">
      <h3 className="home-left-panel-title">Precio</h3>
      <div className="price-slider-container">
        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          step="1"
          value={currentMaxPrice}
          onChange={handleChange}
          className="price-slider"
        />
        <div className="price-values">
          <span>Mín: ${minPrice}</span>
          <span>Máx: ${currentMaxPrice}</span>
        </div>
      </div>

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
      </div>
    </div>
  );
};

export default HomeLeftPanel;
