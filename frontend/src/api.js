const API = import.meta.env.VITE_API_URL || '/api';
export async function getProducts() {
  const response = await fetch(`${API}/products`);
  if (!response.ok) throw new Error('Unable to load products');
  return response.json();
}
