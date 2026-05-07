const user_functions = require('./user_functions.js');
const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const result = await user_functions.register(username, password);
    res.json(result);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const result = await user_functions.login(username, password);
    if (result.success) {
        res.cookie('session_id', result.session_id, { httpOnly: true });
        res.cookie("clientside_tier", result.tier, { httpOnly: false });
        res.cookie("clientside_username", result.username, { httpOnly: false });
    }
    res.json(result);
});

router.post('/logout', (req, res) => {
    res.clearCookie('session_id');
    res.clearCookie('clientside_tier');
    res.clearCookie('clientside_username');
    res.json({ success: true });
});

router.post('/create_order', async (req, res) => {

    const { username, cart } = req.body;

    const result = await user_functions.create_order(
        username,
        cart
    );

    res.json(result);
});

module.exports = router;
