/**
 * @file cart.js
 * @description Client-side shopping cart management using a global array and localStorage.
 */

/**
 * Global in-memory cart array shared across all client-side scripts.
 * @type {Array<{id: string|number, name: string, price: number, quantity: number}>}
 */
let cart = [];

/**
 * Adds an item to the cart. If the item already exists (matched by id), increments its quantity.
 * Persists the updated cart to localStorage.
 * @param {{id: string|number, name: string, price: number}} item - The item to add.
 * @returns {void}
 */
function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({...item, quantity: 1});
  }

  saveCart();
}

/**
 * Serializes the current cart to JSON and stores it in localStorage under the key `'cart'`.
 * @returns {void}
 */
function saveCart() {
  localStorage.setItem(
    'cart',
    JSON.stringify(cart)
  );
}

/**
 * Loads the cart from localStorage and populates the global `cart` array.
 * If no data is found, the cart remains empty.
 * @returns {void}
 */
function loadCart() {
  const data = JSON.parse(localStorage.getItem('cart')) || [];
  console.log('cart data from localstorage', data);
  cart.length = 0;
  cart.push(...data);
  console.log('cart loaded', cart);
}

/**
 * Empties the cart both in memory and in localStorage.
 * @returns {void}
 */
function emptyCart() {
  cart = [];
  localStorage.removeItem('cart');
}

/**
 * Increases the quantity of a cart item by 1. Saves and re-renders the cart.
 * @param {string|number} itemId - The id of the item to increment.
 * @returns {void}
 */
function addAnotherItemToCart(itemId) {
  const item = cart.find(i => i.id === itemId);
  if (item) {
    item.quantity += 1;
    saveCart();
    renderCart();
  }
}

/**
 * Decreases the quantity of a cart item by 1.
 * If the quantity reaches 0, the item is removed from the cart.
 * Saves and re-renders the cart.
 * @param {string|number} itemId - The id of the item to decrement.
 * @returns {void}
 */
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
