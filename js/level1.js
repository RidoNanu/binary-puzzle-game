document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation prevention
    initNavigationPrevention();
    // Set start timestamp for level 1
    localStorage.setItem('level1_start_timestamp', Date.now().toString());
    // Get DOM elements
    const questionArea = document.getElementById('questionArea');
    const answerForm = document.getElementById('answerForm');
    const answerInput = document.getElementById('answerInput');
    const feedback = document.getElementById('feedback');
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
        const startTime = Date.now() - (seconds * 1000) - (minutes * 60000);
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            seconds = Math.floor((elapsedTime / 1000) % 60);
            minutes = Math.floor((elapsedTime / 1000) / 60);
            if (minutes === 5) {
                clearInterval(timerInterval);
                alert('Maximum time reached for Level 1!');
                setTimeout(() => {
                    window.location.href = 'level2.html';
                }, 500);
                return;
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
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to load questions');
            }
            return res.json();
        })
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error('Invalid question data');
            }
            questions = data;
            loadQuestion();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            document.getElementById('questionArea').textContent = 'Error loading questions. Please refresh the page.';
        });

    document.getElementById('answerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const userAns = document.getElementById('answerInput').value.trim().toUpperCase();
        const feedback = document.getElementById('feedback');
        if (userAns === currentAnswer) {
            feedback.textContent = 'Correct! Moving to next level...';
            feedback.className = 'feedback success';
            clearInterval(timerInterval);
            // Store time spent only on this level using timestamp
            const startTimestamp = parseInt(localStorage.getItem('level1_start_timestamp') || '0');
            const endTimestamp = Date.now();
            let level1Actual = Math.round((endTimestamp - startTimestamp) / 1000);
            if (level1Actual < 0) level1Actual = 0;
            localStorage.setItem('level1_time', level1Actual);
            // Redirect after showing success message
            setTimeout(() => {
                localStorage.setItem('level2_start_timestamp', Date.now().toString());
                window.location.href = 'level2.html';
            }, 2000);
        } else {
            feedback.textContent = 'Wrong answer. Please try again!';
            feedback.className = 'feedback error';
            document.getElementById('answerInput').value = '';
            document.getElementById('answerInput').focus();
        }
    });
});



