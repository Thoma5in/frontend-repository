import { useMemo } from 'react';
import './VendedorProducto.css';

const VendedorProducto = () => {
	const quickActions = useMemo(
		() => [
			{ label: 'Nuevo Producto', icon: '+', tone: 'blue' },
			{ label: 'Crear Oferta', icon: '🏷️', tone: 'orange' },
			{ label: 'pa despues', icon: '+', tone: 'blue' },
			{ label: 'pa despues', icon: '+', tone: 'blue' },
		],
		[]
	);

	const products = useMemo(
		() => [
			{
				id: '#UJT-234',
				descripcion: 'Alto celuco mi bro, tiene...',
				inventario: 5,
				precioBase: '$100000,99',
				precioDesc: '$90000,99',
				estado: 'Activo',
			},
			{
				id: '#UJT-234',
				descripcion: 'Alto celuco, tiene...',
				inventario: 2,
				precioBase: '$100000,99',
				precioDesc: '$80000,99',
				estado: 'Inactivo',
			},
			{
				id: '#UJT-234',
				descripcion: 'Alto celuco mi bro, tiene...',
				inventario: 5,
				precioBase: '$100000,99',
				precioDesc: '$90000,99',
				estado: 'Activo',
			},
			{
				id: '#UJT-234',
				descripcion: 'Alto celuco mi bro, tiene...',
				inventario: 4,
				precioBase: '$100000,99',
				precioDesc: '$80000,99',
				estado: 'Inactivo',
			},
			{
				id: '#UJT-234',
				descripcion: 'Alto celuco mi bro, tiene...',
				inventario: 5,
				precioBase: '$100000,99',
				precioDesc: '$90000,99',
				estado: 'Activo',
			},
			{
				id: '#UJT-234',
				descripcion: 'Alto celuco mi bro, tiene...',
				inventario: 1,
				precioBase: '$100000,99',
				precioDesc: '$80000,99',
				estado: 'Inactivo',
			},
			{
				id: '#UJT-234',
				descripcion: 'Alto celuco mi bro, tiene...',
				inventario: 5,
				precioBase: '$100000,99',
				precioDesc: '$80000,99',
				estado: 'Inactivo',
			},
		],
		[]
	);

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

	return (
		<div className="vp">
			<section className="vp-card" aria-label="Acciones rápidas">
				<h2 className="vp-title">Acciones Rapidas</h2>
				<div className="vp-actions" role="list">
					{quickActions.map((a) => (
						<button key={a.label} type="button" className="vp-action" role="listitem">
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
					<h2 className="vp-card__title">Pedidos Recientes</h2>
					<button type="button" className="vp-card__action">
						Ver todos
					</button>
				</div>

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
								<th className="vp-right">Acción</th>
							</tr>
						</thead>
						<tbody>
							{products.map((p, idx) => (
								<tr key={`${p.id}-${idx}`}>
									<td>
										<div className="vp-imgCell">
											<div className="vp-imgStack" aria-hidden="true">
												<img src="/img/theme-logo.png" alt="" />
												<img src="/img/theme-logo.png" alt="" />
												<img src="/img/theme-logo.png" alt="" />
											</div>
											<span className="vp-imgMore">+5</span>
										</div>
									</td>
									<td className="vp-mono">{p.id}</td>
									<td className="vp-desc">{p.descripcion}</td>
									<td className="vp-center">{p.inventario}</td>
									<td className="vp-right">{p.precioBase}</td>
									<td className="vp-right">{p.precioDesc}</td>
									<td className="vp-right">
										<span className={statusClass(p.estado)}>{p.estado}</span>
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
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
};

export default VendedorProducto;
