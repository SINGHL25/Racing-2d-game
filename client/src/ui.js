/**
 * UI Manager - Handles all user interface elements and screens
 */
class UIManager {
    constructor() {
        this.elements = {
            // Screens
            startScreen: document.getElementById('startScreen'),
            gameOverScreen: document.getElementById('gameOverScreen'),
            levelCompleteScreen: document.getElementById('levelCompleteScreen'),
            
            // Buttons
            startButton: document.getElementById('startButton'),
            restartButton: document.getElementById('restartButton'),
            nextLevelButton: document.getElementById('nextLevelButton'),
            
            // Game UI
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            fuelFill: document.getElementById('fuelFill'),
            
            // Power-up indicators
            speedBoostIndicator: document.getElementById('speedBoostIndicator'),
            shieldIndicator: document.getElementById('shieldIndicator'),
            invincibilityIndicator: document.getElementById('invincibilityIndicator'),
            magneticIndicator: document.getElementById('magneticIndicator'),
            
            // Game over screen elements
            finalScore: document.querySelector('#finalScore span'),
            finalLevel: document.querySelector('#finalLevel span'),
            
            // Level complete screen elements
            levelScore: document.querySelector('#levelScore span'),
            bonusPoints: document.querySelector('#bonusPoints span')
        };
        
        this.setupEventListeners();
        
        // Initialize start screen high score display
        setTimeout(() => this.updateStartScreenHighScore(), 100);
    }
    
    setupEventListeners() {
        this.elements.startButton.addEventListener('click', () => {
            this.hideStartScreen();
            gameState.startGame();
        });
        
        this.elements.restartButton.addEventListener('click', () => {
            this.hideGameOverScreen();
            this.hideStartScreen();
            gameState.startGame();
        });
        
        this.elements.nextLevelButton.addEventListener('click', () => {
            gameState.nextLevel();
        });
        
        // Enable audio on first user interaction
        document.addEventListener('click', () => {
            audioManager.playBackgroundMusic();
        }, { once: true });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                
                if (gameState.currentState === 'start') {
                    this.elements.startButton.click();
                } else if (gameState.currentState === 'gameOver') {
                    this.elements.restartButton.click();
                } else if (gameState.currentState === 'levelComplete') {
                    this.elements.nextLevelButton.click();
                }
            }
            
            // Mute toggle
            if (e.code === 'KeyM') {
                audioManager.toggleMute();
            }
        });
    }
    
    updateGameUI() {
        const stats = gameState.getGameStats();
        
        // Update score and level
        this.elements.score.textContent = stats.score;
        this.elements.level.textContent = stats.level;
        
        // Update fuel bar
        this.elements.fuelFill.style.width = `${stats.fuelPercentage}%`;
        
        // Change fuel bar color based on level
        const fuelColor = this.getFuelBarColor(stats.fuelPercentage);
        this.elements.fuelFill.style.background = fuelColor;
    }
    
    getFuelBarColor(percentage) {
        if (percentage > 60) {
            return 'linear-gradient(90deg, #44ff44 0%, #88ff44 100%)';
        } else if (percentage > 30) {
            return 'linear-gradient(90deg, #ffaa00 0%, #ffcc44 100%)';
        } else {
            return 'linear-gradient(90deg, #ff4444 0%, #ff6666 100%)';
        }
    }
    
    showPowerUpIndicator(type, duration) {
        const indicator = this.elements[type + 'Indicator'];
        if (!indicator) return;
        
        indicator.classList.remove('hidden');
        
        // Animate the timer bar
        const timerBar = indicator.querySelector('.power-up-timer');
        if (timerBar) {
            timerBar.style.animationDuration = `${duration}s`;
        }
        
        // Hide after duration
        setTimeout(() => {
            indicator.classList.add('hidden');
        }, duration * 1000);
    }
    
    hidePowerUpIndicator(type) {
        const indicator = this.elements[type + 'Indicator'];
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }
    
    showStartScreen() {
        this.elements.startScreen.classList.remove('hidden');
        this.updateStartScreenHighScore();
    }
    
    updateStartScreenHighScore() {
        const highScoreElement = document.getElementById('startHighScoreValue');
        if (highScoreElement && gameState) {
            highScoreElement.textContent = gameState.highScore;
        }
    }
    
    hideStartScreen() {
        this.elements.startScreen.classList.add('hidden');
    }
    
    showGameOverScreen(score, level, highScore = 0, isNewHighScore = false, customMessage = null) {
        this.elements.finalScore.textContent = score;
        this.elements.finalLevel.textContent = level;
        
        // Update title if custom message provided or if new high score
        const title = this.elements.gameOverScreen.querySelector('h1');
        if (isNewHighScore) {
            title.textContent = '🎉 New High Score! 🎉';
            title.style.color = '#ffd700';
        } else if (customMessage) {
            title.textContent = customMessage;
            title.style.color = '#ffd700';
        } else {
            title.textContent = 'Game Over!';
            title.style.color = '#ffd700';
        }
        
        // Show/update high score information
        this.updateHighScoreDisplay(highScore, isNewHighScore);
        
        this.elements.gameOverScreen.classList.remove('hidden');
    }
    
    hideGameOverScreen() {
        this.elements.gameOverScreen.classList.add('hidden');
    }
    
    showLevelComplete(score, bonus) {
        this.elements.levelScore.textContent = score - bonus;
        this.elements.bonusPoints.textContent = `+${bonus}`;
        this.elements.levelCompleteScreen.classList.remove('hidden');
    }
    
    hideLevelComplete() {
        this.elements.levelCompleteScreen.classList.add('hidden');
    }
    
    updateHighScoreDisplay(highScore, isNewHighScore = false) {
        // Find or create high score display in game over screen
        let highScoreElement = document.getElementById('highScoreDisplay');
        if (!highScoreElement) {
            highScoreElement = document.createElement('div');
            highScoreElement.id = 'highScoreDisplay';
            highScoreElement.style.cssText = `
                margin: 15px 0;
                font-size: 18px;
                color: ${isNewHighScore ? '#ffd700' : '#fff'};
                font-weight: bold;
            `;
            
            // Insert after final level display
            const finalLevel = this.elements.gameOverScreen.querySelector('#finalLevel');
            if (finalLevel) {
                finalLevel.parentNode.insertBefore(highScoreElement, finalLevel.nextSibling);
            }
        }
        
        highScoreElement.textContent = `High Score: ${highScore}`;
        highScoreElement.style.color = isNewHighScore ? '#ffd700' : '#fff';
        
        if (isNewHighScore) {
            // Add pulse animation CSS if not already present
            if (!document.querySelector('#pulseAnimationStyle')) {
                const style = document.createElement('style');
                style.id = 'pulseAnimationStyle';
                style.textContent = `
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); opacity: 1; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                    }
                `;
                document.head.appendChild(style);
            }
            highScoreElement.style.animation = 'pulse 2s infinite';
        } else {
            highScoreElement.style.animation = 'none';
        }
    }
    
    // Visual feedback methods
    showScorePopup(points, x, y) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = `+${points}`;
        popup.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            color: #ffd700;
            font-weight: bold;
            font-size: 18px;
            pointer-events: none;
            z-index: 1000;
            animation: scorePopup 1s ease-out forwards;
        `;
        
        document.body.appendChild(popup);
        
        // Add CSS animation if not already present
        if (!document.querySelector('#scorePopupStyle')) {
            const style = document.createElement('style');
            style.id = 'scorePopupStyle';
            style.textContent = `
                @keyframes scorePopup {
                    0% { opacity: 1; transform: translateY(0); }
                    100% { opacity: 0; transform: translateY(-50px); }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            popup.remove();
        }, 1000);
    }
    
    flashScreen(color = 'rgba(255, 0, 0, 0.3)', duration = 200) {
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: ${color};
            pointer-events: none;
            z-index: 9999;
            animation: flashEffect ${duration}ms ease-out;
        `;
        
        document.body.appendChild(flash);
        
        // Add CSS animation if not already present
        if (!document.querySelector('#flashEffectStyle')) {
            const style = document.createElement('style');
            style.id = 'flashEffectStyle';
            style.textContent = `
                @keyframes flashEffect {
                    0% { opacity: 1; }
                    100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            flash.remove();
        }, duration);
    }
    
    // Responsive design helpers
    isSmallScreen() {
        return window.innerWidth <= 768;
    }
    
    isMobile() {
        return window.innerWidth <= 480;
    }
}

// Global UI manager instance
const uiManager = new UIManager();
