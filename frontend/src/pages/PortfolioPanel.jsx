import { useEffect, useRef, useState } from 'react';
import { portfolioApi } from '../api/client';

const EMPTY_FORM = { title: '', description: '', product_url: '' };

export default function PortfolioPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  async function loadItems() {
    setLoading(true);
    setListError('');
    try {
      setItems(await portfolioApi.list());
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadItems(); }, []);

  function startNew() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setPreviewUrls([]);
    setExistingImages([]);
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function startEdit(item) {
    setSelectedId(item.id);
    setForm({
      title: item.title,
      description: item.description || '',
      product_url: item.product_url || '',
    });
    setImageFiles([]);
    setPreviewUrls([]);
    setExistingImages(item.images || [item.image_path]);
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
  }

  async function handleDelete(id) {
    if (!confirm('Hapus item portofolio ini?')) return;
    try {
      await portfolioApi.remove(id);
      if (selectedId === id) startNew();
      await loadItems();
    } catch (err) {
      setListError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!selectedId && imageFiles.length === 0) {
      setFormError('Minimal satu screenshot gambar wajib diunggah');
      return;
    }
    setSaving(true);
    try {
      if (selectedId) {
        await portfolioApi.update(selectedId, { ...form, imageFiles });
      } else {
        const created = await portfolioApi.create({ ...form, imageFiles });
        setSelectedId(created.id);
      }
      await loadItems();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dash-body">
      <section className="panel">
        <h2>Portofolio Produk ({items.length})</h2>
        {listError && <div className="form-error">{listError}</div>}

        <button className="btn-save" style={{ marginBottom: 14 }} onClick={startNew}>
          + Tambah Produk
        </button>

        {loading && <p className="empty-hint">Memuat…</p>}
        {!loading && items.length === 0 && <p className="empty-hint">Belum ada item portofolio.</p>}

        <div className="portfolio-grid">
          {items.map((item) => (
            <div className={`portfolio-card${selectedId === item.id ? ' active' : ''}`} key={item.id}>
              <img src={item.image_path} alt={item.title} className="portfolio-thumb" />
              <div className="portfolio-card-body">
                <div className="title">{item.title}</div>
                {item.images?.length > 1 && <span className="badge draft">{item.images.length} foto</span>}
                {item.description && <div className="sub">{item.description}</div>}
                <div className="row-actions">
                  <button onClick={() => startEdit(item)}>Edit</button>
                  <button className="danger" onClick={() => handleDelete(item.id)}>Hapus</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>{selectedId ? 'Edit Produk' : 'Produk Baru'}</h2>
        {formError && <div className="form-error">{formError}</div>}

        <form className="article-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="p-title">Judul Produk</label>
            <input
              id="p-title" type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="p-desc">Deskripsi Singkat</label>
            <input
              id="p-desc" type="text" value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="p-url">Link Produk (opsional)</label>
            <input
              id="p-url" type="text" value={form.product_url} placeholder="https://…"
              onChange={(e) => setForm({ ...form, product_url: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="p-image">
              Screenshot (bisa pilih beberapa sekaligus){selectedId ? ' — kosongkan jika tidak diganti' : ''}
            </label>
            <input
              id="p-image" type="file" multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              ref={fileInputRef} onChange={handleFileChange}
            />
          </div>

          {previewUrls.length > 0 && (
            <div className="field">
              <div className="image-preview-row">
                {previewUrls.map((url, i) => (
                  <img src={url} alt={`Preview ${i + 1}`} className="portfolio-preview" key={i} />
                ))}
              </div>
            </div>
          )}
          {previewUrls.length === 0 && existingImages.length > 0 && (
            <div className="field">
              <label>Gambar saat ini</label>
              <div className="image-preview-row">
                {existingImages.map((url, i) => (
                  <img src={url} alt={`Gambar ${i + 1}`} className="portfolio-preview" key={i} />
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button className="btn-save" type="submit" disabled={saving}>
              {saving ? 'Menyimpan…' : selectedId ? 'Simpan Perubahan' : 'Simpan Produk'}
            </button>
            {selectedId && <button type="button" className="btn-cancel" onClick={startNew}>Batal</button>}
          </div>
        </form>
      </section>
    </div>
  );
}
