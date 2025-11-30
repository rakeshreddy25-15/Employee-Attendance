const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const url = `${BASE}${path}`;
  const headers = new Headers(opts.headers as any || {});
  
  // Add auth token if available (unless already set by caller)
  if (!headers.has('Authorization')) {
    const token = localStorage.getItem('api_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
  }
  
  if (!(opts.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  const res = await fetch(url, { ...opts, headers, credentials: 'include' });
  if (!res.ok) {
    const text = await res.text();
    let body: any = text;
    try { body = JSON.parse(text); } catch {};
    throw { status: res.status, body };
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  return res.text();
}

export function setAuthToken(token: string | null) {
  if (token) localStorage.setItem('api_token', token);
  else localStorage.removeItem('api_token');
}

export function getAuthHeaders() {
  const token = localStorage.getItem('api_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}
