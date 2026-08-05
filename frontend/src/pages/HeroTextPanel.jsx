import { useEffect, useState } from 'react';
import { heroSettingsApi } from '../api/client';
import ContentListEditor from '../components/ContentListEditor';

function HeadingPrefixForm() {
  const [prefix, setPrefix] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    heroSettingsApi.get()
      .then((s) => setPrefix(s.heading_prefix))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      await heroSettingsApi.update(prefix);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel">
      <h2>Judul Utama ("We Build")</h2>
      {error && <div className="form-error">{error}</div>}
      {loading ? (
        <p className="empty-hint">Memuat…</p>
      ) : (
        <form className="article-form" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="heading-prefix">Teks tetap di baris pertama judul hero</label>
            <input
              id="heading-prefix" type="text" required value={prefix}
              onChange={(e) => { setPrefix(e.target.value); setSaved(false); }}
            />
          </div>
          <div className="form-actions">
            <button className="btn-save" type="submit" disabled={saving}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>
            {saved && <span className="save-confirm">Tersimpan ✓</span>}
          </div>
        </form>
      )}
    </section>
  );
}

export default function HeroTextPanel() {
  return (
    <div className="dash-body">
      <HeadingPrefixForm />
      <ContentListEditor
        type="rotating_word"
        itemLabel="Kata Berganti"
        placeholder="mis. Sistem Inventory"
      />
    </div>
  );
}
