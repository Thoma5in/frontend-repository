import DetalleProductoParte4 from '../../components/detalle-producto-parte4/DetalleProductoParte4'
import DetalleProductoParte1 from '../../components/detalle-producto-parte1/DetalleProductoParte1'
import './ProductDetail.css'
import DetalleProductoParte2 from "../../components/detalle-producto-parte2/detalle-producto-parte2.jsx"

const ProductDetail = () => {
    // Datos de ejemplo para los productos relacionados
    const productosRelacionados = [
        {
            marca: 'Finlandek',
            nombre: 'Televisor Finlandek 45 Pulgadas',
            precioOriginal: 1499900,
            precioActual: 1349900,
            descuento: 27
        },
        {
            marca: 'Finlandek',
            nombre: 'Televisor Finlandek 45 Pulgadas',
            precioOriginal: 1499900,
            precioActual: 1349900,
            descuento: 27
        },
        {
            marca: 'Samsung',
            nombre: 'Smart TV Samsung 50 Pulgadas 4K UHD',
            precioOriginal: 2199900,
            precioActual: 1799900,
            descuento: 18
        },
        {
            marca: 'LG',
            nombre: 'Televisor LG NanoCell 55 Pulgadas',
            precioOriginal: 2899900,
            precioActual: 2399900,
            descuento: 17
        }
    ];

    return (
        <div>
            <DetalleProductoParte1 />            
            <DetalleProductoParte4 />
            <h1>Product Detail</h1>
            <DetalleProductoParte2 productos={productosRelacionados} />
        </div>
    )
}

export default ProductDetail
