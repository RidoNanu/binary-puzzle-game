// Format time function
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Show completion times on finish page
window.addEventListener('DOMContentLoaded', function() {
    // Block back navigation
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.pushState(null, null, location.href);
        alert("You cannot go back during the game!");
    };

    // Get user details from localStorage
    const userName = localStorage.getItem('user_name') || '--';
    const userRegno = localStorage.getItem('user_regno') || '--';
    const userPhone = localStorage.getItem('user_phone') || '--';
    if (document.getElementById('userName')) document.getElementById('userName').textContent = userName;
    if (document.getElementById('userRegno')) document.getElementById('userRegno').textContent = userRegno;
    if (document.getElementById('userPhone')) document.getElementById('userPhone').textContent = userPhone;

    // Get times from localStorage
    const level1Time = parseFloat(localStorage.getItem('level1_time') || 0);
    const level2Time = parseFloat(localStorage.getItem('level2_time') || 0);
    const level3Time = parseFloat(localStorage.getItem('level3_time') || 0);
    const totalTime = level1Time + level2Time + level3Time;

    // Update time elements
    document.getElementById('level1Time').textContent = formatTime(level1Time);
    document.getElementById('level2Time').textContent = formatTime(level2Time);
    document.getElementById('level3Time').textContent = formatTime(level3Time);
    document.getElementById('totalTime').textContent = formatTime(totalTime);
});
