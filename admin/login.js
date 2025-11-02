$(document).ready(function() {
    $('#loginForm').on('submit', async function(e) {
        e.preventDefault();
        const username = $('#username').val();
        const password = $('#password').val();
        const errorMessage = $('#errorMessage');
        const submitBtn = $(this).find('button[type="submit"]');

        // Clear previous error messages
        errorMessage.addClass('d-none').text('');

        // Disable submit to prevent multiple submissions
        const originalText = submitBtn.text();
        submitBtn.prop('disabled', true).text('Signing in...');

        try {
            // Get CSRF token
            const csrfResp = await fetch('/api/csrf-token', { credentials: 'include' });
            if (!csrfResp.ok) {
                throw new Error('Unable to initialize login (CSRF)');
            }
            const { csrfToken } = await csrfResp.json();

            // Perform login
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({ username, password }),
                credentials: 'include'
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.success) {
                const msg = data && (data.message || data.error) || `Login failed (${response.status})`;
                throw new Error(msg);
            }

            // Redirect to admin dashboard
            window.location.href = '/admin/dashboard.html';
        } catch (error) {
            console.error('Login error:', error);
            errorMessage.removeClass('d-none').text(error.message || 'An unexpected error occurred');
        } finally {
            submitBtn.prop('disabled', false).text(originalText);
        }
    });
});