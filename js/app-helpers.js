const auth    = firebase.auth();
const db      = firebase.firestore();
const storage = typeof firebase.storage === 'function' ? firebase.storage() : null;

function getCurrentUser() {
  return new Promise((resolve) => {
    const unsub = auth.onAuthStateChanged(user => { unsub(); resolve(user); });
  });
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function safeImgSrc(url) {
  if (!url) return '';
  if (/^data:image\//i.test(url)) return url;
  return /^https:\/\//i.test(url) ? escapeHtml(url) : '';
}

const STORE_NAME_KEY = 'reyi_ep_store_name';
let _storeName = localStorage.getItem(STORE_NAME_KEY) || '';

(function() {
  if (_storeName) {
    document.querySelectorAll('.store-name-el').forEach(el => { el.textContent = _storeName; });
  }
})();

async function applyStoreName(titleSuffix) {
  try {
    const snap = await db.collection('settings').doc('general').get();
    const fetched = (snap.exists && snap.data().storeName) ? snap.data().storeName : '';
    if (fetched !== _storeName) { _storeName = fetched; localStorage.setItem(STORE_NAME_KEY, _storeName); }
  } catch(e) { if (!_storeName) _storeName = ''; }
  document.querySelectorAll('.store-name-el').forEach(el => { el.textContent = _storeName; });
  if (titleSuffix !== undefined) document.title = _storeName + (titleSuffix || '');
}

function formatPrice(n) {
  return 'NT$ ' + Number(n).toLocaleString('zh-TW');
}

function formatDate(ts) {
  if (!ts) return '-';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('zh-TW');
}
