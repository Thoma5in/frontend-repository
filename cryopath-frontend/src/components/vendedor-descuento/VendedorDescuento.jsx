import { useState, useMemo } from 'react';
import './VendedorDescuento.css';

const VendedorDescuento = ({ onNavigate }) => {
	const [discountType, setDiscountType] = useState(null);
	const [formData, setFormData] = useState({
		valor: '',
		nombre: '',
		fechaInicio: '',
		fechaFinalizacion: '',
		selectedProducts: [],
	});

	const products = useMemo(
		() => [
			{
				id: '#UJT-234',
				nombre: 'Smartphone Ultra X',
				sku: '#UJT-234',
				inventario: 128,
				precioBase: '$899,00',
				estado: 'Activo',
			},
			{
				id: '#UJT-782',
				nombre: 'Auriculares Pro Wireless',
				sku: '#UJT-782',
				inventario: 42,
				precioBase: '$159,00',
				estado: 'Activo',
			},
			{
				id: '#UJT-112',
				nombre: 'Tablet Max 12"',
				sku: '#UJT-112',
				inventario: 15,
				precioBase: '$450,00',
				estado: 'Inactivo',
			},
		],
		[]
	);

	const handleDiscountTypeSelect = (type) => {
		setDiscountType(type);
	};

	const handleProductSelect = (productId) => {
		setFormData((prev) => ({
			...prev,
			selectedProducts: prev.selectedProducts.includes(productId)
				? prev.selectedProducts.filter((id) => id !== productId)
				: [...prev.selectedProducts, productId],
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
		});
		if (onNavigate) {
			onNavigate('productos');
		}
	};

	const handleSave = () => {
		console.log('Descuento creado:', {
			tipo: discountType,
			...formData,
		});
		handleCancel();
	};

	const statusClass = (estado) => {
		const normalized = String(estado || '').toLowerCase();
		if (normalized.includes('activo')) return 'vd-status vd-status--ok';
		if (normalized.includes('inactivo')) return 'vd-status vd-status--warn';
		return 'vd-status';
	};

	return (
		<div className="vd">
			<div className="vd-card">
				<h2 className="vd-card__title">01 Seleccionar Tipo de Descuento</h2>
				<div className="vd-options">
					<button
						type="button"
						className={`vd-option ${discountType === 'productos' ? 'vd-option--selected' : ''}`}
						onClick={() => handleDiscountTypeSelect('productos')}
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
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="vd-card">
				<div className="vd-card__header">
					<h2 className="vd-card__title">03 Selección de Objetivos</h2>
					<input
						type="text"
						placeholder="Buscar productos..."
						className="vd-search"
					/>
				</div>

				{discountType === 'productos' && (
					<>
						<div className="vd-tableWrap">
							<table className="vd-table">
								<thead>
									<tr>
										<th className="vd-checkbox-col">
											<input type="checkbox" className="vd-checkbox" />
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
										<tr key={p.id}>
											<td className="vd-checkbox-col">
												<input
													type="checkbox"
													className="vd-checkbox"
													checked={formData.selectedProducts.includes(p.id)}
													onChange={() => handleProductSelect(p.id)}
												/>
											</td>
											<td>
												<div className="vd-product-cell">
													<div className="vd-product-icon">
														<span aria-hidden="true">📦</span>
													</div>
													<span className="vd-product-name">{p.nombre}</span>
												</div>
											</td>
											<td className="vd-mono">{p.sku}</td>
											<td className="vd-right">{p.inventario} un.</td>
											<td className="vd-right">{p.precioBase}</td>
											<td className="vd-right">
												<span className={statusClass(p.estado)}>{p.estado}</span>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className="vd-pagination">
							<span className="vd-pagination__text">Mostrando 3 de 124 productos</span>
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
				)}

				{discountType === 'categoria' && (
					<div className="vd-category-list">
						<p className="vd-category-placeholder">Selecciona una categoría para aplicar el descuento masivo</p>
					</div>
				)}
			</div>

			<div className="vd-footer">
				<button type="button" className="vd-btn vd-btn--secondary" onClick={handleCancel}>
					Cancelar
				</button>
				<button type="button" className="vd-btn vd-btn--primary" onClick={handleSave}>
					Crear Descuento
				</button>
			</div>
		</div>
	);
};

export default VendedorDescuento;
