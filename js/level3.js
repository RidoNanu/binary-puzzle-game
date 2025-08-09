document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation prevention
    initNavigationPrevention();
    
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
            
            if (minutes === 15) {
                clearInterval(timerInterval);
                alert('Time is up! Game Over');
                window.location.href = 'index.html';
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
            const totalSeconds = minutes * 60 + seconds;
            localStorage.setItem('level3_time', totalSeconds);
            
            // Calculate total time
            const level1Time = parseFloat(localStorage.getItem('level1_time') || 0);
            const level2Time = parseFloat(localStorage.getItem('level2_time') || 0);
            const level3Time = totalSeconds;
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
