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
  cart.length = 0;
  cart.push(data);
}

