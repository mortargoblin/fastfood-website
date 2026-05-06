const admin_functions = require('./admin_functions.js');
const express = require('express');
const router = express.Router();

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

router.put('/products/:id', async (req, res) => {
    const session_id = req.cookies.session_id;
    const result = await admin_functions.update_product(session_id, req.params.id, req.body);
    res.json(result);
});

module.exports = router;
