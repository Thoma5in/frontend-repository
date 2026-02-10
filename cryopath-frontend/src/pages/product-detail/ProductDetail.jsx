import DetalleProductoParte1 from '../../components/detalle-producto-parte1/DetalleProductoParte1'
import DetalleProductoParte3 from '../../components/detalle-producto-parte3/DetalleProductoParte3'
import DetalleProductoParte4 from '../../components/detalle-producto-parte4/DetalleProductoParte4'
import './ProductDetail.css'
import { useParams } from 'react-router-dom'
import DetalleProductoParte2 from "../../components/detalle-producto-parte2/Detalle-producto-parte2.jsx"
import { useEffect, useState } from 'react'
import { obtenerProductosRelacionadosRequest } from '../../services/productosApi.js'
import DetalleProductoParte5 from '../../components/detalle-producto-parte5/DetalleProductoParte5'

const ProductDetail = () => {
    const {id} = useParams();
    const idProducto = Number(id);

    const [recomendados, setRecomendados] = useState([])
    const [loadingRec, setLoadingRec] = useState(false)

    useEffect(() => {
        let mounted = true
        async function load() {
            try {
                setLoadingRec(true)
                const data = await obtenerProductosRelacionadosRequest(idProducto, { limit: 10 })
                if (!mounted) return
                // Normalizar al formato esperado por el componente
                const normalized = (Array.isArray(data) ? data : []).map(p => ({
                    nombre: p.nombre,
                    precioActual: p.precio_base ?? p.precio ?? null,
                    precioOriginal: p.precio_base ?? p.precio ?? null,
                    descuento: null,
                    marca: p.marca ?? 'Marca',
                    imagen: p.imagen ?? (Array.isArray(p.imagenes) ? p.imagenes[0] : null),
                }))
                setRecomendados(normalized)
            } catch (e) {
                setRecomendados([])
            } finally {
                if (mounted) setLoadingRec(false)
            }
        }
        if (idProducto) load()
        return () => { mounted = false }
    }, [idProducto])

    return (
        <div>
            <DetalleProductoParte1 />
            <DetalleProductoParte2 productos={recomendados} loading={loadingRec} />
            <DetalleProductoParte3 />
            <DetalleProductoParte4 idProducto={idProducto} />
            <DetalleProductoParte5 />
        </div>
    )
}

export default ProductDetail
