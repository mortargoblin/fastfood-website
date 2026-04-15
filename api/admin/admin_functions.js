const db = require('../../connection.js');

async function _is_admin_session(session_id) {
    if (!session_id) {
        return false;
    }
    const [result] = await db.query('SELECT id FROM users WHERE session_id = ? AND tier = 1', [session_id]);
    return result.length > 0;
}

async function list_products(session_id) {
    if (!await _is_admin_session(session_id)) {
        return { success: false, message: 'Unauthorized' };
    }
    const [result] = await db.query('SELECT * FROM products ORDER BY id DESC');
    return { success: true, products: result };
}

async function _get_product_columns() {
    const [columns] = await db.query('SHOW COLUMNS FROM products');
    return columns;
}

function _pick_value(body, keys) {
    for (const key of keys) {
        if (body[key] !== undefined && body[key] !== null && String(body[key]).trim() !== '') {
            return body[key];
        }
    }
    return null;
}

async function create_product(session_id, body) {
    if (!await _is_admin_session(session_id)) {
        return { success: false, message: 'Unauthorized' };
    }

    const columns = await _get_product_columns();
    const writableColumns = columns.filter((column) => !column.Extra.includes('auto_increment')).map((column) => column.Field);

    const candidateValues = {
        name: _pick_value(body, ['name', 'product_name', 'title']),
        price: _pick_value(body, ['price', 'product_price']),
        description: _pick_value(body, ['description', 'product_description']),
        image_url: _pick_value(body, ['image_url', 'image', 'product_image'])
    };

    const insertColumns = [];
    const insertValues = [];

    for (const column of writableColumns) {
        if (candidateValues[column] !== null) {
            insertColumns.push(column);
            insertValues.push(candidateValues[column]);
        }
    }

    if (insertColumns.length === 0 && writableColumns.length > 0) {
        const fallbackValue = _pick_value(body, ['name', 'product_name', 'title']);
        if (fallbackValue !== null) {
            insertColumns.push(writableColumns[0]);
            insertValues.push(fallbackValue);
        }
    }

    if (insertColumns.length === 0) {
        return { success: false, message: 'No valid product fields provided' };
    }

    const placeholders = insertColumns.map(() => '?').join(', ');
    const [result] = await db.query(
        `INSERT INTO products (${insertColumns.join(', ')}) VALUES (${placeholders})`,
        insertValues
    );
    return { success: true, message: 'Product created successfully', id: result.insertId };
}

async function delete_product(session_id, id) {
    if (!await _is_admin_session(session_id)) {
        return { success: false, message: 'Unauthorized' };
    }

    if (!id) {
        return { success: false, message: 'Product id is required' };
    }

    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
        return { success: false, message: 'Product not found' };
    }
    return { success: true, message: 'Product deleted successfully' };
}

module.exports = {
    list_products,
    create_product,
    delete_product
};
