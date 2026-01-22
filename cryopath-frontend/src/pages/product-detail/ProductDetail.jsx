import DetalleProductoParte1 from '../../components/detalle-producto-parte1/DetalleProductoParte1'
import DetalleProductoParte3 from '../../components/detalle-producto-parte3/DetalleProductoParte3'
import DetalleProductoParte4 from '../../components/detalle-producto-parte4/DetalleProductoParte4'
import './ProductDetail.css'
import DetalleProductoParte2 from "../../components/detalle-producto-parte2/Detalle-producto-parte2.jsx"
import { productosRelacionados } from "../../components/detalle-producto-parte2/datos-ejemplo"

const ProductDetail = () => {
    return (
        <div>
            <DetalleProductoParte1 />
            

            <DetalleProductoParte2 productos={productosRelacionados} />
            <DetalleProductoParte3 />
            <DetalleProductoParte4 />
        </div>
    )
}

export default ProductDetail
