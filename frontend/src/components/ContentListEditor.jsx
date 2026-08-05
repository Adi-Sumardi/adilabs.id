import { useEffect, useState } from 'react';
import { contentListApi } from '../api/client';

// Reusable up/down-reorderable text-list CRUD editor, used for both the
// marquee "running text" items and the hero rotating words — same shape
// of data (list_type + text + sort_order), just a different `type` key.
export default function ContentListEditor({ type, itemLabel, placeholder }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newText, setNewText] = useState('');
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');

  async function load() {
    setLoading(true);
    setError('');
    try {
      setItems(await contentListApi.list(type));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [type]);

  async function handleAdd(e) {
    e.preventDefault();
    if (!newText.trim()) return;
    setAdding(true);
    setError('');
    try {
      await contentListApi.create(type, newText.trim());
      setNewText('');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setEditingText(item.text);
  }

  async function saveEdit(id) {
    if (!editingText.trim()) return;
    try {
      await contentListApi.update(type, id, editingText.trim());
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleMove(id, direction) {
    try {
      await contentListApi.move(type, id, direction);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm(`Hapus ${itemLabel.toLowerCase()} ini?`)) return;
    try {
      await contentListApi.remove(type, id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="panel">
      <h2>{itemLabel} ({items.length})</h2>
      {error && <div className="form-error">{error}</div>}

      <form className="inline-add-form" onSubmit={handleAdd}>
        <input
          type="text" value={newText} placeholder={placeholder} required
          onChange={(e) => setNewText(e.target.value)}
        />
        <button className="btn-save" type="submit" disabled={adding}>+ Tambah</button>
      </form>

      {loading && <p className="empty-hint">Memuat…</p>}
      {!loading && items.length === 0 && <p className="empty-hint">Belum ada {itemLabel.toLowerCase()}.</p>}

      <div className="reorder-list">
        {items.map((item, idx) => (
          <div className="reorder-row" key={item.id}>
            <div className="reorder-controls">
              <button disabled={idx === 0} onClick={() => handleMove(item.id, 'up')} title="Naikkan">↑</button>
              <button disabled={idx === items.length - 1} onClick={() => handleMove(item.id, 'down')} title="Turunkan">↓</button>
            </div>

            {editingId === item.id ? (
              <input
                type="text" className="reorder-edit-input" value={editingText} autoFocus
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id)}
              />
            ) : (
              <span className="reorder-text">{item.text}</span>
            )}

            <div className="row-actions">
              {editingId === item.id ? (
                <>
                  <button onClick={() => saveEdit(item.id)}>Simpan</button>
                  <button onClick={() => setEditingId(null)}>Batal</button>
                </>
              ) : (
                <button onClick={() => startEdit(item)}>Edit</button>
              )}
              <button className="danger" onClick={() => handleDelete(item.id)}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
