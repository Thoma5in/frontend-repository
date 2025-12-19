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
    ];
    const pageSize = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(products.length / pageSize) || 1;

    const startIndex = (currentPage - 1) * pageSize;
    const currentProducts = products.slice(startIndex, startIndex + pageSize);

    const handlePrev = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNext = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };


    return (
        <div className="home-background">
            <HomeLeftPanel />

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