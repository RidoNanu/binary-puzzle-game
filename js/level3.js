document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation prevention
    initNavigationPrevention();
    // Reset timer for this level and set start timestamp
    localStorage.setItem('timer_seconds', '0');
    localStorage.setItem('timer_minutes', '0');
    localStorage.setItem('level3_start_timestamp', Date.now().toString());
    localStorage.removeItem('timer_started');
    
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
            timerEl.style.display = 'inline-block';
        }
    }

    function startTimer() {
        const startTime = Date.now() - (seconds * 1000) - (minutes * 60000);
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            seconds = Math.floor((elapsedTime / 1000) % 60);
            minutes = Math.floor((elapsedTime / 1000) / 60);
            if (minutes === 10) {
                clearInterval(timerInterval);
                alert('Maximum time reached for Level 3!');
                setTimeout(() => {
                    window.location.href = 'finish.html';
                }, 500);
                return;
            }
            localStorage.setItem('timer_seconds', seconds);
            localStorage.setItem('timer_minutes', minutes);
            updateTimerDisplay();
        }, 1000);
    }

    updateTimerDisplay();
    startTimer();

    // Game logic
    let currentQuestion = null;

    // Fetch and display question
    fetch('data/level3.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load questions');
            }
            return response.json();
        })
        .then(questions => {
            if (!questions || !questions.length) {
                throw new Error('No questions available');
            }
            // Select random question
            currentQuestion = questions[Math.floor(Math.random() * questions.length)];
            // Display question
            questionArea.textContent = currentQuestion.question;
        })
        .catch(error => {
            console.error('Error loading question:', error);
            questionArea.textContent = 'Error loading question. Please refresh the page.';
        });

    // Handle form submission
    answerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentQuestion) {
            feedback.textContent = 'Please wait for question to load...';
            return;
        }

        const userAnswer = answerInput.value.trim().toUpperCase();
        
        if (userAnswer === currentQuestion.answer) {
            feedback.textContent = 'Correct! You finished Level 3!';
            feedback.className = 'feedback success';
            // Store level completion and time
            clearInterval(timerInterval);
            let level3Actual = 0;
            const startTimestamp = parseInt(localStorage.getItem('level3_start_timestamp') || '0');
            if (startTimestamp > 0) {
                const endTimestamp = Date.now();
                level3Actual = Math.round((endTimestamp - startTimestamp) / 1000);
            } else {
                // fallback to timer if timestamp missing
                level3Actual = minutes * 60 + seconds;
            }
            if (level3Actual < 0) level3Actual = 0;
            localStorage.setItem('level3_time', level3Actual);
            // Calculate total time
            const level1Time = parseFloat(localStorage.getItem('level1_time') || 0);
            const level2Time = parseFloat(localStorage.getItem('level2_time') || 0);
            const level3Time = level3Actual;
            const totalTime = level1Time + level2Time + level3Time;
            localStorage.setItem('total_time', totalTime);
            // Redirect after showing success
            setTimeout(() => {
                window.location.href = 'finish.html';
            }, 2000);
        } else {
            feedback.textContent = 'Wrong answer, try again!';
            feedback.className = 'feedback error';
            answerInput.value = '';
            answerInput.focus();
        }
    });
});
