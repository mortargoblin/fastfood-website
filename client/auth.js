/**
 * @file auth.js
 * @description Handles login and registration form submission on the auth page.
 * Listens for the `dynamicPageLoad` event to initialize when `auth.html` is loaded.
 */

/**
 * Updates the status message element on the auth page.
 * @param {string} message - The message to display in `#auth-message`.
 * @returns {Promise<void>}
 */
async function updateStatus(message) {
    const statusElement = document.getElementById('auth-message');
    statusElement.textContent = message;
}

/**
 * Listens for the `dynamicPageLoad` custom event.
 * When `auth.html` is loaded, wires up:
 * - Tab toggle buttons (`.toggle-btn`) to switch between login and register panels.
 * - The login form to submit credentials to `POST /api/user/login`.
 * - The register form to submit credentials to `POST /api/user/register`.
 */
document.addEventListener('dynamicPageLoad', (event) => {
    console.log('dynamicPageLoad event received with content:', event.detail.content);

        document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            console.log('Toggling to', btn.dataset.target);
            document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('panel-' + btn.dataset.target).classList.add('active');
        });
    });
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            updateStatus("Start authentication flow, method: login");
            const username = document.getElementById('login_username').value;
            const password = document.getElementById('login_password').value;
            const response = await fetch('/api/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'                },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            updateStatus(result.message);
            if (result.success) {
                updateAuthNav();
                setTimeout(() => loadPageContent('home.html'), 800);
            }
        });
    };
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            updateStatus("Start authentication flow, method: register");
            const username = document.getElementById('register_username').value;
            const password = document.getElementById('register_password').value;
            const response = await fetch('/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            const result = await response.json();
            updateStatus(result.message);
        });
    }

});