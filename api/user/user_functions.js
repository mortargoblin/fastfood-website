/**
 * @file user_functions.js
 * @description Business logic for user authentication and order management.
 *
 * User tier levels:
 * - 0: Regular user
 * - 1: Administrator
 */
const db = require('../../connection.js');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

/**
 * Generates a unique session ID using 64 cryptographically random bytes.
 * Loops until a session ID that does not already exist in the database is found.
 * @returns {Promise<string>} A unique hex session token.
 */
async function generate_session()
{
    let session_id = crypto.randomBytes(64).toString('hex');
    while (await _session_exists(session_id)) { //Assurance that two sessions may never collide.
        session_id = crypto.randomBytes(64).toString('hex'); 
    }
    return session_id;
}

/**
 * Checks whether a username is already registered.
 * @param {string} username - The username to look up.
 * @returns {Promise<boolean>} `true` if the user exists, `false` otherwise.
 */
async function _user_exists(username) {
    const [result] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    return result.length > 0;
}

/**
 * Checks whether a session ID is currently assigned to any user.
 * @param {string} session_id - The session token to look up.
 * @returns {Promise<boolean>} `true` if the session exists, `false` otherwise.
 */
async function _session_exists(session_id) {
    const [result] = await db.query('SELECT id FROM users WHERE session_id = ?', [session_id]);
    return result.length > 0;
}

/**
 * Retrieves basic user information (id, username, tier) for an active session.
 * @param {string} session_id - The session token.
 * @returns {Promise<{id: number, username: string, tier: number}|null>} The user object, or `null` if not found.
 */
async function _get_user_by_session(session_id) {
    const [result] = await db.query('SELECT id, username, tier FROM users WHERE session_id = ?', [session_id]);
    if (result.length === 0) {
         return null;
    }
    return result[0];
}

/**
 * Checks whether a given username belongs to an administrator (tier === 1).
 * @param {string} username - The username to check.
 * @returns {Promise<boolean>} `true` if the user is an admin, `false` otherwise.
 */
async function is_admin(username) {
    const [result] = await db.query('SELECT tier FROM users WHERE username = ?', [username]);
    if (result.length === 0) {
        return false;
    }
    return result[0].tier === 1;
}

/**
 * Registers a new user with a bcrypt-hashed password.
 * @param {string} username - The desired username.
 * @param {string} password - The plain-text password to hash and store.
 * @returns {Promise<{success: boolean, message: string}>} Result object.
 */
async function register(username, password) {
    if (await _user_exists(username)) {
        return { success: false, message: "Username already exists" };
    }
    const password_bcrypt = await bcrypt.hash(password, 10);
    await db.query('INSERT INTO users (username, password_bcrypt, tier) VALUES (?, ?, ?)', [username, password_bcrypt, 0]);
    return { success: true, message: "User registered successfully" };
}

/**
 * Authenticates a user, creates a new session, and stores the session ID in the database.
 * @param {string} username - The username attempting to log in.
 * @param {string} password - The plain-text password to verify.
 * @returns {Promise<{success: boolean, message: string, session_id?: string, tier?: number, username?: string}>} Result object.
 */
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
        tier: user.tier,
        username: username
    };
}

/**
 * Creates a new order for the authenticated user.
 * @param {string} session_id - The session token identifying the user.
 * @param {Array<{id: string|number, name: string, price: number, quantity: number}>} cart - Array of cart items.
 * @returns {Promise<{success: boolean, message: string, order_id?: number}>} Result object.
 */
async function create_order(session_id, cart) {

    const user = await _get_user_by_session(session_id);

    if (!user) {
        return { success: false, message: "Invalid session" };
    }
    const username = user.username;

    if (!username || !cart || !Array.isArray(cart)) {
        return {
            success: false,
            message: "Faulty order data"
        };
    }

    try {

        const cart_string = JSON.stringify(cart);

        const result = await db.query(
            'INSERT INTO orders (uname, cart_data) VALUES (?, ?)',
            [username, cart_string]
        );

        return {
            success: true,
            message: "Order saved succesfully",
            order_id: result.insertId
        };

    } catch (err) {

        console.error(err);

        return {
            success: false,
            message: "Order saving failed"
        };
    }
}

module.exports = {
    register,
    login,
    is_admin,
    create_order
};
