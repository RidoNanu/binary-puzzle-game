// Navigation logic for start page only
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('startForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Store user details
            const name = document.getElementById('name').value.trim();
            const regno = document.getElementById('regno').value.trim();
            const phone = document.getElementById('phone').value.trim();
            localStorage.setItem('user_name', name);
            localStorage.setItem('user_regno', regno);
            localStorage.setItem('user_phone', phone);
            // Reset timer values for a new game
            localStorage.setItem('timer_seconds', '0');
            localStorage.setItem('timer_minutes', '0');
            localStorage.removeItem('timer_started');
            window.location.href = 'level1.html';
        });
    }
});
