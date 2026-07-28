import { CATEGORIES, INITIAL_QUESTIONS, fetchOnlineQuestions } from './questions.js';
import { audio } from './audio.js';
import { triggerConfetti } from './confetti.js';

// --- GAME STATE ---
const state = {
    // User Profile
    xp: 0,
    level: 1,
    streak: 0,
    maxStreak: 0,
    gamesPlayed: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    unlockedBadges: [],

    // Game Config & Progress
    currentMode: 'classic', // 'classic', 'blitz', 'daily', 'flashcards'
    selectedCategory: 'all',
    selectedDifficulty: 'all',
    questions: [],
    currentIndex: 0,
    score: 0,
    comboStreak: 0,
    timeLeft: 15,
    timerInterval: null,
    isAnswered: false,

    // Collections & Storage
    customQuizzes: [],
    missedQuestions: [], // Questions added for flashcard study
    onlineMode: false
};

// Badges Definition
const BADGES = [
    { id: 'first_win', title: 'First Spark', desc: 'Complete your first trivia session', icon: '⚡' },
    { id: 'streak_5', title: 'On Fire', desc: 'Achieve a 5-question correct streak', icon: '🔥' },
    { id: 'level_5', title: 'Knowledge Seeker', desc: 'Reach Level 5', icon: '🎓' },
    { id: 'speed_demon', title: 'Speed Demon', desc: 'Complete Timed Blitz mode with 30+ points', icon: '⏱️' },
    { id: 'mastermind', title: 'Mastermind', desc: 'Score 100% in a quiz session', icon: '👑' }
];

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadUserData();
    setupUI();
    renderCategories();
    updateUserStatsUI();
});

// Mobile Haptic Vibration Helper
function triggerHaptic(type = 'light') {
    if ('vibrate' in navigator) {
        if (type === 'light') navigator.vibrate(20);
        else if (type === 'success') navigator.vibrate([30, 50, 30]);
        else if (type === 'error') navigator.vibrate([100, 30, 100]);
    }
}

// Load stored profile and custom data from localStorage
function loadUserData() {
    try {
        const saved = localStorage.getItem('brainspark_user_data');
        if (saved) {
            const data = JSON.parse(saved);
            state.xp = data.xp || 0;
            state.level = Math.floor(state.xp / 100) + 1;
            state.streak = data.streak || 0;
            state.maxStreak = data.maxStreak || 0;
            state.gamesPlayed = data.gamesPlayed || 0;
            state.questionsAnswered = data.questionsAnswered || 0;
            state.correctAnswers = data.correctAnswers || 0;
            state.unlockedBadges = data.unlockedBadges || [];
            state.missedQuestions = data.missedQuestions || [];
            state.customQuizzes = data.customQuizzes || [];
        }
    } catch (e) {
        console.warn('Could not load local user data', e);
    }
}

// Save profile data
function saveUserData() {
    try {
        const data = {
            xp: state.xp,
            streak: state.streak,
            maxStreak: state.maxStreak,
            gamesPlayed: state.gamesPlayed,
            questionsAnswered: state.questionsAnswered,
            correctAnswers: state.correctAnswers,
            unlockedBadges: state.unlockedBadges,
            missedQuestions: state.missedQuestions,
            customQuizzes: state.customQuizzes
        };
        localStorage.setItem('brainspark_user_data', JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save user data', e);
    }
}

// --- UI SETUP & EVENT LISTENERS ---
function setupUI() {
    // Sound Toggle
    const soundBtn = document.getElementById('sound-toggle');
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            triggerHaptic('light');
            const isMuted = audio.toggleMute();
            soundBtn.innerHTML = isMuted ? '🔇 Muted' : '🔊 Sound ON';
            soundBtn.classList.toggle('muted', isMuted);
        });
    }

    // Navigation Tabs (Desktop & Mobile)
    const allNavButtons = document.querySelectorAll('.nav-tab, .mobile-nav-item');
    allNavButtons.forEach(tab => {
        tab.addEventListener('click', () => {
            triggerHaptic('light');
            audio.playClick();
            
            const target = tab.dataset.target;
            allNavButtons.forEach(t => {
                if (t.dataset.target === target) t.classList.add('active');
                else t.classList.remove('active');
            });
            
            switchScreen(target);
        });
    });

    // Start Quiz Button
    const startBtn = document.getElementById('start-quiz-btn');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            triggerHaptic('light');
            audio.playClick();
            initQuizGame();
        });
    }

    // Next Question Button
    const nextBtn = document.getElementById('next-q-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            triggerHaptic('light');
            audio.playClick();
            nextQuestion();
        });
    }

    // Restart Quiz Button
    const restartBtn = document.getElementById('restart-quiz-btn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            triggerHaptic('light');
            audio.playClick();
            initQuizGame();
        });
    }

    // Online Questions Toggle
    const onlineToggle = document.getElementById('online-api-toggle');
    if (onlineToggle) {
        onlineToggle.addEventListener('change', (e) => {
            triggerHaptic('light');
            state.onlineMode = e.target.checked;
        });
    }

    // Custom Quiz Form Handler
    const customForm = document.getElementById('custom-quiz-form');
    if (customForm) {
        customForm.addEventListener('submit', (e) => {
            e.preventDefault();
            createCustomQuiz();
        });
    }
}

// Render Categories Grid
function renderCategories() {
    const container = document.getElementById('category-grid');
    if (!container) return;

    container.innerHTML = CATEGORIES.map(cat => `
        <div class="category-card ${state.selectedCategory === cat.id ? 'selected' : ''}" 
             data-id="${cat.id}" style="--cat-color: ${cat.color}">
            <div class="cat-icon">${cat.icon}</div>
            <div class="cat-name">${cat.name}</div>
        </div>
    `).join('');

    container.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', () => {
            triggerHaptic('light');
            audio.playClick();
            container.querySelectorAll('.category-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            state.selectedCategory = card.dataset.id;
        });
    });
}

// Switch App Screen Views
function switchScreen(screenId) {
    document.querySelectorAll('.screen-view').forEach(view => {
        view.classList.remove('active');
    });
    const targetView = document.getElementById(`${screenId}-screen`);
    if (targetView) {
        targetView.classList.add('active');
    }

    if (screenId === 'flashcards') {
        renderFlashcards();
    } else if (screenId === 'badges') {
        renderBadges();
    } else if (screenId === 'studio') {
        renderCustomQuizzesList();
    }
}

// Update Top User Profile Bar
function updateUserStatsUI() {
    const xpEl = document.getElementById('user-xp');
    const levelEl = document.getElementById('user-level');
    const streakEl = document.getElementById('user-streak');
    const levelProgress = document.getElementById('level-progress-bar');

    if (xpEl) xpEl.textContent = `${state.xp} XP`;
    if (levelEl) levelEl.textContent = `Lvl ${state.level}`;
    if (streakEl) streakEl.textContent = `🔥 ${state.streak}`;

    if (levelProgress) {
        const xpInCurrentLevel = state.xp % 100;
        levelProgress.style.width = `${xpInCurrentLevel}%`;
    }
}

// --- QUIZ ENGINE LOGIC ---
async function initQuizGame() {
    state.currentMode = document.querySelector('input[name="game-mode"]:checked')?.value || 'classic';
    state.selectedDifficulty = document.getElementById('difficulty-select')?.value || 'all';

    const startBtn = document.getElementById('start-quiz-btn');
    if (startBtn) startBtn.textContent = '⏳ Preparing Quiz...';

    let qPool = [];

    if (state.onlineMode) {
        const fetched = await fetchOnlineQuestions(state.selectedCategory, state.selectedDifficulty, 10);
        if (fetched && fetched.length > 0) {
            qPool = fetched;
        }
    }

    if (qPool.length === 0) {
        qPool = [...INITIAL_QUESTIONS];
        if (state.selectedCategory !== 'all') {
            qPool = qPool.filter(q => q.category === state.selectedCategory);
        }
        if (state.selectedDifficulty !== 'all') {
            qPool = qPool.filter(q => q.difficulty === state.selectedDifficulty);
        }
    }

    qPool = shuffleArray(qPool).slice(0, 10);

    if (qPool.length === 0) {
        alert('No questions available for this category and difficulty combination. Try selecting "All Topics"!');
        if (startBtn) startBtn.textContent = '🚀 Start Trivia Session';
        return;
    }

    state.questions = qPool;
    state.currentIndex = 0;
    state.score = 0;
    state.comboStreak = 0;
    state.isAnswered = false;

    if (startBtn) startBtn.textContent = '🚀 Start Trivia Session';

    switchScreen('game');
    renderQuestion();
}

// Render Current Question
function renderQuestion() {
    state.isAnswered = false;
    clearInterval(state.timerInterval);

    const q = state.questions[state.currentIndex];
    const total = state.questions.length;

    const progressEl = document.getElementById('quiz-progress-fill');
    const counterEl = document.getElementById('question-counter');
    const scoreEl = document.getElementById('live-score');
    const comboEl = document.getElementById('combo-badge');

    if (progressEl) progressEl.style.width = `${((state.currentIndex + 1) / total) * 100}%`;
    if (counterEl) counterEl.textContent = `Question ${state.currentIndex + 1} of ${total}`;
    if (scoreEl) scoreEl.textContent = `Score: ${state.score}`;

    if (comboEl) {
        if (state.comboStreak >= 2) {
            comboEl.style.display = 'inline-flex';
            comboEl.textContent = `🔥 ${state.comboStreak}x Combo!`;
        } else {
            comboEl.style.display = 'none';
        }
    }

    const qText = document.getElementById('question-text');
    const qCategory = document.getElementById('question-category-tag');
    const explanationCard = document.getElementById('explanation-card');
    const nextBtn = document.getElementById('next-q-btn');

    if (qText) qText.textContent = q.question;
    if (qCategory) qCategory.textContent = `${getCategoryIcon(q.category)} ${q.category.toUpperCase()} • ${q.difficulty.toUpperCase()}`;
    if (explanationCard) explanationCard.style.display = 'none';
    if (nextBtn) nextBtn.style.display = 'none';

    const optionsContainer = document.getElementById('options-container');
    if (optionsContainer) {
        optionsContainer.innerHTML = q.options.map((opt, idx) => `
            <button class="option-btn" data-index="${idx}">
                <span class="option-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="option-text">${opt}</span>
            </button>
        `).join('');

        optionsContainer.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = parseInt(btn.dataset.index);
                handleAnswerSelection(idx, btn);
            });
        });
    }

    startQuestionTimer();
}

// Timer Logic
function startQuestionTimer() {
    state.timeLeft = state.currentMode === 'blitz' ? 20 : 15;
    const timerCircle = document.getElementById('timer-display');
    if (timerCircle) timerCircle.textContent = state.timeLeft;

    state.timerInterval = setInterval(() => {
        state.timeLeft--;
        if (timerCircle) timerCircle.textContent = state.timeLeft;

        if (state.timeLeft <= 3 && state.timeLeft > 0) {
            audio.playTick();
        }

        if (state.timeLeft <= 0) {
            clearInterval(state.timerInterval);
            handleTimeOut();
        }
    }, 1000);
}

// Time Expired
function handleTimeOut() {
    if (state.isAnswered) return;
    state.isAnswered = true;
    triggerHaptic('error');
    audio.playWrong();

    state.comboStreak = 0;
    state.streak = 0;

    const q = state.questions[state.currentIndex];
    highlightAnswers(q.correctIndex, -1);
    showExplanation(q, '⏰ Time\'s up! Take a look at the explanation to learn why.');
    addMissedQuestion(q);
    updateUserStatsUI();
}

// Handle User Option Choice
function handleAnswerSelection(chosenIndex, clickedBtn) {
    if (state.isAnswered) return;
    state.isAnswered = true;
    clearInterval(state.timerInterval);

    const q = state.questions[state.currentIndex];
    const isCorrect = chosenIndex === q.correctIndex;

    state.questionsAnswered++;

    if (isCorrect) {
        triggerHaptic('success');
        state.correctAnswers++;
        state.comboStreak++;
        state.streak++;
        if (state.streak > state.maxStreak) state.maxStreak = state.streak;

        const speedBonus = Math.max(1, state.timeLeft);
        const comboMultiplier = Math.min(3, 1 + (state.comboStreak * 0.5));
        const earnedXP = Math.round((10 + speedBonus) * comboMultiplier);

        state.score += earnedXP;
        state.xp += earnedXP;

        const newLevel = Math.floor(state.xp / 100) + 1;
        if (newLevel > state.level) {
            state.level = newLevel;
            audio.playLevelUp();
            triggerConfetti(document.getElementById('confetti-canvas'));
        } else if (state.comboStreak >= 3) {
            audio.playCombo();
        } else {
            audio.playCorrect();
        }

        clickedBtn.classList.add('correct');
        showExplanation(q, `🎉 Excellent! You earned +${earnedXP} XP!`);
    } else {
        triggerHaptic('error');
        audio.playWrong();
        state.comboStreak = 0;
        state.streak = 0;

        clickedBtn.classList.add('wrong');
        highlightAnswers(q.correctIndex, chosenIndex);
        showExplanation(q, '💡 Not quite! Check out the explanation below to master this topic.');
        addMissedQuestion(q);
    }

    checkBadges();
    saveUserData();
    updateUserStatsUI();
}

// Highlight correct & wrong options
function highlightAnswers(correctIdx, wrongIdx) {
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === correctIdx) {
            btn.classList.add('correct');
        } else if (idx === wrongIdx) {
            btn.classList.add('wrong');
        }
    });
}

// Display Educational Explanation Card
function showExplanation(questionObj, statusMessage) {
    const card = document.getElementById('explanation-card');
    const msgEl = document.getElementById('explanation-status');
    const bodyEl = document.getElementById('explanation-body');
    const nextBtn = document.getElementById('next-q-btn');

    if (msgEl) msgEl.textContent = statusMessage;
    if (bodyEl) bodyEl.textContent = questionObj.explanation;
    if (card) card.style.display = 'block';

    if (nextBtn) {
        nextBtn.style.display = 'inline-flex';
        if (state.currentIndex === state.questions.length - 1) {
            nextBtn.textContent = '🏆 Finish Quiz & View Results';
        } else {
            nextBtn.textContent = 'Next Question ➡️';
        }
    }
}

// Progress to Next Question or Summary
function nextQuestion() {
    state.currentIndex++;
    if (state.currentIndex < state.questions.length) {
        renderQuestion();
    } else {
        finishQuizGame();
    }
}

// Finish Quiz & Show Summary
function finishQuizGame() {
    state.gamesPlayed++;
    saveUserData();

    const percentage = Math.round((state.correctAnswers / Math.max(1, state.questionsAnswered)) * 100);

    if (percentage >= 80) {
        triggerConfetti(document.getElementById('confetti-canvas'));
        audio.playLevelUp();
    }

    const modalScore = document.getElementById('summary-score');
    const modalMessage = document.getElementById('summary-message');
    const modalAccuracy = document.getElementById('summary-accuracy');
    const modalXP = document.getElementById('summary-xp');

    if (modalScore) modalScore.textContent = `${state.score} Points`;
    if (modalAccuracy) modalAccuracy.textContent = `${percentage}% Accuracy`;
    if (modalXP) modalXP.textContent = `Total XP: ${state.xp}`;

    if (modalMessage) {
        if (percentage === 100) {
            modalMessage.textContent = '🌟 Perfect Score! You are a true Knowledge Grandmaster!';
        } else if (percentage >= 70) {
            modalMessage.textContent = '👏 Great Job! Your knowledge is growing rapidly!';
        } else {
            modalMessage.textContent = '📚 Good Effort! Practice the missed questions in Flashcards mode!';
        }
    }

    switchScreen('summary');
}

// Add question to missed list for flashcards study
function addMissedQuestion(q) {
    if (!state.missedQuestions.some(item => item.id === q.id)) {
        state.missedQuestions.push(q);
        saveUserData();
    }
}

// --- FLASHCARDS MODE ---
function renderFlashcards() {
    const container = document.getElementById('flashcards-container');
    if (!container) return;

    if (state.missedQuestions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🎉</div>
                <h3>No Missed Questions Yet!</h3>
                <p>Play quizzes and any questions you miss will appear here for study.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = state.missedQuestions.map((q, idx) => `
        <div class="flashcard" data-index="${idx}">
            <div class="flashcard-inner">
                <div class="flashcard-front">
                    <span class="flashcard-tag">${getCategoryIcon(q.category)} ${q.category.toUpperCase()}</span>
                    <h4>${q.question}</h4>
                    <span class="flashcard-hint">Click card to reveal answer 🔄</span>
                </div>
                <div class="flashcard-back">
                    <h4 class="answer-title">Answer: ${q.options[q.correctIndex]}</h4>
                    <p class="explanation-text">${q.explanation}</p>
                    <button class="remove-flashcard-btn" data-id="${q.id}">Got it! Remove Card ✅</button>
                </div>
            </div>
        </div>
    `).join('');

    container.querySelectorAll('.flashcard').forEach(card => {
        card.addEventListener('click', (e) => {
            triggerHaptic('light');
            if (e.target.classList.contains('remove-flashcard-btn')) {
                const id = e.target.dataset.id;
                state.missedQuestions = state.missedQuestions.filter(item => item.id !== id);
                saveUserData();
                renderFlashcards();
                return;
            }
            card.classList.toggle('flipped');
        });
    });
}

// --- CUSTOM QUIZ STUDIO ---
function createCustomQuiz() {
    const title = document.getElementById('custom-title')?.value;
    const questionText = document.getElementById('custom-q-text')?.value;
    const optA = document.getElementById('custom-opt-a')?.value;
    const optB = document.getElementById('custom-opt-b')?.value;
    const optC = document.getElementById('custom-opt-c')?.value;
    const optD = document.getElementById('custom-opt-d')?.value;
    const correctIndex = parseInt(document.getElementById('custom-correct-idx')?.value || '0');
    const explanation = document.getElementById('custom-explanation')?.value;

    if (!title || !questionText || !optA || !optB) {
        alert('Please fill in the title, question, and at least 2 options!');
        return;
    }

    const newCustomQ = {
        id: `custom_${Date.now()}`,
        category: 'general',
        difficulty: 'medium',
        question: questionText,
        options: [optA, optB, optC || 'Option C', optD || 'Option D'],
        correctIndex: correctIndex,
        explanation: explanation || 'Custom question generated in Studio!'
    };

    let existingQuiz = state.customQuizzes.find(q => q.title === title);
    if (existingQuiz) {
        existingQuiz.questions.push(newCustomQ);
    } else {
        state.customQuizzes.push({
            id: `quiz_${Date.now()}`,
            title: title,
            questions: [newCustomQ]
        });
    }

    saveUserData();
    document.getElementById('custom-quiz-form')?.reset();
    renderCustomQuizzesList();
    alert('✨ Custom Question Created Successfully!');
}

function renderCustomQuizzesList() {
    const container = document.getElementById('custom-quizzes-list');
    if (!container) return;

    if (state.customQuizzes.length === 0) {
        container.innerHTML = `<p class="empty-text">No custom quizzes created yet. Use the form above to build one!</p>`;
        return;
    }

    container.innerHTML = state.customQuizzes.map(quiz => `
        <div class="custom-quiz-item">
            <div>
                <h4>${quiz.title}</h4>
                <p>${quiz.questions.length} Question(s)</p>
            </div>
            <button class="play-custom-btn" data-id="${quiz.id}">Play Quiz 🚀</button>
        </div>
    `).join('');

    container.querySelectorAll('.play-custom-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            triggerHaptic('light');
            const quizId = btn.dataset.id;
            const quiz = state.customQuizzes.find(q => q.id === quizId);
            if (quiz && quiz.questions.length > 0) {
                state.questions = [...quiz.questions];
                state.currentIndex = 0;
                state.score = 0;
                state.comboStreak = 0;
                switchScreen('game');
                renderQuestion();
            }
        });
    });
}

// --- BADGES SYSTEM ---
function checkBadges() {
    let unlockedNew = false;

    if (state.gamesPlayed >= 1 && !state.unlockedBadges.includes('first_win')) {
        state.unlockedBadges.push('first_win');
        unlockedNew = true;
    }
    if (state.comboStreak >= 5 && !state.unlockedBadges.includes('streak_5')) {
        state.unlockedBadges.push('streak_5');
        unlockedNew = true;
    }
    if (state.level >= 5 && !state.unlockedBadges.includes('level_5')) {
        state.unlockedBadges.push('level_5');
        unlockedNew = true;
    }

    if (unlockedNew) {
        saveUserData();
    }
}

function renderBadges() {
    const container = document.getElementById('badges-grid');
    if (!container) return;

    container.innerHTML = BADGES.map(b => {
        const isUnlocked = state.unlockedBadges.includes(b.id);
        return `
            <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="badge-icon">${b.icon}</div>
                <div class="badge-title">${b.title}</div>
                <div class="badge-desc">${b.desc}</div>
                <div class="badge-status">${isUnlocked ? 'Unlocked ✨' : 'Locked 🔒'}</div>
            </div>
        `;
    }).join('');
}

// Helper Utilities
function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

function getCategoryIcon(catId) {
    const found = CATEGORIES.find(c => c.id === catId);
    return found ? found.icon : '❓';
}
