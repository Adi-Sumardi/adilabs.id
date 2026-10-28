// Setelah `vite build`: buat HTML per URL dengan metadata sendiri (title, description, canonical,
// og:*, twitter:*, teks noscript), supaya crawler & pratinjau link membaca identitas halaman
// tanpa menunggu JavaScript. Server (.htaccess) menyajikan file ini untuk URL-nya masing-masing.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SOLUTIONS } from '../src/pages/solusi/data.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const base = readFileSync(join(root, 'index.html'), 'utf8');
const esc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const pages = [
  ...Object.values(SOLUTIONS).map((s) => ({
    file: s.path ? `${s.path.slice(1)}.html` : `solusi/${s.slug}.html`, path: s.path || `/solusi/${s.slug}`, title: s.title, desc: s.desc,
    body: `<h1>${esc(s.h1)}</h1><p>${esc(s.lead)}</p>`,
  })),
  {
    file: 'kebijakan-privasi.html', path: '/kebijakan-privasi', title: 'Kebijakan Privasi | AdiLabs',
    desc: 'Bagaimana AdiLabs mengumpulkan, memakai, dan menjaga data saat Anda mengunjungi situs atau menghubungi kami.',
    body: '<h1>Kebijakan Privasi</h1><p>Bagaimana AdiLabs mengumpulkan, memakai, dan menjaga data saat Anda mengunjungi situs atau menghubungi kami.</p>',
  },
];

function swap(html, re, value, label) {
  if (!re.test(html)) throw new Error(`prerender-meta: pola "${label}" tidak ditemukan di index.html`);
  return html.replace(re, value);
}

for (const p of pages) {
  const url = `https://adilabs.id${p.path}`, t = esc(p.title), d = esc(p.desc);
  let h = base;
  h = swap(h, /<title>[^<]*<\/title>/, `<title>${t}</title>`, 'title');
  h = swap(h, /(<meta name="description" content=")[^"]*(")/, `$1${d}$2`, 'description');
  h = swap(h, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`, 'canonical');
  h = swap(h, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`, 'og:url');
  h = swap(h, /(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`, 'og:title');
  h = swap(h, /(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`, 'og:description');
  h = swap(h, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`, 'twitter:title');
  h = swap(h, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`, 'twitter:description');
  h = swap(h, /<noscript>[\s\S]*?<\/noscript>/, `<noscript>\n      ${p.body}\n      <p><a href="https://adilabs.id/">Kembali ke beranda AdiLabs</a></p>\n    </noscript>`, 'noscript');
  const out = join(root, p.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, h);
  console.log('prerender-meta:', p.file);
}
