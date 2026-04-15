async function updateAdminStatus(message) {
    const statusElement = document.getElementById('admin-message');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

function productDisplayName(product) {
    return product.name ?? product.product_name ?? product.title ?? `#${product.id}`;
}

function productDisplayPrice(product) {
    if (product.price !== undefined && product.price !== null) {
        return ` (${product.price})`;
    }
    return '';
}

async function loadProducts() {
    const response = await fetch('/api/admin/products');
    const result = await response.json();
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
            const deleteResponse = await fetch(`/api/admin/products/${product.id}`, {
                method: 'DELETE'
            });
            const deleteResult = await deleteResponse.json();
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

            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, price, description })
            });

            const result = await response.json();
            updateAdminStatus(result.message);
            if (result.success) {
                createProductForm.reset();
                await loadProducts();
            }
        });
    }

    loadProducts();
});
