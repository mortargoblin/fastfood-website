// I <3 GLOBAL VARIABLES
let cart = [];

function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...item, quantity: 1});
  }

  saveCart();
}

function saveCart() {
  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );
}

function loadCart() {
  const data = JSON.parse(localStorage.getItem('cart')) || [];
  console.log('cart data from localstorage', data);
  cart.length = 0;
  cart.push(...data);
  console.log('cart loaded', cart);
}

function emptyCart() {
  localStorage.removeItem('cart');
}

function addAnotherItemToCart(itemId) {
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity += 1;
    saveCart();
    renderCart();
  }
}

function removeItemFromCart(itemId) {
  const itemIndex = cart.findIndex(i => i.id === itemId);
  if (itemIndex > -1) {
    cart[itemIndex].quantity -= 1;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }
    saveCart();
    renderCart();
  }
}
