import DetalleProductoParte4 from '../../components/detalle-producto-parte4/DetalleProductoParte4'
import DetalleProductoParte1 from '../../components/detalle-producto-parte1/DetalleProductoParte1'
import './ProductDetail.css'
import DetalleProductoParte2 from "../../components/detalle-producto-parte2/detalle-producto-parte2.jsx"
import { productosRelacionados } from "../../components/detalle-producto-parte2/datos-ejemplo"

const ProductDetail = () => {
    return (
        <div>
            <DetalleProductoParte1 />
            <DetalleProductoParte4 />

            <DetalleProductoParte2 productos={productosRelacionados} />
        </div>
    )
}

export default ProductDetail
