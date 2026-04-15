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

    updateMenuGrid();

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
    adminBtn.style.visibility = "visible";
  }
}
load();
loadPageContent('home.html');
