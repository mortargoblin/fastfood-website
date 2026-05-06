const db = require('../../connection.js');
const ADMIN_TIER = 1;

async function _is_admin_session(session_id) {
    if (!session_id) {
        return false;
    }
    const [result] = await db.query('SELECT id FROM users WHERE session_id = ? AND tier = ?', [session_id, ADMIN_TIER]);
    return result.length > 0;
}

async function list_products(session_id) {
    if (!await _is_admin_session(session_id)) {
        return { success: false, message: 'Unauthorized' };
    }
    const [result] = await db.query('SELECT * FROM products ORDER BY id DESC');
    const normalizedProducts = result.map((product) => ({
        ...product,
        name: product.name ?? product.product_name ?? product.title ?? null
    }));
    return { success: true, products: normalizedProducts };
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

async function create_product(session_id, body, bypass_session = false) {
    if (!await _is_admin_session(session_id) && !bypass_session) {
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

async function update_product(session_id, id, body) {
    if (!await _is_admin_session(session_id)) {
        return { success: false, message: 'Unauthorized' };
    }
    if (!id) {
        return { success: false, message: 'Product id is required' };
    }
    const columns = await _get_product_columns();
    const writableColumns = columns.filter((column) => !column.Extra.includes('auto_increment')).map((column) => column.Field);
    const candidateValues = {
        name: _pick_value(body, ['name', 'product_name', 'title']),
        price: _pick_value(body, ['price', 'product_price']),
        description: _pick_value(body, ['description', 'product_description']),
        image_url: _pick_value(body, ['image_url', 'image', 'product_image'])
    };
    const updateColumns = [];
    const updateValues = [];
    for (const column of writableColumns) {
        if (candidateValues[column] !== null) {
            updateColumns.push(`${column} = ?`);
            updateValues.push(candidateValues[column]);
        }
    }
    if (updateColumns.length === 0) {
        return { success: false, message: 'No valid product fields provided for update' };
    }
    updateValues.push(id);
    const [result] = await db.query(
        `UPDATE products SET ${updateColumns.join(', ')} WHERE id = ?`, 
        updateValues
    );
    if (result.affectedRows === 0) {
        return { success: false, message: 'Product not found or no changes made' };
    }
    return { success: true, message: 'Product updated successfully'};
}

async function create_demo_products() {

    //If the products length is zero, return.
    const [existingProducts] = await db.query('SELECT id FROM products LIMIT 1');
    if (existingProducts.length > 0) {
        return 1;
    }
    console.log('Creating demo products...');

    const demoProducts = [
        {
            name: 'Lame Burger',
            price: 5.99,
            description: 'A very lame burger with no taste.',
            image_url: '/img/NNbaagaa.png'
        },
        {
            name: 'Mediocre Fries',
            price: 2.99,
            description: 'Fries that are just okay, nothing special.',
            image_url: '/img/NNfries.png'
        },
        {
            name: 'Bland Chicken Burger',
            price: 4.99,
            description: 'A bland chicken burger that tastes like nothing.',
            image_url: '/img/NNchickenbaaga.png'
        },
        {
            name: 'Nuggets of Doom and Despair',
            price: 3.99,
            description: 'Chicken nuggets that will make you question your life choices.',
            image_url: '/img/NNnugs.png'
        },
        {
            name: 'Big Burger for Big Sadness',
            price: 13.99,
            description: 'A sad burger that tastes like disappointment.',
            image_url: '/img/NNiso.png'
        },
        {
            name: 'Small Burger of Existential Dread',
            price: 2.99,
            description: 'A tiny burger that encapsulates the feeling of existential dread.',
            image_url: '/img/NNpieni.png'
        },
        {
            name: 'Sad Soda',
            price: 1.99,
            description: 'A sad soda for sad people.',
            image_url: '/img/NNdrink.png'
        },
        {
            name: "Milkshake of Misery",
            price: 4.99,
            description: "A milkshake that is as miserable as it sounds.",
            image_url: "/img/NNcmilks.png"
        },
            {
            name: "Pink Milkshake from the Cows of Despair",
            price: 5.49,
            description: "This one is not even so bad",
            image_url: "/img/NNsmilks.png"
        }
    ];

    for (const product of demoProducts) {
        await create_product(null, product, true);
    }

    return 0;
}

module.exports = {
    list_products,
    create_product,
    delete_product,
    update_product,
    create_demo_products
};

