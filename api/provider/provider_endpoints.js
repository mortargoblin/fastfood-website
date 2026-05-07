/**
 * @file provider_endpoints.js
 * @description Express router for public provider API endpoints (no auth required).
 */
const provider_functions = require('./provider_functions.js');
const express = require('express');
const router = express.Router();

/**
 * GET /api/provider/products
 * Returns all products. No authentication required.
 * @name ProviderListProducts
 */
router.get('/products', async (req, res) => {
    const result = await provider_functions.list_products();
    res.json(result);
});

module.exports = router;
