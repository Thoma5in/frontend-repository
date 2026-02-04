import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./PasarelaPagos.css";

const formatCOP = (value) => {
	const numberValue = Number(value) || 0;
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0,
	}).format(numberValue);
};

export default function PasarelaPagos() {
	const location = useLocation();
	const navigate = useNavigate();

	const [items, setItems] = useState([]);

	// UI states (prototipo)
	const [selectedPayment, setSelectedPayment] = useState("visa");
	const [couponCode, setCouponCode] = useState("CUPON2025");
	const [couponApplied, setCouponApplied] = useState(true);
	const [couponMessage, setCouponMessage] = useState("Cupón válido");

	useEffect(() => {
		const fromNav = location?.state?.items;
		if (Array.isArray(fromNav) && fromNav.length > 0) {
			setItems(fromNav);
			return;
		}

		// Fallback: sessionStorage (por si recargan /pagos)
		try {
			const raw = sessionStorage.getItem("checkoutSelection");
			if (!raw) return;
			const parsed = JSON.parse(raw);
			if (Array.isArray(parsed?.items) && parsed.items.length > 0) {
				setItems(parsed.items);
			}
		} catch {
			// ignore
		}
	}, [location?.state]);

	const itemsCount = useMemo(
		() => items.reduce((sum, item) => sum + (Number(item.cantidad) || 0), 0),
		[items]
	);

	const subtotal = useMemo(
		() =>
			items.reduce(
				(sum, item) => sum + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),
				0
			),
		[items]
	);

	const ivaRate = 0.19;
	const iva = Math.round(subtotal * ivaRate);
	const discount = couponApplied && couponCode.trim().toUpperCase() === "CUPON2025" ? Math.round(subtotal * 0.1) : 0;
	const shipping = 0;
	const total = Math.max(0, subtotal + iva + shipping - discount);

	const applyCoupon = () => {
		const normalized = couponCode.trim().toUpperCase();
		if (!normalized) {
			setCouponApplied(false);
			setCouponMessage("Ingresa un código");
			return;
		}

		if (normalized === "CUPON2025") {
			setCouponApplied(true);
			setCouponMessage("Cupón válido");
		} else {
			setCouponApplied(false);
			setCouponMessage("Cupón no válido");
		}
	};

	const removeCoupon = () => {
		setCouponApplied(false);
		setCouponCode("");
		setCouponMessage("");
	};

	const changeQty = (id, delta) => {
		setItems((prev) =>
			prev.map((item) => {
				if (item.id !== id) return item;
				const next = Math.max(1, (Number(item.cantidad) || 1) + delta);
				return { ...item, cantidad: next };
			})
		);
	};

	const confirmPurchase = () => {
		// Prototipo: aquí iría la integración real con pagos/orden.
		alert("Compra confirmada (prototipo)");
		navigate("/cart");
	};

	return (
		<div className="pasarela-page">
			<div className="pasarela-wrapper">
				<h1 className="pasarela-title">Confirmar Compra</h1>

				{items.length === 0 ? (
					<div className="pasarela-empty">
						<p>No hay productos seleccionados para pagar.</p>
						<Link className="pasarela-back" to="/cart">
							Volver al carrito
						</Link>
					</div>
				) : (
					<>
						<div className="pasarela-top">
							<section className="pasarela-card">
								<div className="pasarela-card-header">
									<div className="pasarela-pin" aria-hidden="true" />
									<div>
										<h2>Dirección</h2>
										<p>No hay direcciones guardadas</p>
									</div>
								</div>
								<p className="pasarela-muted">Añade una dirección para enviar tu pedido</p>
								<button className="pasarela-primary" type="button">
									Añadir dirección
								</button>
							</section>

							<section className="pasarela-card">
								<div className="pasarela-card-header">
									<div>
										<h2>Elige cómo pagar</h2>
										<button className="pasarela-link" type="button">
											+ Añadir método de pago
										</button>
									</div>
								</div>

								<div className="pasarela-payments">
									<label className="pasarela-payment">
										<span className="badge visa">VISA</span>
										<span className="pasarela-payment-name">Visa ••••••••9834</span>
										<input
											type="radio"
											name="payment"
											checked={selectedPayment === "visa"}
											onChange={() => setSelectedPayment("visa")}
										/>
									</label>

									<label className="pasarela-payment">
										<span className="badge mc">MC</span>
										<span className="pasarela-payment-name">Mastercard ••••••••9834</span>
										<input
											type="radio"
											name="payment"
											checked={selectedPayment === "mastercard"}
											onChange={() => setSelectedPayment("mastercard")}
										/>
									</label>

									<label className="pasarela-payment">
										<span className="badge nequi">NQ</span>
										<span className="pasarela-payment-name">Nequi ••••••••9834</span>
										<input
											type="radio"
											name="payment"
											checked={selectedPayment === "nequi"}
											onChange={() => setSelectedPayment("nequi")}
										/>
									</label>
								</div>
							</section>

							<section className="pasarela-card pasarela-summary">
								<h2>Código de descuento</h2>
								<div className="pasarela-coupon">
									<input
										value={couponCode}
										onChange={(e) => setCouponCode(e.target.value)}
										placeholder="Ingresa tu cupón"
										aria-label="Código de descuento"
									/>
									<button type="button" className="pasarela-secondary" onClick={applyCoupon}>
										Aplicar
									</button>
								</div>

								<div className="pasarela-coupon-row">
									<span className={couponApplied ? "ok" : ""}>{couponMessage}</span>
									{couponApplied && (
										<button type="button" className="pasarela-link danger" onClick={removeCoupon}>
											Eliminar
										</button>
									)}
								</div>

								<div className="pasarela-totals">
									<div className="row">
										<span>Subtotal ({itemsCount} items)</span>
										<span>{formatCOP(subtotal)}</span>
									</div>
									<div className="row">
										<span>IVA</span>
										<span>{formatCOP(iva)}</span>
									</div>
									<div className="row">
										<span>Envío</span>
										<span className="ok">Gratis</span>
									</div>
									{discount > 0 && (
										<div className="row">
											<span>Descuento</span>
											<span>-{formatCOP(discount)}</span>
										</div>
									)}
									<div className="row total">
										<span>Total (con IVA)</span>
										<span>{formatCOP(total)}</span>
									</div>
								</div>

								<button className="pasarela-primary" type="button" onClick={confirmPurchase}>
									Confirmar Compra
								</button>
							</section>
						</div>

						<div className="pasarela-note">
							<span className="info">i</span>
							<span>Verifica que todo esté perfecto antes de confirmar la compra</span>
						</div>

						<section className="pasarela-cart">
							<div className="pasarela-cart-header">
								<h2>Carrito</h2>
								<span className="pasarela-muted">{itemsCount} items</span>
							</div>

							<div className="pasarela-cart-list">
								{items.map((item) => {
									const precio = Number(item.precio) || 0;
									const precioOriginal = Number(item.precioOriginal ?? item.precio) || 0;
									const descuento = Number(item.descuento) || 0;
									const cantidad = Number(item.cantidad) || 1;

									return (
										<div className="pasarela-cart-item" key={item.id}>
											<img
												className="pasarela-cart-img"
												src={item.imagen || "https://placehold.co/120x80?text=IMG"}
												alt={item.nombre || "Producto"}
											/>
											<div className="pasarela-cart-info">
												<div className="pasarela-cart-name">{item.nombre}</div>
												<div className="pasarela-cart-prices">
													<span className="old">{formatCOP(precioOriginal)}</span>
													<span className="now">{formatCOP(precio)}</span>
													{descuento > 0 && <span className="disc">{descuento}%OFF</span>}
												</div>
											</div>

											<div className="pasarela-cart-qty">
												<button type="button" onClick={() => changeQty(item.id, -1)}>
													−
												</button>
												<input readOnly value={cantidad} aria-label="Cantidad" />
												<button type="button" onClick={() => changeQty(item.id, 1)}>
													+
												</button>
											</div>
										</div>
									);
								})}
							</div>
						</section>
					</>
				)}
			</div>
		</div>
	);
}
