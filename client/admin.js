async function updateAdminStatus(message) {
    const statusElement = document.getElementById('admin-message');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

async function parseResponse(response) {
    let payload;
    try {
        payload = await response.json();
    } catch {
        payload = { success: false, message: 'Invalid server response' };
    }

    if (!response.ok && !payload.message) {
        payload.message = `Request failed (${response.status})`;
    }

    return payload;
}

async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        return await parseResponse(response);
    } catch {
        return { success: false, message: 'Network error' };
    }
}

function productDisplayName(product) {
    return product.name ?? `#${product.id}`;
}

function productDisplayPrice(product) {
    if (product.price !== undefined && product.price !== null) {
        return ` (${product.price})`;
    }
    return '';
}

async function loadProducts() {
    const result = await apiRequest('/api/admin/products');
    if (!result.success) {
        updateAdminStatus(result.message || 'Failed to load products');
        return;
    }

    const productList = document.getElementById('product-list');
    if (!productList) {
        return;
    }

    productList.innerHTML = '';
    for (const product of result.products) {
        const item = document.createElement('li');
        item.textContent = `${productDisplayName(product)}${productDisplayPrice(product)} `;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', async () => {
            const deleteResult = await apiRequest(`/api/admin/products/${product.id}`, {
                method: 'DELETE'
            });
            updateAdminStatus(deleteResult.message);
            if (deleteResult.success) {
                await loadProducts();
            }
        });

        item.appendChild(deleteButton);
        productList.appendChild(item);
    }
}

document.addEventListener('dynamicPageLoad', (event) => {
    if (!event.detail.content.includes('admin.html')) {
        return;
    }

    const createProductForm = document.getElementById('create-product-form');
    if (createProductForm) {
        createProductForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('product_name').value;
            const price = document.getElementById('product_price').value;
            const description = document.getElementById('product_description').value;
            const imageUrl = document.getElementById('product_image_url').value;

            const result = await apiRequest('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, price, description, image_url: imageUrl })
            });
            updateAdminStatus(result.message);
            if (result.success) {
                createProductForm.reset();
                await loadProducts();
            }
        });
    }

    loadProducts();
});
