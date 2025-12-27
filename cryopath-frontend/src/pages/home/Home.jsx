import React, { useState } from 'react';
import './Home.css';
import Pagination from '../../components/Pagination';
import HomeLeftPanel from '../../components/HomeLeftPanel';


export default function Home() {
    const products = [
        { id: 1, name: 'Producto 1', description: 'Descripción breve del producto 1.', price: '$29.99', image: 'https://via.placeholder.com/300x80?text=Producto+1' },
        { id: 2, name: 'Producto 2', description: 'Descripción breve del producto 2.', price: '$39.99', image: 'https://via.placeholder.com/300x80?text=Producto+2' },
        { id: 3, name: 'Producto 3', description: 'Descripción breve del producto 3.', price: '$49.99', image: 'https://via.placeholder.com/300x80?text=Producto+3' },
        { id: 4, name: 'Producto 4', description: 'Descripción breve del producto 4.', price: '$59.99', image: 'https://via.placeholder.com/300x80?text=Producto+4' },
        { id: 5, name: 'Producto 5', description: 'Descripción breve del producto 5.', price: '$69.99', image: 'https://via.placeholder.com/300x80?text=Producto+5' },
        { id: 6, name: 'Producto 6', description: 'Descripción breve del producto 6.', price: '$79.99', image: 'https://via.placeholder.com/300x80?text=Producto+6' },
        { id: 7, name: 'Producto 7', description: 'Descripción breve del producto 7.', price: '$89.99', image: 'https://via.placeholder.com/300x80?text=Producto+7' },
        { id: 8, name: 'Producto 8', description: 'Descripción breve del producto 8.', price: '$99.99', image: 'https://via.placeholder.com/300x80?text=Producto+8' },
        { id: 9, name: 'Producto 9', description: 'Descripción breve del producto 9.', price: '$109.99', image: 'https://via.placeholder.com/300x80?text=Producto+9' },
        { id: 10, name: 'Producto 10', description: 'Descripción breve del producto 10.', price: '$119.99', image: 'https://via.placeholder.com/300x80?text=Producto+10' },
        { id: 11, name: 'Producto 11', description: 'Descripción breve del producto 11.', price: '$129.99', image: 'https://via.placeholder.com/300x80?text=Producto+11' },
        { id: 12, name: 'Producto 12', description: 'Descripción breve del producto 12.', price: '$139.99', image: 'https://via.placeholder.com/300x80?text=Producto+12' },
        { id: 13, name: 'Producto 13', description: 'Descripción breve del producto 13.', price: '$149.99', image: 'https://via.placeholder.com/300x80?text=Producto+13' },
        { id: 14, name: 'Producto 14', description: 'Descripción breve del producto 14.', price: '$159.99', image: 'https://via.placeholder.com/300x80?text=Producto+14' },
        { id: 15, name: 'Producto 15', description: 'Descripción breve del producto 15.', price: '$169.99', image: 'https://via.placeholder.com/300x80?text=Producto+15' },
        { id: 16, name: 'Producto 16', description: 'Descripción breve del producto 16.', price: '$179.99', image: 'https://via.placeholder.com/300x80?text=Producto+16' },
        { id: 17, name: 'Producto 17', description: 'Descripción breve del producto 17.', price: '$189.99', image: 'https://via.placeholder.com/300x80?text=Producto+17' },
        { id: 18, name: 'Producto 18', description: 'Descripción breve del producto 18.', price: '$199.99', image: 'https://via.placeholder.com/300x80?text=Producto+18' },
        { id: 19, name: 'Producto 19', description: 'Descripción breve del producto 19.', price: '$209.99', image: 'https://via.placeholder.com/300x80?text=Producto+19' },
        { id: 20, name: 'Producto 20', description: 'Descripción breve del producto 20.', price: '$219.99', image: 'https://via.placeholder.com/300x80?text=Producto+20' },
        { id: 21, name: 'Producto 21', description: 'Descripción breve del producto 21.', price: '$229.99', image: 'https://via.placeholder.com/300x80?text=Producto+21' },
        { id: 22, name: 'Producto 22', description: 'Descripción breve del producto 22.', price: '$239.99', image: 'https://via.placeholder.com/300x80?text=Producto+22' },
        { id: 23, name: 'Producto 23', description: 'Descripción breve del producto 23.', price: '$249.99', image: 'https://via.placeholder.com/300x80?text=Producto+23' },
        { id: 24, name: 'Producto 24', description: 'Descripción breve del producto 24.', price: '$259.99', image: 'https://via.placeholder.com/300x80?text=Producto+24' },
        { id: 25, name: 'Producto 25', description: 'Descripción breve del producto 25.', price: '$269.99', image: 'https://via.placeholder.com/300x80?text=Producto+25' },
        { id: 26, name: 'Producto 26', description: 'Descripción breve del producto 26.', price: '$279.99', image: 'https://via.placeholder.com/300x80?text=Producto+26' },
        { id: 27, name: 'Producto 27', description: 'Descripción breve del producto 27.', price: '$289.99', image: 'https://via.placeholder.com/300x80?text=Producto+27' },
        { id: 28, name: 'Producto 28', description: 'Descripción breve del producto 28.', price: '$299.99', image: 'https://via.placeholder.com/300x80?text=Producto+28' },
        { id: 29, name: 'Producto 29', description: 'Descripción breve del producto 29.', price: '$309.99', image: 'https://via.placeholder.com/300x80?text=Producto+29' },
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