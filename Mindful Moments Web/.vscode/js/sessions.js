let timerInterval;
let timeLeft = 1200;
let isTimerRunning = false;

let backgroundAudio = null;
let endBellAudio = null;

const timerDisplay = document.getElementById('timer-time');
const timerProgress = document.getElementById('timer-progress');
const startButton = document.getElementById('timer-start');
const minusButton = document.getElementById('timer-minus');
const plusButton = document.getElementById('timer-plus');
const backgroundSoundSelect = document.getElementById('background-sound');
const endBellSelect = document.getElementById('end-bell');

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    const progress = (timeLeft / 1200) * 100;
    timerProgress.style.strokeDashoffset = 440 - (440 * progress) / 100;
}

function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        startButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                stopTimer();
                playEndBell();
            }
        }, 1000);
    } else {
        stopTimer();
    }
}

function stopTimer() {
    isTimerRunning = false;
    clearInterval(timerInterval);
    startButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
}

function adjustTime(amount) {
    if (!isTimerRunning) {
        timeLeft = Math.max(60, Math.min(3600, timeLeft + amount));
        updateTimerDisplay();
    }
}

function handleBackgroundSound() {
    const selectedSound = backgroundSoundSelect.value;
    if (backgroundAudio) {
        backgroundAudio.pause();
        backgroundAudio = null;
    }
    if (selectedSound !== 'none') {
        backgroundAudio = new Audio(`audio/${selectedSound}.mp3`);
        backgroundAudio.loop = true;
        backgroundAudio.volume = 0.3;
        backgroundAudio.play();
    }
}

function playEndBell() {
    const selectedBell = endBellSelect.value;
    if (selectedBell !== 'none') {
        endBellAudio = new Audio(`audio/${selectedBell}.mp3`);
        endBellAudio.play();
    }
}

function initializeSessionCards() {
    const sessionCards = document.querySelectorAll('.session-card');
    sessionCards.forEach(card => {
        const beginButton = card.querySelector('.begin-session-btn');
        beginButton.addEventListener('click', (e) => {
            e.preventDefault();
            const sessionId = beginButton.dataset.session;
            startSession(sessionId);
        });
    });
}

function startSession(sessionId) {
    timeLeft = 1200;
    updateTimerDisplay();
    if (isTimerRunning) {
        stopTimer();
    }
    startTimer();
    handleBackgroundSound();
}

function initializeCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterSessionsByCategory(category);
        });
    });
}

function filterSessionsByCategory(category) {
    const sessionCards = document.querySelectorAll('.session-card');
    sessionCards.forEach(card => {
        card.style.display = 'block';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay();
    startButton.addEventListener('click', startTimer);
    minusButton.addEventListener('click', () => adjustTime(-300));
    plusButton.addEventListener('click', () => adjustTime(300));
    backgroundSoundSelect.addEventListener('change', handleBackgroundSound);
    initializeSessionCards();
    initializeCategoryCards();
}); 