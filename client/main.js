/**
 * @file main.js
 * @description Main client-side script. Handles SPA-style navigation, cart dialog,
 * map modal, Swiper testimonial carousel, and auth state display.
 */

const nav = document.querySelector('nav');
const homeBtn = document.querySelector('#home');
const menuBtn = document.querySelector('#menu');
const restaurantsBtn = document.querySelector('#restaurants');
const authBtn = document.querySelector('#auth');
const adminBtn = document.querySelector('#admin');

const page = document.querySelector('#page');

/**
 * Reads a query parameter from the current URL.
 * @param {string} name - The query parameter name.
 * @returns {Promise<string|null>} The parameter value, or `null` if not present.
 */
async function getQueryParam(name)
{
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

/**
 * Reads a cookie value by name from `document.cookie`.
 * @param {string} name - The cookie name.
 * @returns {Promise<string|undefined>} The cookie value, or `undefined` if not set.
 */
async function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

/**
 * Fetches an HTML page and injects it into the target element.
 * Scrolls to the top of the page and dispatches a `dynamicPageLoad` custom event
 * so other scripts can initialize themselves after the new content is loaded.
 * @param {string} content - The URL/path of the HTML partial to load.
 * @param {Element} [target=page] - The DOM element to inject the fetched HTML into.
 * @returns {Promise<void>}
 */
async function loadPageContent(content, target = page) {
  try {
    const response = await fetch(content);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    window.scrollTo({ top: 0, behavior: 'instant' });
    target.innerHTML = html;

    const event = new CustomEvent('dynamicPageLoad', { detail: { content } });
    document.dispatchEvent(event);

  } catch (error) {
    console.error('Error loading page:', error);
  }
}

let _GLOBAL_MENU_ALREADY_SETUP = false;
/**
 * Sets up nav button click handlers and initializes auth state display.
 * Guards against multiple invocations with `_GLOBAL_MENU_ALREADY_SETUP`.
 * @returns {Promise<void>}
 */
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

  restaurantsBtn.addEventListener('click', () => {
    loadPageContent('ravintolat.html');
  });

  authBtn.addEventListener('click', async () => {
    const username = await getCookie("clientside_username");
    if (username) {
      await fetch('/api/user/logout', { method: 'POST' });
      updateAuthNav();
      loadPageContent('home.html');
    } else {
      loadPageContent('auth.html');
    }
  });
  adminBtn.addEventListener('click', () => {
    loadPageContent('admin.html');
  });
  if (await getCookie("clientside_tier") === "1") {
    adminBtn.style.visibility = "visible";
  }
  updateAuthNav();
}

/**
 * Updates the auth/logout nav button label based on whether the user is logged in.
 * Shows the username and a logout hint when logged in, otherwise shows "Kirjaudu".
 * @returns {Promise<void>}
 */
async function updateAuthNav() {
  const username = await getCookie("clientside_username");
  if (username) {
    authBtn.innerHTML = `<span class="flex items-center gap-1">👤 <span class="max-w-24 truncate">${username}</span> <span class="text-xs opacity-70 font-normal">(kirjaudu ulos)</span></span>`;
  } else {
    authBtn.textContent = 'Kirjaudu';
  }
}

// cart dialog 
const cartBtn = document.getElementById("cart-btn");
const dialog = document.getElementById("cart-dialog");
const closeBtn = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");

cartBtn.addEventListener('click', () => {
  renderCart();
  dialog.showModal();
});

closeBtn.addEventListener('click', () => {
  dialog.close();
});

checkoutBtn.addEventListener('click', () => {
  checkout();
});

/**
 * Renders the current cart into the `#cart-items` table and updates the total price display.
 * @returns {void}
 */
function renderCart() {
  const itemsEl = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  itemsEl.innerHTML = '';

  let total = 0;

  console.log('cart', cart);
  // accessing global variable "cart" astaghfirullah 🛐
  cart.forEach(item => {
    const tr = document.createElement('tr');
    tr.classList.add('text-center');
    
    tr.innerHTML = `
      <td>${item.name}</td>

      <td class="qty-controls">
        <button data-id="${item.id}" 
        onclick="removeItemFromCart(this.dataset.id)" 
        data-action="decrease" class="px-2">−</button>
        <span>${item.quantity}</span>
        <button data-id="${item.id}" 
        onclick="addAnotherItemToCart(this.dataset.id)" 
        data-action="increase" class="px-2">+</button>
      </td>

      <td>€${(item.price * item.quantity).toFixed(2)}</td>
    `;

    itemsEl.appendChild(tr);
    total += item.price * item.quantity;
  });

  totalEl.textContent = `Total: ${total.toFixed(2)}€`;
  cart.total = total;
}

/**
 * Submits the current cart as an order to the server.
 * Requires the user to be logged in (checks `logged_in` cookie).
 * On success, empties the cart, closes the dialog, and shows a toast notification.
 * @returns {Promise<void>}
 */
async function checkout() {
  const loggedInCookie = await getCookie('logged_in');

  if (!loggedInCookie) {
    document.querySelector('#cart-total')
      .textContent = 'Sinun tulee olla kirjautuneena sisään tilausta varten';
  } else {
    const response = await fetch('api/user/create_order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cart
      })
    });

    const result = await response.json();
    console.log('CHECKOUT RESULT', result);

    emptyCart();
    dialog.close();

    Toastify({
      text: 'Order succesful',
      gravity: 'bottom',
      position: 'center',
      style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
      },
      onClick: function() {}
    }).showToast();
  }
}

/**
 * Opens the Google Maps modal for a given location query string.
 * @param {string} query - The location/address to search on Google Maps.
 * @returns {void}
 */
function openMap(query) {
  const modal = document.getElementById('map-modal');
  const iframe = document.getElementById('map-iframe');
  iframe.src = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed&hl=fi`;
  modal.showModal();
}

document.getElementById('map-modal-close').addEventListener('click', () => {
  document.getElementById('map-modal').close();
  document.getElementById('map-iframe').src = '';
});

document.getElementById('map-modal').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) {
    e.currentTarget.close();
    document.getElementById('map-iframe').src = '';
  }
});


setTimeout(() => {
  const swiper = new Swiper('.testimonial__swiper', {
    loop: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 16,
    grabCursor: true,
    speed: 600,
    effect: 'coverflow',
    coverflowEffect: {
      rotate: -90,
      depth: 600,
      modifier: .5,
      slideShadows: false,
    },

    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  })

  console.log('Slides loaded:', swiper.slides.length)
}, 1000);


load();
loadPageContent('home.html');
