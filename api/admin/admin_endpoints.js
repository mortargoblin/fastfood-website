const admin_functions = require('./admin_functions.js');
const express = require('express');
const router = express.Router();

router.get('/products', async (req, res) => {
    const session_id = req.cookies.session_id;
    const result = await admin_functions.list_products(session_id);
    res.json(result);
});

router.post('/products', async (req, res) => {
    const session_id = req.cookies.session_id;
    const result = await admin_functions.create_product(session_id, req.body);
    res.json(result);
});

router.delete('/products/:id', async (req, res) => {
    const session_id = req.cookies.session_id;
    const result = await admin_functions.delete_product(session_id, req.params.id);
    res.json(result);
});

module.exports = router;
