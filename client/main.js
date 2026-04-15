const nav = document.querySelector('nav');
const homeBtn = document.querySelector('#home');
const menuBtn = document.querySelector('#menu');
const restaurantsBtn = document.querySelector('#restaurants');
const loginBtn = document.querySelector('#log');
const infoBtn = document.querySelector('#info');

const page = document.querySelector('#page');

async function loadPageContent(content, target = page) {
  try {
    const response = await fetch(content);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    target.innerHTML = html;

    updateMenuGrid();

  } catch (error) {
    console.error('Error loading page:', error);
  }
}

function updateMenuGrid() {
  console.log('updateMenuGrid() called');

  const grid = document.querySelector('#menu-grid');
  if (!grid) return;

  grid.innerHTML = '';

  for (let i = 0; i < 30; i++) {
    grid.insertAdjacentHTML(
      'beforeend',
      `<div class="bg-[#679289] p-4 rounded-xl max-w-60 m-auto">
        <img src="img/bigmac.avif" class="max-w-50 m-auto" alt="item">
        <div class="text-white text-center">Item</div>
      </div>`
    );
  }
}

homeBtn.addEventListener('click', () => {
  loadPageContent('home.html');
});

menuBtn.addEventListener('click', () => {
  loadPageContent('menu.html');
});

infoBtn.addEventListener('click', () => {
  loadPageContent('info.html');
});

loadPageContent('home.html');