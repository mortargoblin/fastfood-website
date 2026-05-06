const nav = document.querySelector('nav');
const homeBtn = document.querySelector('#home');
const menuBtn = document.querySelector('#menu');
const restaurantsBtn = document.querySelector('#restaurants');
const authBtn = document.querySelector('#auth');
const infoBtn = document.querySelector('#info');
const adminBtn = document.querySelector('#admin');

const page = document.querySelector('#page');

async function getQueryParam(name)
{
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

async function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function loadPageContent(content, target = page) {
  try {
    const response = await fetch(content);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    target.innerHTML = html;

    const event = new CustomEvent('dynamicPageLoad', { detail: { content } });
    document.dispatchEvent(event);

  } catch (error) {
    console.error('Error loading page:', error);
  }
}

let _GLOBAL_MENU_ALREADY_SETUP = false;
async function load()
{
  if (_GLOBAL_MENU_ALREADY_SETUP) return;
  _GLOBAL_MENU_ALREADY_SETUP = true;
  homeBtn.addEventListener('click', () => {
    loadPageContent('home.html');
  });

  menuBtn.addEventListener('click', () => {
    loadPageContent('menu.html');
    console.log('Menu button clicked, loading menu.html');
    updateMenuItems();
  });

  infoBtn.addEventListener('click', () => {
    loadPageContent('info.html');
  });
  authBtn.addEventListener('click', () => {
    loadPageContent('auth.html');
  });
  adminBtn.addEventListener('click', () => {
    loadPageContent('admin.html');
  });
  if (await getCookie("clientside_tier") === "1") {
    adminBtn.style.visibility = "visible"; //This is clientside only, all validation is still done on the server.
  }
}

function renderCart() {
  const cartEl = document.getElementById("cart-dialog");
  cartEl.innerHTML = "";

  // accessing global variable "cart" astaghfirullah 🛐
  cart.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} x${item.quantity}`;
    cartEl.appendChild(div);
  });
}

// cart dialog 
const cartBtn = document.getElementById("cart-btn");
const dialog = document.getElementById("cart-dialog");
const closeBtn = document.getElementById("close-cart");

cartBtn.addEventListener("click", () => {
  renderCart();
  dialog.showModal();
});

closeBtn.addEventListener("click", () => {
  dialog.close();
});

function renderCart() {
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  itemsEl.innerHTML = '';

  let total = 0;

  console.log('cart from renderer', cart);
  cart.forEach(item => {
    const tr = document.createElement('tr');
    tr.classList.add('text-center');
    
    tr.innerHTML = `
      <td>${item.name}</td>

      <td class="qty-controls">
        <button data-id="${item.id}" onclick="removeItemFromCart(this.dataset.id)" data-action="decrease">−</button>
        <span>${item.quantity}</span>
        <button data-id="${item.id}" onclick="addAnotherItemToCart(this.dataset.id)" data-action="increase">+</button>
      </td>

      <td>€${(item.price * item.quantity).toFixed(2)}</td>
    `;

    itemsEl.appendChild(tr);
    total += item.price * item.quantity;
  });

  totalEl.textContent = `Total: ${total.toFixed(2)}€`;
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

load();
loadPageContent('home.html');
