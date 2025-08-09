// Total game time in minutes
const TOTAL_GAME_TIME = 15;

class LevelTimer {
    constructor() {
        this.totalGameTimeInSeconds = TOTAL_GAME_TIME * 60;
        this.levelTimes = {
            level1: 0,
            level2: 0,
            level3: 0
        };
        this.currentLevel = 1;
        this.startTime = 0;
        this.timerInterval = null;
        this.remainingTime = this.totalGameTimeInSeconds;
    }

    startTimer() {
        this.startTime = Date.now();
        this.updateTimerDisplay();
        this.timerInterval = setInterval(() => this.updateTimerDisplay(), 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        const timeTaken = Math.floor((Date.now() - this.startTime) / 1000);
        this.levelTimes[`level${this.currentLevel}`] = timeTaken;
        this.remainingTime -= timeTaken;
        
        // Store times in localStorage
        localStorage.setItem('levelTimes', JSON.stringify(this.levelTimes));
        localStorage.setItem('remainingTime', this.remainingTime.toString());
        return timeTaken;
    }

    updateTimerDisplay() {
        const timeElapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const timeRemaining = this.remainingTime - timeElapsed;
        
        if (timeRemaining <= 0) {
            clearInterval(this.timerInterval);
            this.gameOver();
            return;
        }

        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = display;
        }
    }

    gameOver() {
        alert('Time is up! Game Over');
        window.location.href = 'index.html';
    }

    // Initialize level timer
    initLevel(level) {
        this.currentLevel = level;
        
        // Load previous times and remaining time
        const storedTimes = localStorage.getItem('levelTimes');
        const storedRemainingTime = localStorage.getItem('remainingTime');
        
        if (storedTimes && storedRemainingTime) {
            this.levelTimes = JSON.parse(storedTimes);
            this.remainingTime = parseInt(storedRemainingTime);
        }

        if (this.remainingTime <= 0) {
            this.gameOver();
            return;
        }

        this.startTimer();
    }

    // Format time for display
    static formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Get summary of all level times
    static getLevelTimesSummary() {
        const storedTimes = localStorage.getItem('levelTimes');
        if (!storedTimes) return null;
        
        const times = JSON.parse(storedTimes);
        const totalTime = Object.values(times).reduce((a, b) => a + b, 0);
        
        return {
            level1: times.level1,
            level2: times.level2,
            level3: times.level3,
            totalTime: totalTime
        };
    }

    // Clear stored times (use when restarting game)
    static clearStoredTimes() {
        localStorage.removeItem('levelTimes');
        localStorage.removeItem('remainingTime');
    }
}

// Export for use in other files
window.LevelTimer = LevelTimer;
