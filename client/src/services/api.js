const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const headers = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

const request = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  return res.json();
};

export const api = {
  get: (path, token) => request(path, { headers: headers(token) }),
  post: (path, body, token) => request(path, { method: 'POST', headers: headers(token), body: JSON.stringify(body) })
};

export const upload = async (file, token) => {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_URL}/uploads`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
};
