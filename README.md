# Northside Nugetti

A full-stack web application for a fictional fast food chain. Built with Node.js, Express, and MySQL — featuring a single-page front-end, a user authentication system, an admin product management panel, and a persistent shopping cart.

---

## Live Application

**[http://10.120.36.62/](http://10.120.36.62/)**

> **Note:** You must be connected to the **Metropolia network** or **Metropolia VPN** to access the deployed application.

---

## Feedback

Feedback form: *(link here)*

---

## Key Features

- Browse the menu and add items to a persistent shopping cart
- Register and log in with a secure account (bcrypt password hashing)
- Place orders when logged in
- Admin panel for full product management (create, edit, delete)
- Testimonial carousel on the home page (Swiper.js)
- Interactive restaurant location map (Google Maps embed)
- Demo products are automatically seeded on first run

---

## Pages

| Page | Description |
|---|---|
| **Home** | Landing page with a hero banner, testimonial carousel, and restaurant location map |
| **Menu** | Product grid fetched live from the API. Add items to your cart from here |
| **Restaurants** | Restaurant location info with an embedded Google Maps modal |
| **Login / Register** | Authentication page with tab-toggled login and registration forms |
| **Admin** | Product management panel — only visible to users with admin privileges |

---

## Application Architecture

```
fastfood-website5/
├── index.js                  # Express app entry point — serves static files and mounts routers
├── connection.js             # MySQL2 connection pool
├── logger.js                 # File + console logger with severity levels
│
├── api/
│   ├── user/
│   │   ├── user_endpoints.js # POST /api/user/register, login, logout, create_order
│   │   └── user_functions.js # Auth logic, session management, order creation
│   ├── admin/
│   │   ├── admin_endpoints.js# GET/POST/PUT/DELETE /api/admin/products, GET /api/admin/orders
│   │   └── admin_functions.js# Admin product CRUD, demo product seeding
│   └── provider/
│       ├── provider_endpoints.js # GET /api/provider/products (public, no auth)
│       └── provider_functions.js # Public product listing
│
└── client/                   # Static front-end (served by Express)
    ├── index.html            # Shell HTML — nav, cart dialog, map modal
    ├── main.js               # SPA navigation, cart dialog, auth state, Swiper init
    ├── cart.js               # Cart state management (localStorage)
    ├── menu.js               # Menu page: fetch & render products, add-to-cart
    ├── auth.js               # Login/register form handlers
    └── admin.js              # Admin panel: product CRUD UI
```

### Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Web framework | Express 5 |
| Database | MySQL (via mysql2) |
| Password hashing | bcrypt |
| Styling | Tailwind CSS 4 |
| Carousel | Swiper.js 12 |
| Session management | Cookie-based (httpOnly session token) |

---

## API Overview

### User — `/api/user`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | None | Register a new account |
| POST | `/login` | None | Log in, sets session cookies |
| POST | `/logout` | None | Clears session cookies |
| POST | `/create_order` | Session cookie | Place an order with the current cart |

### Provider — `/api/provider`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | None | List all products (used by the menu page) |

### Admin — `/api/admin`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/products` | Admin session | List all products |
| POST | `/products` | Admin session | Create a new product |
| PUT | `/products/:id` | Admin session | Update a product |
| DELETE | `/products/:id` | Admin session | Delete a product |
| GET | `/orders` | Admin session | List all orders |

> Admin routes also enforce a **CSRF check** — requests must originate from the same host.

---

## Local Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [MySQL](https://dev.mysql.com/downloads/) (v8 or MariaDB equivalent)

### 1. Clone the repository

```bash
git clone https://github.com/mortargoblin/fastfood-website.git
cd fastfood-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Run the structure file against your MySQL server to create the database, user, and tables:

```bash
mysql -u root -p < fastfood.sql
```

This will:
- Drop and recreate the `fastfood` database
- Create a MySQL user `fastfood` with password `fastfood`
- Create the `users`, `products`, and `orders` tables

### 4. Start the server

```bash
node index.js
```

The application will be available at **[http://localhost:3000](http://localhost:3000)**.

> Demo products are automatically inserted on the first run if the products table is empty.

### 5. (Optional) Build Tailwind CSS

If you make changes to the CSS, rebuild the stylesheet by running:

```bash
run-tailwind.bat
```

---

## Test Accounts

No accounts are pre-seeded by the database setup script — you need to register one manually via the **Login / Register** page.

To create an **admin account**, register a regular account first, then manually update its tier in the database:

```sql
USE fastfood;
UPDATE users SET tier = 1 WHERE username = 'your_username';
```

After that, log out and log back in — the Admin panel will become visible in the navigation bar.

---

## Credits

Developed by:

- Aaro Saarinen
- Janette Kotanen
- Tom Laukkanen
- Sampo Westman

---

## License

MIT — see [LICENSE](./LICENSE) for details.
