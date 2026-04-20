const BASE_URL = import.meta.env.VITE_ENVIA_API || import.meta.env.VITE_BACKEND_API || 'http://localhost:3001';

async function handleResponse(response) {
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    const msg = json?.message || json?.error || `HTTP ${response.status}`;
    throw new Error(msg);
  }
  return json;
}

export async function quoteRates(payload) {
  // Basic validation to avoid 400
  if (!payload || !payload.origin || !payload.destination || !Array.isArray(payload.parcels) || payload.parcels.length === 0) {
    throw new Error('Invalid payload: origin, destination, parcels required');
  }

  const response = await fetch(`${BASE_URL}/envia/rates`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function createShipment(payload, idempotencyKey) {
  if (!payload || !payload.shipper || !payload.recipient || !Array.isArray(payload.parcels) || payload.parcels.length === 0) {
    throw new Error('Invalid payload: shipper, recipient, parcels required');
  }

  const headers = { 'Content-Type': 'application/json' };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  const response = await fetch(`${BASE_URL}/envia/shipments`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
}

export async function getShipment(id) {
  if (!id) throw new Error('Shipment id required');
  const response = await fetch(`${BASE_URL}/envia/shipments/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  return handleResponse(response);
}

export async function getShipmentLabel(id, format = 'pdf') {
  if (!id) throw new Error('Shipment id required');
  const q = new URLSearchParams();
  if (format) q.set('format', format);
  const response = await fetch(`${BASE_URL}/envia/shipments/${encodeURIComponent(id)}/label?${q.toString()}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  return handleResponse(response);
}

export default {
  quoteRates,
  createShipment,
  getShipment,
  getShipmentLabel,
};
