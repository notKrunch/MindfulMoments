const timerDisplay = document.getElementById('timer-time');
const timerProgress = document.getElementById('timer-progress');
const timerStartBtn = document.getElementById('timer-start');
const timerMinusBtn = document.getElementById('timer-minus');
const timerPlusBtn = document.getElementById('timer-plus');
const backgroundSoundSelect = document.getElementById('background-sound');
const endBellSelect = document.getElementById('end-bell');
const sessionPlayerModal = document.getElementById('session-player-modal');
const customSessionModal = document.getElementById('custom-session-modal');
const createCustomBtn = document.getElementById('create-custom-btn');
const cancelCustomBtn = document.getElementById('cancel-custom-btn');
const customSessionForm = document.getElementById('custom-session-form');
const beginSessionBtns = document.querySelectorAll('.begin-session-btn');

let timerInterval;
let timeLeft = 1200;
let isTimerRunning = false;
let backgroundAudio = null;
let endBellAudio = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeTimer();
    initializeEventListeners();
    loadRecentSessions();
});

function initializeTimer() {
    updateTimerDisplay();
}

function initializeEventListeners() {
    timerStartBtn.addEventListener('click', toggleTimer);
    timerMinusBtn.addEventListener('click', () => adjustTimer(-300));
    timerPlusBtn.addEventListener('click', () => adjustTimer(300));

    backgroundSoundSelect.addEventListener('change', handleBackgroundSoundChange);
    endBellSelect.addEventListener('change', handleEndBellChange);

    beginSessionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const sessionId = btn.dataset.session;
            startSession(sessionId);
        });
    });

    createCustomBtn.addEventListener('click', openCustomSessionModal);
    cancelCustomBtn.addEventListener('click', closeCustomSessionModal);
    customSessionForm.addEventListener('submit', handleCustomSessionSubmit);

    document.querySelectorAll('.modal-close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            sessionPlayerModal.classList.remove('active');
            customSessionModal.classList.remove('active');
        });
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', () => {
            sessionPlayerModal.classList.remove('active');
            customSessionModal.classList.remove('active');
        });
    });
}

function toggleTimer() {
    if (isTimerRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    isTimerRunning = true;
    timerStartBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            completeTimer();
        }
    }, 1000);
}

function pauseTimer() {
    isTimerRunning = false;
    timerStartBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    clearInterval(timerInterval);
}

function adjustTimer(seconds) {
    if (isTimerRunning) return;
    
    timeLeft = Math.max(0, Math.min(3600, timeLeft + seconds));
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const progress = (timeLeft / 1200) * 100;
    timerProgress.style.strokeDashoffset = 283 - (283 * progress / 100);
}

function completeTimer() {
    pauseTimer();
    playEndBell();
    showCompletionMessage();
}

function handleBackgroundSoundChange() {
    const sound = backgroundSoundSelect.value;
    if (backgroundAudio) {
        backgroundAudio.pause();
        backgroundAudio = null;
    }
    
    if (sound !== 'none') {
        backgroundAudio = new Audio(`sounds/${sound}.mp3`);
        backgroundAudio.loop = true;
        backgroundAudio.play();
    }
}

function handleEndBellChange() {
    const bell = endBellSelect.value;
    if (bell !== 'none') {
        endBellAudio = new Audio(`sounds/${bell}.mp3`);
    }
}

function playEndBell() {
    if (endBellAudio) {
        endBellAudio.play();
    }
}

function startSession(sessionId) {
    const session = getSessionDetails(sessionId);
    if (!session) return;

    document.getElementById('player-session-title').textContent = session.title;
    document.getElementById('player-session-description').textContent = session.description;
    document.getElementById('player-time').textContent = formatTime(session.duration);
    
    timeLeft = session.duration * 60;
    updateTimerDisplay();
    
    sessionPlayerModal.classList.add('active');
    startTimer();
}

function getSessionDetails(sessionId) {
    const sessions = {
        'morning-mindfulness': {
            title: 'Morning Mindfulness',
            description: 'Start your day with clarity and purpose through this guided morning meditation.',
            duration: 10
        },
        'anxiety-relief': {
            title: 'Anxiety Relief',
            description: 'Release tension and worry with this specialized anxiety-reducing meditation practice.',
            duration: 15
        },
        'sleep-well': {
            title: 'Sleep Well',
            description: 'Prepare your mind and body for restful sleep with this calming bedtime meditation.',
            duration: 20
        }
    };
    
    return sessions[sessionId];
}

function openCustomSessionModal() {
    customSessionModal.classList.add('active');
}

function closeCustomSessionModal() {
    customSessionModal.classList.remove('active');
}

function handleCustomSessionSubmit(e) {
    e.preventDefault();
    
    const customSession = {
        title: document.getElementById('custom-title').value,
        duration: parseInt(document.getElementById('custom-duration').value),
        intervals: document.getElementById('custom-intervals').value,
        beginBell: document.getElementById('custom-begin-bell').value,
        endBell: document.getElementById('custom-end-bell').value,
        background: document.getElementById('custom-background').value
    };
    
    startCustomSession(customSession);
    closeCustomSessionModal();
}

function startCustomSession(session) {
    document.getElementById('player-session-title').textContent = session.title;
    document.getElementById('player-session-description').textContent = 'Custom meditation session';
    document.getElementById('player-time').textContent = formatTime(session.duration);
    
    timeLeft = session.duration * 60;
    updateTimerDisplay();
    
    if (session.background !== 'none') {
        backgroundSoundSelect.value = session.background;
        handleBackgroundSoundChange();
    }
    
    if (session.endBell !== 'none') {
        endBellSelect.value = session.endBell;
        handleEndBellChange();
    }
    
    sessionPlayerModal.classList.add('active');
    startTimer();
}

function formatTime(minutes) {
    return `${minutes.toString().padStart(2, '0')}:00`;
}

function showCompletionMessage() {
    alert('Meditation session completed! Great job!');
}

function loadRecentSessions() {
    const recentSessions = [
        {
            title: 'Morning Mindfulness',
            date: 'Today, 8:25 AM',
            duration: 10,
            category: 'Guided Meditation'
        },
        {
            title: 'Sleep Well',
            date: 'Yesterday, 9:15 PM',
            duration: 20,
            category: 'Sleep Meditation'
        }
    ];
    
    const recentSessionsList = document.getElementById('recent-sessions-list');
    if (recentSessionsList) {
        recentSessionsList.innerHTML = recentSessions.map(session => `
            <div class="session-history-item">
                <div class="session-date">${session.date}</div>
                <div class="session-info">
                    <h3>${session.title}</h3>
                    <div class="session-details">
                        <span class="duration">${session.duration} minutes</span>
                        <span class="category">${session.category}</span>
                    </div>
                </div>
                <a href="#" class="btn-icon" title="Repeat session" data-session="${session.title.toLowerCase().replace(/\s+/g, '-')}">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                    </svg>
                </a>
            </div>
        `).join('');
        
        recentSessionsList.querySelectorAll('.btn-icon').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const sessionId = btn.dataset.session;
                startSession(sessionId);
            });
        });
    }
} 