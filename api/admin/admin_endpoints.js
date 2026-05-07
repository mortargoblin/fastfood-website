/**
 * @file admin_endpoints.js
 * @description Express router for admin-only API endpoints (products CRUD, orders listing).
 * All state-changing routes are protected by a CSRF origin/referer check middleware.
 */
const admin_functions = require('./admin_functions.js');
const express = require('express');
const router = express.Router();

/**
 * Normalizes a URL by converting to lowercase and stripping trailing slashes.
 * @param {string} url - The URL string to normalize.
 * @returns {string} The normalized URL, or an empty string if `url` is falsy.
 */
function normalizeUrl(url) {
    if (!url) {
        return '';
    }
    let normalized = url.toLowerCase();
    while (normalized.endsWith('/')) {
        normalized = normalized.slice(0, -1);
    }
    return normalized;
}

/**
 * CSRF protection middleware.
 * Allows GET, HEAD, and OPTIONS through without checks.
 * For all other methods, validates that the `Origin` or `Referer` header matches the server host.
 * Responds with 403 if validation fails.
 */
router.use((req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
        return next();
    }

    const host = normalizeUrl(`${req.protocol}://${req.get('host')}`);
    const origin = normalizeUrl(req.get('origin'));
    const referer = normalizeUrl(req.get('referer'));

    if ((origin && origin === host) || (referer && referer.startsWith(host))) {
        return next();
    }

    return res.status(403).json({ success: false, message: 'CSRF validation failed' });
});

/**
 * GET /api/admin/products
 * Lists all products. Requires an admin session cookie.
 * @name AdminListProducts
 */
router.get('/products', async (req, res) => {
    const session_id = req.cookies.session_id;
    const result = await admin_functions.list_products(session_id);
    res.json(result);
});

/**
 * POST /api/admin/products
 * Creates a new product. Requires an admin session cookie.
 * @name AdminCreateProduct
 */
router.post('/products', async (req, res) => {
    const session_id = req.cookies.session_id;
    const result = await admin_functions.create_product(session_id, req.body);
    res.json(result);
});

/**
 * DELETE /api/admin/products/:id
 * Deletes a product by ID. Requires an admin session cookie.
 * @name AdminDeleteProduct
 * @param {string} req.params.id - The product ID.
 */
router.delete('/products/:id', async (req, res) => {
    const session_id = req.cookies.session_id;
    const result = await admin_functions.delete_product(session_id, req.params.id);
    res.json(result);
});

/**
 * PUT /api/admin/products/:id
 * Updates a product by ID. Requires an admin session cookie.
 * @name AdminUpdateProduct
 * @param {string} req.params.id - The product ID.
 */
router.put('/products/:id', async (req, res) => {
    const session_id = req.cookies.session_id;
    const result = await admin_functions.update_product(session_id, req.params.id, req.body);
    res.json(result);
});

/**
 * GET /api/admin/orders
 * Lists all orders. Requires an admin session cookie.
 * @name AdminListOrders
 */
router.get('/orders', async (req, res) => {
    const session_id = req.cookies.session_id;
    const result = await admin_functions.list_orders(session_id);
    res.json(result);
});

module.exports = router;
