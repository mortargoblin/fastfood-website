async function fetchMenuItems() {
  try {
    const response = await fetch('/api/provider/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const items = await response.json();
    console.log('Fetched menu items:', items);
    return items.products;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return [];
  }
}

async function updateMenuItems() {
  console.log('updateMenuItems() called');

  const items = await fetchMenuItems();
  const grid = document.querySelector('#menu-grid');
  if (!grid) return;

  grid.innerHTML = '';

  for (let i = 0; i < items.length; i++) {
    grid.insertAdjacentHTML(
      'beforeend',
      `<div class="bg-[#679289] p-4 rounded-xl max-w-60 m-auto text-center">
        <img src="${items[i].image_url}" class="max-w-50 m-auto" alt="item">
        <div class="text-white text-center text-2xl font-bold">${items[i].name.toUpperCase()}</div>
        <p class="text-center">${items[i].description}</p>
        <div class="text-center font-bold">${items[i].price}€</div>
        <button  class="add-to-cart cursor-pointer hover:font-bold"
        data-id=${items[i].id} data-name='${items[i].name}' data-price=${items[i].price}
        >Lisää ostoskoriin</button>
      </div>`
    );
  }
}
