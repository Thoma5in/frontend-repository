import { useEffect, useMemo, useState } from 'react';
import './VendedorProducto.css';
import { useAuth } from '../../context/AuthContext';
import { obtenerImagenesProductoRequest, obtenerProductosRequest } from '../../services/productosApi';

const VendedorProducto = ({ onNavigate }) => {
	const { profile, user, session } = useAuth();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [imageMap, setImageMap] = useState({});

	const userId = profile?.id || user?.id || '';
	const token = session?.access_token;
	const quickActions = useMemo(
		() => [
			{ label: 'Nuevo Producto', icon: '+', tone: 'blue' },
			{ label: 'Crear Oferta', icon: '🏷️', tone: 'orange' },
			{ label: 'pa despues', icon: '+', tone: 'blue' },
			{ label: 'pa despues', icon: '+', tone: 'blue' },
		],
		[]
	);

	useEffect(() => {
		let mounted = true;
		const loadProducts = async () => {
			if (!userId) {
				setProducts([]);
				return;
			}
			setLoading(true);
			setErrorMessage('');
			try {
				const payload = await obtenerProductosRequest(token);
				const maybeList = payload?.productos ?? payload?.data ?? payload;
				const list = Array.isArray(maybeList) ? maybeList : [];
				const filtered = list.filter((item) => String(item?.id_usuario) === String(userId));
				if (!mounted) return;
				setProducts(filtered);
			} catch (error) {
				if (!mounted) return;
				setErrorMessage(error?.message || 'No se pudieron cargar los productos.');
				setProducts([]);
			} finally {
				if (!mounted) return;
				setLoading(false);
			}
		};

		loadProducts();
		return () => {
			mounted = false;
		};
	}, [token, userId]);

	useEffect(() => {
		let mounted = true;
		const loadImages = async () => {
			if (products.length === 0) {
				setImageMap({});
				return;
			}
			const entries = await Promise.all(
				products.map(async (item) => {
					const productId = item?.id_producto ?? item?.id;
					if (!productId) return [productId, []];
					try {
						const images = await obtenerImagenesProductoRequest(productId, token);
						const urls = (Array.isArray(images) ? images : [])
							.map((image) => image?.url ?? image?.imagen_url ?? image?.path ?? image)
							.filter((value) => typeof value === 'string' && value.length > 0);
						return [productId, urls];
					} catch (error) {
						return [productId, []];
					}
				})
			);

			if (!mounted) return;
			setImageMap(Object.fromEntries(entries));
		};

		loadImages();
		return () => {
			mounted = false;
		};
	}, [products, token]);

	const statusClass = (estado) => {
		const normalized = String(estado || '').toLowerCase();
		if (normalized.includes('activo')) return 'vp-pill vp-pill--ok';
		if (normalized.includes('inactivo')) return 'vp-pill vp-pill--warn';
		return 'vp-pill';
	};

	const actionIconClass = (tone) => {
		if (tone === 'orange') return 'vp-action__icon vp-action__icon--orange';
		return 'vp-action__icon';
	};

	const handleActionClick = (label) => {
		if (!onNavigate) return;
		if (label === 'Nuevo Producto') {
			onNavigate('nuevo-producto');
			return;
		}
		if (label === 'Crear Oferta') {
			onNavigate('descuentos');
		}
	};

	const formatCurrency = (value) => {
		const numeric = Number(value);
		if (!Number.isFinite(numeric)) return '-';
		return new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			maximumFractionDigits: 2,
		}).format(numeric);
	};

	const formatEstado = (item) => {
		if (typeof item?.estado === 'string') return item.estado;
		if (typeof item?.activo === 'boolean') return item.activo ? 'Activo' : 'Inactivo';
		return 'Sin estado';
	};

	return (
		<div className="vp">
			<section className="vp-card" aria-label="Acciones rápidas">
				<h2 className="vp-title">Acciones Rapidas</h2>
				<div className="vp-actions" role="list">
					{quickActions.map((a) => (
						<button 
							key={a.label} 
							type="button" 
							className="vp-action" 
							role="listitem"
							onClick={() => handleActionClick(a.label)}
						>
							<span className={actionIconClass(a.tone)} aria-hidden="true">
								{a.icon}
							</span>
							<span className="vp-action__label">{a.label}</span>
						</button>
					))}
				</div>
			</section>

			<section className="vp-card" aria-label="Productos">
				<div className="vp-card__header">
					<h2 className="vp-card__title">Productos</h2>
					<button type="button" className="vp-card__action">
						Ver todos
					</button>
				</div>

				{loading && <div className="vp-state">Cargando productos...</div>}
				{!loading && errorMessage && <div className="vp-state vp-state--error">{errorMessage}</div>}
				{!loading && !errorMessage && products.length === 0 && (
					<div className="vp-state">No hay productos registrados.</div>
				)}

				{!loading && !errorMessage && products.length > 0 && (
					<div className="vp-tableWrap">
						<table className="vp-table">
							<thead>
								<tr>
									<th>Imagenes</th>
									<th>ID Productos</th>
									<th>Descripcion</th>
									<th className="vp-center">Inventario</th>
									<th className="vp-right">Precio Base</th>
									<th className="vp-right">Precio Desc.</th>
									<th className="vp-right">Estado</th>
									<th className="vp-right">Accion</th>
								</tr>
							</thead>
							<tbody>
								{products.map((p) => {
									const productId = p?.id_producto ?? p?.id ?? '';
									const images = imageMap?.[productId] || [];
									const visibleImages = images.slice(0, 3);
									const remainingCount = images.length - visibleImages.length;
									return (
										<tr key={productId || p?.nombre}>
											<td>
												<div className="vp-imgCell">
													<div className="vp-imgStack" aria-hidden="true">
														{visibleImages.length > 0
															? visibleImages.map((url, idx) => (
																	<img key={`${productId}-${idx}`} src={url} alt="" />
																))
															: [
																	<img key={`${productId}-placeholder`} src="/img/theme-logo.png" alt="" />,
																  ]}
													</div>
													{remainingCount > 0 && (
														<span className="vp-imgMore">+{remainingCount}</span>
													)}
												</div>
											</td>
											<td className="vp-mono">{productId || '-'}</td>
											<td className="vp-desc">{p.descripcion || p.nombre || '-'}</td>
											<td className="vp-center">{p.cantidad_disponible ?? p.inventario ?? '-'}</td>
											<td className="vp-right">{formatCurrency(p.precio_base ?? p.precioBase)}</td>
											<td className="vp-right">
												{formatCurrency(p.precio_descuento ?? p.precioDesc ?? p.precio_promocional)}
											</td>
											<td className="vp-right">
												<span className={statusClass(formatEstado(p))}>{formatEstado(p)}</span>
											</td>
											<td className="vp-right">
												<div className="vp-rowActions">
													<button type="button" className="vp-iconBtn" aria-label="Editar">
														✎
													</button>
													<button type="button" className="vp-iconBtn" aria-label="Eliminar">
														🗑
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</div>
	);
};

export default VendedorProducto;
