// Timer management
function updateTimerDisplay(timerEl, minutes, seconds) {
    if (timerEl) {
        timerEl.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        timerEl.style.display = 'inline-block';
        timerEl.style.visibility = 'visible';
    }
}

// Question loading
function loadQuestions(levelNumber) {
    return fetch(`data/level${levelNumber}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load questions');
            }
            return response.json();
        })
        .then(questions => {
            if (!Array.isArray(questions) || questions.length === 0) {
                throw new Error('Invalid question data');
            }
            return questions;
        });
}

// Get random question
function getRandomQuestion(questions) {
    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('No questions available');
    }
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
}
