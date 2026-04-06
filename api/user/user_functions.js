/*Tier documentation:
0: Regular user
1: Administrator
*/
const db = require('../../connection.js');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

async function generate_session()
{
    let session_id = crypto.randomBytes(64).toString('hex');
    while (await _session_exists(session_id)) { //Assurance that two sessions may never collide.
        session_id = crypto.randomBytes(64).toString('hex'); 
    }
    return session_id;
}

async function _user_exists(username) {
    const [result] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    return result.length > 0;
}

async function _session_exists(session_id) {
    const [result] = await db.query('SELECT id FROM users WHERE session_id = ?', [session_id]);
    return result.length > 0;
}

async function is_admin(username) {
    const [result] = await db.query('SELECT tier FROM users WHERE username = ?', [username]);
    if (result.length === 0) {
        return false;
    }
    return result[0].tier === 1;
}

async function register(username, password) {
    if (await _user_exists(username)) {
        return { success: false, message: "Username already exists" };
    }
    const password_bcrypt = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password_bcrypt, tier) VALUES (?, ?, ?)', [username, password_bcrypt, 0]);
    return { success: true, message: "User registered successfully" };
}

async function login(username, password) {
    const [result] = await db.query('SELECT id, tier, password_bcrypt FROM users WHERE username = ?', [username]);
    if (result.length === 0) {
        return { success: false, message: "Invalid username or password" }; //Actual issue: username does not exist. Do not network.
    }

    const user = result[0];
    const match = await bcrypt.compare(password, user.password_bcrypt);

    if (!match) {
        return { success: false, message: "Invalid username or password" }; //Actual issue: password does not match. Do not network.
    }

    const session_id = await generate_session();

    await db.query('UPDATE users SET session_id = ? WHERE id = ?', [session_id, user.id]); //This will never fail, so I don't bother with error handling.

    return {
        success: true,
        message: "Login successful",
        session_id: session_id,
        tier: user.tier
    };
}

module.exports = {
    register,
    login,
    is_admin
};