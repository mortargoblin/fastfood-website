
const nav = document.querySelector('nav');
const menuBtn = document.querySelector('#menu');
const restaurantsBtn = document.querySelector('#restaurants');
const loginBtn = document.querySelector('#log');
const infoBtn = document.querySelector('#info');

const page = document.querySelector('#page');

function loadPageContent(content, target=page) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', content, true);
  xhr.onreadystatechange = (e) => {
    if (xhr.readyState === 4 && xhr.status === 200) {
      target.innerHTML = xhr.responseText;
    } else {
      console.log('wtf', xhr.readyState, this.status)
    }
    console.log(e);
  };
  xhr.send();
}

menuBtn.addEventListener('click', () => {
  loadPageContent('menu.html');
});

infoBtn.addEventListener('click', () => {

  page.innerHTML = '<h1>kaskdakskdka</h1>'
});
