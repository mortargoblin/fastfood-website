/**
 * @file user_endpoints.js
 * @description Express router for public user-facing API endpoints (register, login, logout, create_order).
 */
const user_functions = require('./user_functions.js');
const express = require('express');
const router = express.Router();

/**
 * POST /api/user/register
 * Registers a new user account.
 * @name RegisterUser
 * @param {string} req.body.username
 * @param {string} req.body.password
 */
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const result = await user_functions.register(username, password);
    res.json(result);
});

/**
 * POST /api/user/login
 * Authenticates a user and sets session/tier/username cookies on success.
 * @name LoginUser
 * @param {string} req.body.username
 * @param {string} req.body.password
 */
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

/**
 * POST /api/user/logout
 * Clears all session-related cookies, effectively logging the user out.
 * @name LogoutUser
 */
router.post('/logout', (req, res) => {
    res.clearCookie('session_id');
    res.clearCookie('clientside_tier');
    res.clearCookie('clientside_username');
    res.json({ success: true });
});

/**
 * POST /api/user/create_order
 * Creates an order for the currently authenticated user using their session cookie.
 * @name CreateOrder
 * @param {Array} req.body.cart - Array of cart item objects.
 */
router.post('/create_order', async (req, res) => {

    const session_id = req.cookies.session_id;
    console.log('endpoint session id', session_id);
    const { cart } = req.body;
    
    const result = await user_functions.create_order(
        session_id,
        cart
    );

    res.json(result);
});

module.exports = router;
