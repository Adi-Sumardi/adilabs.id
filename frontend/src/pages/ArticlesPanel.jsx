import { useEffect, useRef, useState } from 'react';
import { articlesApi } from '../api/client';

const EMPTY_FORM = { title: '', excerpt: '', content: '', status: 'draft' };

export default function ArticlesPanel() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [removeCover, setRemoveCover] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  async function loadArticles() {
    setLoading(true);
    setListError('');
    try {
      setArticles(await articlesApi.list());
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadArticles(); }, []);

  function startNew() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setCoverFile(null);
    setCoverPreview(null);
    setRemoveCover(false);
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function startEdit(article) {
    setSelectedId(article.id);
    setForm({
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      status: article.status,
    });
    setCoverFile(null);
    setCoverPreview(article.cover_image || null);
    setRemoveCover(false);
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleCoverChange(e) {
    const file = e.target.files?.[0] || null;
    setCoverFile(file);
    setRemoveCover(false);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  }

  function handleRemoveCover() {
    setCoverFile(null);
    setCoverPreview(null);
    setRemoveCover(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDelete(id) {
    if (!confirm('Hapus artikel ini?')) return;
    try {
      await articlesApi.remove(id);
      if (selectedId === id) startNew();
      await loadArticles();
    } catch (err) {
      setListError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    setSaving(true);
    try {
      const payload = { ...form, coverFile, removeCover };
      if (selectedId) {
        await articlesApi.update(selectedId, payload);
      } else {
        const created = await articlesApi.create(payload);
        setSelectedId(created.id);
      }
      await loadArticles();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dash-body">
      <section className="panel">
        <h2>Artikel ({articles.length})</h2>
        {listError && <div className="form-error">{listError}</div>}

        <div className="article-list">
          <button className="btn-save" style={{ marginBottom: 4 }} onClick={startNew}>
            + Tulis Artikel Baru
          </button>

          {loading && <p className="empty-hint">Memuat…</p>}
          {!loading && articles.length === 0 && <p className="empty-hint">Belum ada artikel.</p>}

          {articles.map((a) => (
            <div className={`article-row${selectedId === a.id ? ' active' : ''}`} key={a.id}>
              <div className="meta">
                <div className="title">{a.title}</div>
                <div className="sub">
                  <span className={`badge ${a.status}`}>{a.status === 'published' ? 'Terbit' : 'Draft'}</span>
                  {' · '}{new Date(a.updated_at).toLocaleDateString('id-ID')}
                </div>
              </div>
              <div className="row-actions">
                <button onClick={() => startEdit(a)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(a.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>{selectedId ? 'Edit Artikel' : 'Artikel Baru'}</h2>
        {formError && <div className="form-error">{formError}</div>}

        <form className="article-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="title">Judul</label>
            <input
              id="title" type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="excerpt">Ringkasan</label>
            <input
              id="excerpt" type="text" value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="content">Konten</label>
            <textarea
              id="content" required value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="cover">Gambar Sampul (opsional)</label>
            <input
              id="cover" type="file" accept="image/png,image/jpeg,image/webp,image/gif"
              ref={fileInputRef} onChange={handleCoverChange}
            />
            {coverPreview && (
              <>
                <img src={coverPreview} alt="Preview sampul" className="article-cover-preview" />
                <button type="button" className="btn-cancel" style={{ marginTop: 8 }} onClick={handleRemoveCover}>
                  Hapus Gambar Sampul
                </button>
              </>
            )}
          </div>
          <div className="field">
            <label htmlFor="status">Status</label>
            <select
              id="status" value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="draft">Draft</option>
              <option value="published">Terbit</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="btn-save" type="submit" disabled={saving}>
              {saving ? 'Menyimpan…' : selectedId ? 'Simpan Perubahan' : 'Publikasikan'}
            </button>
            {selectedId && <button type="button" className="btn-cancel" onClick={startNew}>Batal</button>}
          </div>
        </form>
      </section>
    </div>
  );
}
