import { useEffect, useRef, useState } from 'react';
import { adsApi } from '../api/client';

const EMPTY_FORM = { title: '', target_url: '' };

export default function AdsPanel() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState('');

  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef(null);

  async function loadAds() {
    setLoading(true);
    setListError('');
    try {
      setAds(await adsApi.list());
    } catch (err) {
      setListError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadAds(); }, []);

  function startNew() {
    setSelectedId(null);
    setForm(EMPTY_FORM);
    setImageFile(null);
    setPreviewUrl(null);
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function startEdit(ad) {
    setSelectedId(ad.id);
    setForm({ title: ad.title, target_url: ad.target_url });
    setImageFile(null);
    setPreviewUrl(ad.image_path);
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  async function handleMove(id, direction) {
    try {
      await adsApi.move(id, direction);
      await loadAds();
    } catch (err) {
      setListError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Hapus iklan ini?')) return;
    try {
      await adsApi.remove(id);
      if (selectedId === id) startNew();
      await loadAds();
    } catch (err) {
      setListError(err.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    if (!selectedId && !imageFile) {
      setFormError('Gambar iklan wajib diunggah');
      return;
    }
    setSaving(true);
    try {
      if (selectedId) {
        await adsApi.update(selectedId, { ...form, imageFile });
      } else {
        const created = await adsApi.create({ ...form, imageFile });
        setSelectedId(created.id);
      }
      await loadAds();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="dash-body">
      <section className="panel">
        <h2>Iklan Aplikasi ({ads.length})</h2>
        {listError && <div className="form-error">{listError}</div>}

        <button className="btn-save" style={{ marginBottom: 14 }} onClick={startNew}>
          + Tambah Iklan
        </button>

        {loading && <p className="empty-hint">Memuat…</p>}
        {!loading && ads.length === 0 && <p className="empty-hint">Belum ada iklan.</p>}

        <div className="reorder-list">
          {ads.map((ad, idx) => (
            <div className={`reorder-row${selectedId === ad.id ? ' active' : ''}`} key={ad.id}>
              <div className="reorder-controls">
                <button disabled={idx === 0} onClick={() => handleMove(ad.id, 'up')} title="Naikkan">↑</button>
                <button disabled={idx === ads.length - 1} onClick={() => handleMove(ad.id, 'down')} title="Turunkan">↓</button>
              </div>
              <img src={ad.image_path} alt={ad.title} className="ad-thumb" />
              <span className="reorder-text">{ad.title}</span>
              <div className="row-actions">
                <button onClick={() => startEdit(ad)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(ad.id)}>Hapus</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2>{selectedId ? 'Edit Iklan' : 'Iklan Baru'}</h2>
        {formError && <div className="form-error">{formError}</div>}

        <form className="article-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="ad-title">Judul Iklan</label>
            <input
              id="ad-title" type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ad-url">URL Tujuan (saat diklik)</label>
            <input
              id="ad-url" type="text" required value={form.target_url} placeholder="https://…"
              onChange={(e) => setForm({ ...form, target_url: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="ad-image">Gambar Iklan {selectedId ? '(kosongkan jika tidak diganti)' : ''}</label>
            <input
              id="ad-image" type="file" accept="image/png,image/jpeg,image/webp,image/gif"
              ref={fileInputRef} onChange={handleFileChange}
            />
          </div>
          {previewUrl && (
            <div className="field">
              <img src={previewUrl} alt="Preview" className="portfolio-preview" />
            </div>
          )}
          <div className="form-actions">
            <button className="btn-save" type="submit" disabled={saving}>
              {saving ? 'Menyimpan…' : selectedId ? 'Simpan Perubahan' : 'Simpan Iklan'}
            </button>
            {selectedId && <button type="button" className="btn-cancel" onClick={startNew}>Batal</button>}
          </div>
        </form>
      </section>
    </div>
  );
}
