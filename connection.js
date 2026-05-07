"use strict";
var mysql = require('mysql2/promise');
const logger = require('./logger.js');

if (process.env.NODE_ENV === 'test') {
    const state = {
        users: [],
        products: [],
        orders: []
    };
    const counters = {
        users: 1,
        products: 1,
        orders: 1
    };
    const productColumns = [
        { Field: 'id', Extra: 'auto_increment' },
        { Field: 'name', Extra: '' },
        { Field: 'description', Extra: '' },
        { Field: 'price', Extra: '' },
        { Field: 'image_url', Extra: '' }
    ];

    const reset = () => {
        state.users.length = 0;
        state.products.length = 0;
        state.orders.length = 0;
        counters.users = 1;
        counters.products = 1;
        counters.orders = 1;
    };

    const seedProducts = (products) => {
        for (const product of products) {
            state.products.push({
                id: counters.products++,
                name: product.name ?? null,
                description: product.description ?? null,
                price: product.price ?? null,
                image_url: product.image_url ?? null
            });
        }
    };

    const query = async (sql, params = []) => {
        const normalized = sql.trim();
        if (normalized === 'SELECT id FROM users WHERE username = ?') {
            const rows = state.users
                .filter((user) => user.username === params[0])
                .map((user) => ({ id: user.id }));
            return [rows];
        }
        if (normalized === 'SELECT id FROM users WHERE session_id = ?') {
            const rows = state.users
                .filter((user) => user.session_id === params[0])
                .map((user) => ({ id: user.id }));
            return [rows];
        }
        if (normalized === 'SELECT id, username, tier FROM users WHERE session_id = ?') {
            const rows = state.users
                .filter((user) => user.session_id === params[0])
                .map((user) => ({ id: user.id, username: user.username, tier: user.tier }));
            return [rows];
        }
        if (normalized === 'SELECT tier FROM users WHERE username = ?') {
            const rows = state.users
                .filter((user) => user.username === params[0])
                .map((user) => ({ tier: user.tier }));
            return [rows];
        }
        if (normalized === 'SELECT id, tier, password_bcrypt FROM users WHERE username = ?') {
            const rows = state.users
                .filter((user) => user.username === params[0])
                .map((user) => ({ id: user.id, tier: user.tier, password_bcrypt: user.password_bcrypt }));
            return [rows];
        }
        if (normalized === 'SELECT id FROM users WHERE session_id = ? AND tier = ?') {
            const rows = state.users
                .filter((user) => user.session_id === params[0] && user.tier === params[1])
                .map((user) => ({ id: user.id }));
            return [rows];
        }
        if (normalized === 'INSERT INTO users (username, password_bcrypt, tier) VALUES (?, ?, ?)') {
            const [username, password_bcrypt, tier] = params;
            const id = counters.users++;
            state.users.push({
                id,
                username,
                password_bcrypt,
                tier,
                session_id: null
            });
            return [{ insertId: id, affectedRows: 1 }];
        }
        if (normalized === 'UPDATE users SET session_id = ? WHERE id = ?') {
            const [session_id, id] = params;
            const user = state.users.find((entry) => entry.id === id);
            if (user) {
                user.session_id = session_id;
                return [{ affectedRows: 1 }];
            }
            return [{ affectedRows: 0 }];
        }
        if (normalized === 'INSERT INTO orders (uname, cart_data) VALUES (?, ?)') {
            const [uname, cart_data] = params;
            const id = counters.orders++;
            state.orders.push({ id, uname, cart_data });
            return [{ insertId: id, affectedRows: 1 }];
        }
        if (normalized === 'SELECT * FROM products ORDER BY id DESC') {
            const rows = [...state.products].sort((a, b) => b.id - a.id);
            return [rows];
        }
        if (normalized === 'SHOW COLUMNS FROM products') {
            return [productColumns];
        }
        if (normalized === 'SELECT id FROM products LIMIT 1') {
            const rows = state.products.length > 0 ? [{ id: state.products[0].id }] : [];
            return [rows];
        }
        if (normalized === 'DELETE FROM products WHERE id = ?') {
            const id = Number(params[0]);
            const index = state.products.findIndex((product) => product.id === id);
            if (index === -1) {
                return [{ affectedRows: 0 }];
            }
            state.products.splice(index, 1);
            return [{ affectedRows: 1 }];
        }
        const insertMatch = normalized.match(/^insert into products \((.+)\) values \((.+)\)$/i);
        if (insertMatch) {
            const columns = insertMatch[1].split(',').map((column) => column.trim());
            const id = counters.products++;
            const product = { id, name: null, description: null, price: null, image_url: null };
            columns.forEach((column, index) => {
                product[column] = params[index];
            });
            state.products.push(product);
            return [{ insertId: id, affectedRows: 1 }];
        }
        const updateMatch = normalized.match(/^update products set (.+) where id = \?$/i);
        if (updateMatch) {
            const assignments = updateMatch[1].split(',').map((part) => part.trim());
            const id = Number(params[params.length - 1]);
            const product = state.products.find((entry) => entry.id === id);
            if (!product) {
                return [{ affectedRows: 0 }];
            }
            assignments.forEach((assignment, index) => {
                const column = assignment.split('=')[0].trim();
                product[column] = params[index];
            });
            return [{ affectedRows: 1 }];
        }
        throw new Error(
            'Unsupported query in test mode. Add handling to the in-memory query switch in connection.js.'
        );
    };

    module.exports = {
        query,
        __reset: reset,
        __seedProducts: seedProducts
    };
} else {
    let pool;

    logger.log(logger.LOGTYPE.INFO, `[db] connecting...`);
    pool = mysql.createPool({
        host: "localhost",
        port: 3306,
        user: "fastfood",
        password: "fastfood",
        database: "fastfood",
        waitForConnections: true,
        connectionLimit: 10,
    });

    logger.log(logger.LOGTYPE.INFO, `[db] connected to database`);

    pool.getConnection((err, connection) => {
        if (err)
            throw err;
        connection.release();
    });

    module.exports = pool;
}
