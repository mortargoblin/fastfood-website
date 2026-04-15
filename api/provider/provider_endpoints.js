const provider_functions = require('./provider_functions.js');
const express = require('express');
const router = express.Router();

router.get('/products', async (req, res) => {
    const result = await provider_functions.list_products();
    res.json(result);
});

module.exports = router;
