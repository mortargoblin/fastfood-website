
const nav = document.querySelector('nav');
const homeBtn = document.querySelector('#home');
const menuBtn = document.querySelector('#menu');
const restaurantsBtn = document.querySelector('#restaurants');
const loginBtn = document.querySelector('#log');
const infoBtn = document.querySelector('#info');

const page = document.querySelector('#page');

function loadPageContent(content, target=page, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', content, true);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      target.innerHTML = xhr.responseText;

      if (callback) callback();
    }
  };
  xhr.send();
}

function updateMenuGrid() {
  console.log('updateMenuGrid() called')

  const grid = document.querySelector('#menu-grid')
  grid.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    grid.insertAdjacentHTML('beforeend', 
      `<div class="bg-[#679289] p-4 rounded-xl">
        <img src="img/bigmac.avif">
        item
      </div>`
    );
  }
}
homeBtn.addEventListener('click', () => {
  loadPageContent('home.html', page, updateMenuGrid);
});

menuBtn.addEventListener('click', () => {
  loadPageContent('menu.html', page, updateMenuGrid);
});

infoBtn.addEventListener('click', () => {
  page.innerHTML = '<h1>kaskdakskdka</h1>'
});


loadPageContent('home.html', page, updateMenuGrid);
