const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.error || `Request gagal (${res.status})`);
  }
  return data;
}

// Multipart requests (file upload) must NOT set a Content-Type header —
// the browser fills in the multipart boundary itself when the body is FormData.
async function requestForm(path, formData) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new Error(data?.error || `Request gagal (${res.status})`);
  }
  return data;
}

export const authApi = {
  login: (email, password) =>
    request('/login.php', { method: 'POST', body: JSON.stringify({ email, password }) }),
  logout: () => request('/logout.php', { method: 'POST' }),
  me: () => request('/me.php'),
};

function articleFormData({ title, excerpt, content, status, coverFile, removeCover }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('excerpt', excerpt ?? '');
  fd.append('content', content);
  fd.append('status', status);
  if (coverFile) fd.append('cover', coverFile);
  if (removeCover) fd.append('remove_cover', '1');
  return fd;
}

export const articlesApi = {
  list: () => request('/articles.php'),
  get: (id) => request(`/articles.php?id=${id}`),
  getBySlug: (slug) => request(`/articles.php?slug=${encodeURIComponent(slug)}`),
  create: (fields) => requestForm('/articles.php', articleFormData(fields)),
  update: (id, fields) => {
    const fd = articleFormData(fields);
    fd.append('id', id);
    return requestForm('/articles.php', fd);
  },
  remove: (id) => request(`/articles.php?id=${id}`, { method: 'DELETE' }),
};

function portfolioFormData({ title, description, product_url, imageFiles }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('description', description ?? '');
  fd.append('product_url', product_url ?? '');
  (imageFiles ?? []).forEach((file) => fd.append('images[]', file));
  return fd;
}

export const portfolioApi = {
  list: () => request('/portfolio.php'),
  get: (id) => request(`/portfolio.php?id=${id}`),
  create: (fields) => requestForm('/portfolio.php', portfolioFormData(fields)),
  update: (id, fields) => {
    const fd = portfolioFormData(fields);
    fd.append('id', id);
    return requestForm('/portfolio.php', fd);
  },
  remove: (id) => request(`/portfolio.php?id=${id}`, { method: 'DELETE' }),
};

function adFormData({ title, target_url, imageFile }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('target_url', target_url);
  if (imageFile) fd.append('image', imageFile);
  return fd;
}

export const adsApi = {
  list: () => request('/ads.php'),
  create: (fields) => requestForm('/ads.php', adFormData(fields)),
  update: (id, fields) => {
    const fd = adFormData(fields);
    fd.append('id', id);
    return requestForm('/ads.php', fd);
  },
  move: (id, direction) => request(`/ads.php?id=${id}`, { method: 'PUT', body: JSON.stringify({ move: direction }) }),
  remove: (id) => request(`/ads.php?id=${id}`, { method: 'DELETE' }),
};

export const contentListApi = {
  list: (type) => request(`/content-list.php?type=${type}`),
  create: (type, text) => request(`/content-list.php?type=${type}`, { method: 'POST', body: JSON.stringify({ text }) }),
  update: (type, id, text) => request(`/content-list.php?type=${type}&id=${id}`, { method: 'PUT', body: JSON.stringify({ text }) }),
  move: (type, id, direction) => request(`/content-list.php?type=${type}&id=${id}`, { method: 'PUT', body: JSON.stringify({ move: direction }) }),
  remove: (type, id) => request(`/content-list.php?type=${type}&id=${id}`, { method: 'DELETE' }),
};

export const heroSettingsApi = {
  get: () => request('/hero-settings.php'),
  update: (heading_prefix) => request('/hero-settings.php', { method: 'PUT', body: JSON.stringify({ heading_prefix }) }),
};
