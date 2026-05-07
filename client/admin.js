/**
 * @file admin.js
 * @description Client-side admin panel logic: product listing, creation, editing, and deletion.
 * Listens for the `dynamicPageLoad` event to initialize when `admin.html` is loaded.
 */

/**
 * Updates the status message element on the admin page.
 * @param {string} message - The message to display in `#admin-message`.
 * @returns {Promise<void>}
 */
async function updateAdminStatus(message) {
    const statusElement = document.getElementById('admin-message');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

/**
 * Safely parses a JSON response from a fetch `Response` object.
 * Falls back to a generic error payload if parsing fails or the response is not OK.
 * @param {Response} response - The fetch API response object.
 * @returns {Promise<{success: boolean, message: string, [key: string]: any}>} Parsed payload.
 */
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

/**
 * Performs a fetch request and returns a parsed JSON payload.
 * Returns a network error payload if the request itself throws.
 * @param {string} url - The request URL.
 * @param {RequestInit} [options={}] - Optional fetch options (method, headers, body, etc.).
 * @returns {Promise<{success: boolean, message: string, [key: string]: any}>} Parsed response payload.
 */
async function apiRequest(url, options = {}) {
    try {
        const response = await fetch(url, options);
        return await parseResponse(response);
    } catch {
        return { success: false, message: 'Network error' };
    }
}

/**
 * Returns the display name of a product. Falls back to `#<id>` if name is not set.
 * @param {{id: number, name?: string}} product - The product object.
 * @returns {string} The display name.
 */
function productDisplayName(product) {
    return product.name ?? `#${product.id}`;
}

/**
 * Returns a formatted price string for a product, e.g. ` (9.99)`.
 * Returns an empty string if price is not set.
 * @param {{price?: number}} product - The product object.
 * @returns {string} Formatted price or empty string.
 */
function productDisplayPrice(product) {
    if (product.price !== undefined && product.price !== null) {
        return ` (${product.price})`;
    }
    return '';
}

/**
 * Fetches all products from the admin API and renders them as a list in `#product-list`.
 * Each list item includes Edit and Delete action buttons.
 * @returns {Promise<void>}
 */
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

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
            const newName = prompt('Enter new name, leave blank to keep current:', product.name);
            const newPrice = prompt('Enter new price, leave blank to keep current:', product.price);
            const newDescription = prompt('Enter new description, leave blank to keep current:', product.description);
            const newImageUrl = prompt('Enter new image URL, leave blank to keep current:', product.image_url);

            const updateData = {};
            if (newName !== null && newName.trim() !== '') {
                updateData.name = newName.trim();
            }
            if (newPrice !== null && newPrice.trim() !== '') {
                updateData.price = newPrice.trim();
            }
            if (newDescription !== null && newDescription.trim() !== '') {
                updateData.description = newDescription.trim();
            }
            if (newImageUrl !== null && newImageUrl.trim() !== '') {
                updateData.image_url = newImageUrl.trim();
            }

            apiRequest(`/api/admin/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'                },
                body: JSON.stringify(updateData)
            }).then(updateResult => {
                updateAdminStatus(updateResult.message);
                if (updateResult.success) {
                    loadProducts();
                }
            });
        });



        item.appendChild(editButton);
        item.appendChild(document.createTextNode(' | '));
        item.appendChild(deleteButton);
        productList.appendChild(item);
    }
}

/**
 * Listens for the `dynamicPageLoad` custom event.
 * When `admin.html` is loaded, wires up the create-product form and loads the product list.
 */
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
            const allergens = document.getElementById('product_allergens').value

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
