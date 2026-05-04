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

async function load()
{
  homeBtn.addEventListener('click', () => {
    loadPageContent('home.html');
  });

  menuBtn.addEventListener('click', () => {
    loadPageContent('menu.html');
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
  document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: Number(btn.dataset.price)
      };
      console.log(btn.dataset);
      console.log(item);

      addToCart(item);
      renderCart();
    })
  });

  if (await getCookie("clientside_tier") === "1") {
    adminBtn.style.visibility = "visible";
  }
}

function renderCart() {
  const cartEl = document.getElementById("cart-container");
  cartEl.innerHTML = "";

  // accessing global variable "cart" astaghfirullah 🛐
  cart.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.name} x${item.quantity}`;
    cartEl.appendChild(div);
  });
}

load();
loadPageContent('home.html');
