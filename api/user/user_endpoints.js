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
    }
    res.json(result); //
});

module.exports = router;