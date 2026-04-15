const db = require('../../connection.js');

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
