document.addEventListener('DOMContentLoaded', () => {
    // Block back navigation
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.pushState(null, null, location.href);
        alert("You cannot go back during the game!");
    };
    // Resize ref image to match rules container height
    const refImg = document.querySelector('.ref-img');
    const rulesBox = document.querySelector('.rules-box');
    if (refImg && rulesBox) {
        refImg.style.height = `${rulesBox.offsetHeight}px`;
    }
    // Timer logic
    let timerInterval;
    let seconds = parseInt(localStorage.getItem('timer_seconds')) || 0;
    let minutes = parseInt(localStorage.getItem('timer_minutes')) || 0;

    function updateTimerDisplay() {
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            if (minutes === 15 && seconds === 0) {
// Block back navigation (run immediately)
history.pushState(null, null, location.href);
window.onpopstate = function () {
    history.pushState(null, null, location.href);
    alert("You cannot go back during the game!");
};
                clearInterval(timerInterval);
                updateTimerDisplay();
                return;
            }
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            localStorage.setItem('timer_seconds', seconds);
            localStorage.setItem('timer_minutes', minutes);
            updateTimerDisplay();
        }, 1000);
    }

    updateTimerDisplay();
    if (!localStorage.getItem('timer_started')) {
        localStorage.setItem('timer_started', '1');
        localStorage.setItem('timer_seconds', '0');
        localStorage.setItem('timer_minutes', '0');
        seconds = 0;
        minutes = 0;
        startTimer();
    } else {
        startTimer();
    }
    // Variable declarations
    let questions = [];
    let currentIdx = -1;
    let currentAnswer = '';

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function loadQuestion() {
        if (!questions.length) return;
        currentIdx = getRandomInt(questions.length);
        const q = questions[currentIdx];
        document.getElementById('questionArea').textContent = q.question;
        currentAnswer = q.answer;
        document.getElementById('answerInput').value = '';
        document.getElementById('feedback').textContent = '';
    }

    fetch('data/level1.json')
        .then(res => res.json())
        .then(data => {
            questions = data;
            loadQuestion();
        });

    document.getElementById('answerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const userAns = document.getElementById('answerInput').value.trim().toUpperCase();
        if (userAns === currentAnswer) {
            window.location.href = 'level2.html';
        } else {
            alert('oops! wrong answer try again');
        }
    });
});

// Optionally, allow Enter to submit

