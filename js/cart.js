// 購物車邏輯（localStorage，每個帳號獨立）

let CART_KEY = 'krsu_cart_guest';

// 登入後呼叫此函式，切換到該帳號的購物車
function setCartUser(uid) {
  CART_KEY = uid ? `krsu_cart_${uid}` : 'krsu_cart_guest';
}

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// product 可附帶 variantId / variantName / imageUrl
function addToCart(product, qty = 1) {
  const cart = getCart();
  const vid = product.variantId || null;
  const idx = cart.findIndex(i => i.id === product.id && (i.variantId || null) === vid);
  if (idx > -1) {
    cart[idx].qty += qty;
  } else {
    cart.push({
      id: product.id,
      variantId: vid,
      variantName: product.variantName || null,
      name: product.name,
      price: product.salePrice ?? product.price ?? 0,
      imageUrl: product.imageUrl || '',
      stock: product.stock ?? 999,
      qty
    });
  }
  saveCart(cart);
}

function removeFromCart(id, variantId) {
  const vid = variantId || null;
  saveCart(getCart().filter(i => !(i.id === id && (i.variantId || null) === vid)));
}

function updateCartQty(id, qty, variantId) {
  const vid = variantId || null;
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id && (i.variantId || null) === vid);
  if (idx > -1) {
    if (qty <= 0) cart.splice(idx, 1);
    else cart[idx].qty = qty;
  }
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}

function getCartCount() {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

function loadCartCount() {
  const el = document.getElementById('cart-count');
  if (el) el.textContent = getCartCount();
}
