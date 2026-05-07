/**
 * @file provider_functions.js
 * @description Public-facing business logic for product listing (no auth required).
 */
const db = require('../../connection.js');

/**
 * Retrieves all products from the database, ordered by id descending.
 * Normalizes the product name from possible alternate column names.
 * @returns {Promise<{success: boolean, products: Array<object>}>} Result object with product list.
 */
async function list_products() {
    const [result] = await db.query('SELECT * FROM products ORDER BY id DESC');
    const normalizedProducts = result.map((product) => ({
        ...product,
        name: product.name ?? product.product_name ?? product.title ?? null
    }));
    return { success: true, products: normalizedProducts };
}

module.exports = {
    list_products
};
