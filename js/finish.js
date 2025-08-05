// Show completion time on finish page
window.addEventListener('DOMContentLoaded', function() {
    // Block back navigation
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.pushState(null, null, location.href);
        alert("You cannot go back during the game!");
    };
    var mainBox = document.querySelector('.main-box');
    var completionTime = localStorage.getItem('completion_time');
    if (mainBox && completionTime) {
        var timeElem = document.createElement('p');
        timeElem.style.fontSize = '1.2rem';
        timeElem.style.color = '#39ff14';
        timeElem.style.marginTop = '18px';
        timeElem.textContent = 'Completion time: ' + completionTime;
        mainBox.appendChild(timeElem);
    }
});
