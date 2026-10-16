import { useState } from 'react';
import { authApi } from '../api/client';

export default function ChangePasswordPanel() {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [status, setStatus] = useState(null); // { type: 'success'|'error', msg: string }
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setStatus(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus(null);

    if (form.next !== form.confirm) {
      setStatus({ type: 'error', msg: 'Password baru dan konfirmasi tidak cocok.' });
      return;
    }
    if (form.next.length < 8) {
      setStatus({ type: 'error', msg: 'Password baru minimal 8 karakter.' });
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(form.current, form.next);
      setStatus({ type: 'success', msg: 'Password berhasil diubah!' });
      setForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel-page">
      <div className="panel-header">
        <h2>Ganti Password</h2>
        <p className="panel-sub">Ubah password akun admin Anda.</p>
      </div>

      <form className="cp-form" onSubmit={handleSubmit}>
        {status && (
          <div className={`cp-alert cp-alert--${status.type}`}>
            {status.type === 'success' ? '✓ ' : '✕ '}
            {status.msg}
          </div>
        )}

        <div className="cp-field">
          <label htmlFor="current">Password Sekarang</label>
          <input
            id="current"
            name="current"
            type="password"
            required
            autoComplete="current-password"
            value={form.current}
            onChange={handleChange}
            placeholder="Masukkan password lama"
          />
        </div>

        <div className="cp-field">
          <label htmlFor="next">Password Baru</label>
          <input
            id="next"
            name="next"
            type="password"
            required
            autoComplete="new-password"
            value={form.next}
            onChange={handleChange}
            placeholder="Minimal 8 karakter"
          />
        </div>

        <div className="cp-field">
          <label htmlFor="confirm">Konfirmasi Password Baru</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            required
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
            placeholder="Ulangi password baru"
          />
        </div>

        <button className="cp-submit" type="submit" disabled={loading}>
          {loading ? 'Menyimpan…' : 'Simpan Password'}
        </button>
      </form>

      <style>{`
        .cp-form {
          max-width: 420px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 24px;
        }
        .cp-alert {
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
        }
        .cp-alert--success {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }
        .cp-alert--error {
          background: #fee2e2;
          color: #991b1b;
          border: 1px solid #fca5a5;
        }
        .cp-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .cp-field label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }
        .cp-field input {
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }
        .cp-field input:focus {
          border-color: #3b82f6;
        }
        .cp-submit {
          padding: 11px 24px;
          background: #1d4ed8;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
          align-self: flex-start;
        }
        .cp-submit:hover:not(:disabled) {
          background: #1e40af;
        }
        .cp-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
