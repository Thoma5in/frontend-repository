import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listarCategorias } from '../../services/categoriasApi';
import { obtenerProductosRequest } from '../../services/productosApi';
import { crearPromocion, crearPromocionProductos } from '../../services/promocionesApi';
import './VendedorDescuento.css';

const VendedorDescuento = ({ onNavigate }) => {
	const { user } = useAuth();
	const [discountType, setDiscountType] = useState(null);
	const [formData, setFormData] = useState({
		valor: '',
		nombre: '',
		fechaInicio: '',
		fechaFinalizacion: '',
		selectedProducts: [],
		selectedCategory: null,
	});
	const [categories, setCategories] = useState([]);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Cargar categorías
	useEffect(() => {
		const loadCategories = async () => {
			try {
				setLoading(true);
				const response = await listarCategorias();
				const categoriesData = response.categorias || response.data || response;
				setCategories(Array.isArray(categoriesData) ? categoriesData : []);
			} catch (err) {
				console.error('Error al cargar categorías:', err);
				setError('No se pudieron cargar las categorías');
			} finally {
				setLoading(false);
			}
		};
		loadCategories();
	}, []);

	// Cargar productos
	useEffect(() => {
		const loadProducts = async () => {
			try {
				setLoading(true);
				const response = await obtenerProductosRequest(user?.token);
				const productsData = response.productos || response.data || response;
				setProducts(Array.isArray(productsData) ? productsData : []);
			} catch (err) {
				console.error('Error al cargar productos:', err);
				setError('No se pudieron cargar los productos');
			} finally {
				setLoading(false);
			}
		};
		loadProducts();
	}, [user?.token]);

	const handleDiscountTypeSelect = (type) => {
		setDiscountType(type);
		setFormData((prev) => ({
			...prev,
			selectedCategory: null,
			selectedProducts: [],
		}));
	};

	const handleProductSelect = (productId) => {
		setFormData((prev) => ({
			...prev,
			selectedProducts: prev.selectedProducts.includes(productId)
				? prev.selectedProducts.filter((id) => id !== productId)
				: [...prev.selectedProducts, productId],
		}));
	};

	const handleCategorySelect = (categoryId) => {
		setFormData((prev) => ({
			...prev,
			selectedCategory: prev.selectedCategory === categoryId ? null : categoryId,
		}));
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleCancel = () => {
		setDiscountType(null);
		setFormData({
			valor: '',
			nombre: '',
			fechaInicio: '',
			fechaFinalizacion: '',
			selectedProducts: [],
			selectedCategory: null,
		});
		if (onNavigate) {
			onNavigate('productos');
		}
	};

	const handleSave = async () => {
		try {
			// Validar campos requeridos
			if (!formData.nombre || !formData.valor || !formData.fechaInicio || !formData.fechaFinalizacion) {
				setError('Por favor completa todos los campos requeridos');
				return;
			}

			if (!discountType) {
				setError('Debes seleccionar un tipo de descuento');
				return;
			}

			if (discountType === 'categoria' && !formData.selectedCategory) {
				setError('Debes seleccionar una categoría');
				return;
			}

			if (discountType === 'productos' && formData.selectedProducts.length === 0) {
				setError('Debes seleccionar al menos un producto');
				return;
			}

			setLoading(true);
			setError(null);

			// Preparar datos para el API
			const promotionData = {
				nombre: formData.nombre,
				descripcion: `Descuento ${discountType === 'categoria' ? 'por categoría' : 'por productos'}`,
				tipo_descuento: 'porcentaje',
				valor_descuento: parseFloat(formData.valor),
				fecha_inicio: formData.fechaInicio,
				fecha_fin: formData.fechaFinalizacion,
				activa: true,
				prioridad: 0,
				combinable: false,
			};

			// Si es descuento por categoría, agregar el id_categorias
			if (discountType === 'categoria') {
				promotionData.id_categorias = [formData.selectedCategory];
			}
			if (discountType === 'productos') {
				promotionData.id_productos = formData.selectedProducts;
			}

			const response =
				discountType === 'productos'
					? await crearPromocionProductos(promotionData, user?.token)
					: await crearPromocion(promotionData, user?.token);
			console.log('Promoción creada exitosamente:', response);

			setError(null);
			handleCancel();
		} catch (err) {
			console.error('Error al crear la promoción:', err);
			setError(err.message || 'Error al crear la promoción');
		} finally {
			setLoading(false);
		}
	};

	const statusClass = (estado) => {
		const normalized = String(estado || '').toLowerCase();
		if (normalized.includes('activo')) return 'vd-status vd-status--ok';
		if (normalized.includes('inactivo')) return 'vd-status vd-status--warn';
		return 'vd-status';
	};

	return (
		<div className="vd">
			{error && (
				<div className="vd-error-banner">
					<p>{error}</p>
					<button onClick={() => setError(null)} className="vd-error-close">✕</button>
				</div>
			)}

			<div className="vd-card">
				<h2 className="vd-card__title">01 Seleccionar Tipo de Descuento</h2>
				<div className="vd-options">
					<button
						type="button"
						className={`vd-option ${discountType === 'productos' ? 'vd-option--selected' : ''}`}
						onClick={() => handleDiscountTypeSelect('productos')}
						disabled={loading}
					>
						<div className="vd-option__icon vd-option__icon--blue">
							<span aria-hidden="true">🏷️</span>
						</div>
						<h3 className="vd-option__title">Por Productos</h3>
						<p className="vd-option__desc">
							Aplica descuentos individuales a una selección específica de productos.
						</p>
					</button>

					<button
						type="button"
						className={`vd-option ${discountType === 'categoria' ? 'vd-option--selected' : ''}`}
						onClick={() => handleDiscountTypeSelect('categoria')}
						disabled={loading}
					>
						<div className="vd-option__icon vd-option__icon--orange">
							<span aria-hidden="true">🏷️</span>
						</div>
						<h3 className="vd-option__title">Por Categoría</h3>
						<p className="vd-option__desc">
							Descuento masivo aplicado a todos los productos de una categoría.
						</p>
					</button>
				</div>
			</div>

			<div className="vd-card">
				<h2 className="vd-card__title">02 Detalles del Descuento</h2>
				<div className="vd-form">
					<div className="vd-form__row">
						<div className="vd-form__group">
							<label htmlFor="valor" className="vd-label">
								Valor del Descuento
							</label>
							<div className="vd-input-wrapper">
								<input
									type="number"
									id="valor"
									name="valor"
									value={formData.valor}
									onChange={handleInputChange}
									placeholder="0.00"
									className="vd-input"
									disabled={loading}
									min="0"
									max="100"
								/>
								<span className="vd-input-suffix">%</span>
							</div>
						</div>

						<div className="vd-form__group">
							<label htmlFor="nombre" className="vd-label">
								Nombre de la Campaña
							</label>
							<input
								type="text"
								id="nombre"
								name="nombre"
								value={formData.nombre}
								onChange={handleInputChange}
								placeholder="Ej. Rebajas de Verano"
								className="vd-input"
								disabled={loading}
							/>
						</div>
					</div>

					<div className="vd-form__row">
						<div className="vd-form__group">
							<label htmlFor="fechaInicio" className="vd-label">
								Fecha de Inicio
							</label>
							<input
								type="date"
								id="fechaInicio"
								name="fechaInicio"
								value={formData.fechaInicio}
								onChange={handleInputChange}
								className="vd-input"
								disabled={loading}
							/>
						</div>

						<div className="vd-form__group">
							<label htmlFor="fechaFinalizacion" className="vd-label">
								Fecha Finalización
							</label>
							<input
								type="date"
								id="fechaFinalizacion"
								name="fechaFinalizacion"
								value={formData.fechaFinalizacion}
								onChange={handleInputChange}
								className="vd-input"
								disabled={loading}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="vd-card">
				<div className="vd-card__header">
					<h2 className="vd-card__title">03 Selección de Objetivos</h2>
					{discountType === 'productos' && (
						<input
							type="text"
							placeholder="Buscar productos..."
							className="vd-search"
							disabled={loading}
						/>
					)}
				</div>

				{discountType === 'productos' && (
					<>
						{products.length > 0 ? (
							<>
								<div className="vd-tableWrap">
									<table className="vd-table">
										<thead>
											<tr>
												<th className="vd-checkbox-col">
													<input type="checkbox" className="vd-checkbox" disabled={loading} />
												</th>
												<th>PRODUCTO</th>
												<th>ID SKU</th>
												<th className="vp-right">INVENTARIO</th>
												<th className="vp-right">PRECIO BASE</th>
												<th className="vp-right">ESTADO</th>
											</tr>
										</thead>
										<tbody>
											{products.map((p) => (
												<tr key={p.id_producto || p.id}>
													<td className="vd-checkbox-col">
														<input
															type="checkbox"
															className="vd-checkbox"
															checked={formData.selectedProducts.includes(p.id_producto || p.id)}
															onChange={() => handleProductSelect(p.id_producto || p.id)}
															disabled={loading}
														/>
													</td>
													<td>
														<div className="vd-product-cell">
															<div className="vd-product-icon">
																<span aria-hidden="true">📦</span>
															</div>
															<span className="vd-product-name">{p.nombre || p.nombre_producto}</span>
														</div>
													</td>
													<td className="vd-mono">{p.sku || p.id_producto}</td>
													<td className="vd-right">{p.cantidad_disponible || p.inventario || 0} un.</td>
													<td className="vd-right">${p.precio || p.precioBase || '0.00'}</td>
													<td className="vd-right">
														<span className={statusClass(p.estado || 'Activo')}>{p.estado || 'Activo'}</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								<div className="vd-pagination">
									<span className="vd-pagination__text">Mostrando {products.length} productos</span>
									<div className="vd-pagination__controls">
										<button type="button" className="vd-pagination__btn" disabled aria-label="Anterior">
											←
										</button>
										<button type="button" className="vd-pagination__btn" aria-label="Siguiente">
											→
										</button>
									</div>
								</div>
							</>
						) : (
							<div className="vd-category-list">
								<p className="vd-category-placeholder">
									{loading ? 'Cargando productos...' : 'No hay productos disponibles'}
								</p>
							</div>
						)}
					</>
				)}

				{discountType === 'categoria' && (
					<div className="vd-category-list">
						{categories.length > 0 ? (
							<div className="vd-categories-grid">
								{categories.map((cat) => (
									<button
										key={cat.id_categoria || cat.id}
										onClick={() => handleCategorySelect(cat.id_categoria || cat.id)}
										className={`vd-category-card ${
											formData.selectedCategory === (cat.id_categoria || cat.id) ? 'vd-category-card--selected' : ''
										}`}
										disabled={loading}
										type="button"
									>
										<div className="vd-category-icon">📁</div>
										<h4 className="vd-category-name">{cat.nombre_categoria || cat.nombre}</h4>
										{cat.descripcion && <p className="vd-category-desc">{cat.descripcion}</p>}
									</button>
								))}
							</div>
						) : (
							<p className="vd-category-placeholder">
								{loading ? 'Cargando categorías...' : 'No hay categorías disponibles'}
							</p>
						)}
					</div>
				)}
			</div>

			<div className="vd-footer">
				<button 
					type="button" 
					className="vd-btn vd-btn--secondary" 
					onClick={handleCancel}
					disabled={loading}
				>
					Cancelar
				</button>
				<button 
					type="button" 
					className="vd-btn vd-btn--primary" 
					onClick={handleSave}
					disabled={loading}
				>
					{loading ? 'Creando...' : 'Crear Descuento'}
				</button>
			</div>
		</div>
	);
};


export default VendedorDescuento;
