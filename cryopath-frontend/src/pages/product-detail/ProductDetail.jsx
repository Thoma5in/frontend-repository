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
                console.log('🔍 Cargando productos relacionados para idProducto:', idProducto)
                const data = await obtenerProductosRelacionadosRequest(idProducto, { limit: 10 })
                console.log('📦 Respuesta de productos relacionados:', data)
                if (!mounted) return
                
                // La API ya devuelve un array normalizado
                const productos = Array.isArray(data) ? data : []
                console.log('✅ Productos a mostrar:', productos)
                
                // Normalizar al formato esperado por el componente
                const normalized = productos.map(p => ({
                    id: p.id_producto,
                    nombre: p.nombre,
                    precioActual: p.precio_base ?? p.precioActual ?? null,
                    precioOriginal: p.precio_base ?? p.precioOriginal ?? null,
                    descuento: p.descuento ?? null,
                    marca: p.marca ?? '',
                    imagen: p.imagen ?? null,
                }))
                console.log('🎯 Productos normalizados:', normalized)
                setRecomendados(normalized)
            } catch (e) {
                console.error('❌ Error cargando productos relacionados:', e)
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
