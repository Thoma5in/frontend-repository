import DetalleProductoParte1 from '../../components/detalle-producto-parte1/DetalleProductoParte1'
import DetalleProductoParte3 from '../../components/detalle-producto-parte3/DetalleProductoParte3'
import DetalleProductoParte4 from '../../components/detalle-producto-parte4/DetalleProductoParte4'
import './ProductDetail.css'
import { useParams } from 'react-router-dom'
import DetalleProductoParte2 from "../../components/detalle-producto-parte2/Detalle-producto-parte2.jsx"
import { productosRelacionados } from "../../components/detalle-producto-parte2/datos-ejemplo"
import DetalleProductoParte5 from '../../components/detalle-producto-parte5/DetalleProductoParte5'

const ProductDetail = () => {
    const {id} = useParams();
    const idProducto = Number(id);
    return (
        <div>
            <DetalleProductoParte1 />
            <DetalleProductoParte2 productos={productosRelacionados} />
            <DetalleProductoParte3 />
            <DetalleProductoParte4 idProducto={idProducto} />
            <DetalleProductoParte5 />
        </div>
    )
}

export default ProductDetail
