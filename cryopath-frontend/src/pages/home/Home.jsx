import React, { useState } from 'react';
import './Home.css';
import Pagination from '../../components/Pagination';
import HomeLeftPanel from '../../components/HomeLeftPanel';


export default function Home() {
    const products = [
        { id: 30, name: 'Producto 30', description: 'Descripción breve del producto 30.', price: '$319.99', image: 'https://via.placeholder.com/300x80?text=Producto+30' },
        ];
    // obtenemos precios mínimos y máximos para el slider
    const numericPrices = products.map((p) => parseFloat(p.price.replace('$', '')));
    const minPrice = Math.min(...numericPrices);
    const maxPrice = Math.max(...numericPrices);

    const pageSize = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPriceFilter, setMaxPriceFilter] = useState(maxPrice);
    const [sortOrder, setSortOrder] = useState('asc');

    const filteredAndSortedProducts = products
        .filter((product) => {
            const priceValue = parseFloat(product.price.replace('$', ''));
            return priceValue <= maxPriceFilter;
        })
        .sort((a, b) => {
            const priceA = parseFloat(a.price.replace('$', ''));
            const priceB = parseFloat(b.price.replace('$', ''));
            return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
        });

    const totalPages = Math.ceil(filteredAndSortedProducts.length / pageSize) || 1;

    const startIndex = (currentPage - 1) * pageSize;
    const currentProducts = filteredAndSortedProducts.slice(startIndex, startIndex + pageSize);

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    const handleMaxPriceChange = (value) => {
        setMaxPriceFilter(value);
        setCurrentPage(1);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        setCurrentPage(1);
    };


    return (
        <div className="home-background">
            <HomeLeftPanel
                minPrice={minPrice}
                maxPrice={maxPrice}
                currentMaxPrice={maxPriceFilter}
                onMaxPriceChange={handleMaxPriceChange}
                sortOrder={sortOrder}
                onSortOrderChange={handleSortOrderChange}
            />

            <div className="home-products">
                {currentProducts.map((product) => (
                    <div className="product-card" key={product.id}>
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Precio: {product.price}</p>
                        <button className="details-button">Ver más detalles</button>
                        <button className="buy-button">Comprar</button>
                        <button className="cart-button">Añadir al carrito</button>
                    </div>
                ))}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>
        </div>
    );
}