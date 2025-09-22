/**
 * Game State Manager - Handles game states, levels, and progression
 */
class GameState {
    constructor() {
        this.currentState = 'start'; // start, playing, gameOver, levelComplete
        this.score = 0;
        this.level = 1;
        this.maxLevel = 5;
        this.fuel = 100;
        this.maxFuel = 100;
        this.fuelConsumptionRate = 8; // fuel per second
        
        // Level progression
        this.levelStartTime = 0;
        this.levelDuration = 30; // seconds per level
        this.levelProgress = 0;
        
        // Difficulty scaling
        this.baseDifficulty = {
            obstacleSpawnRate: 1.5, // seconds between spawns
            collectibleSpawnRate: 3,
            fuelSpawnRate: 8,
            powerUpSpawnRate: 12,
            obstacleSpeed: 150
        };
        
        this.currentDifficulty = { ...this.baseDifficulty };
        
        // Game statistics
        this.startTime = 0;
        this.totalPlayTime = 0;
        this.itemsCollected = 0;
        this.obstaclesAvoided = 0;
        
        // High score system
        this.isNewHighScore = false;
        // Load high score from localStorage
        try {
            const savedScore = localStorage.getItem('carRacingHighScore');
            this.highScore = savedScore ? parseInt(savedScore) : 0;
            console.log(`High score loaded: ${this.highScore}`);
        } catch (error) {
            console.warn('Could not load high score from localStorage:', error);
            this.highScore = 0;
        }
    }
    
    startGame() {
        this.currentState = 'playing';
        this.score = 0;
        this.level = 1;
        this.fuel = this.maxFuel;
        this.levelStartTime = Date.now();
        this.startTime = Date.now();
        this.levelProgress = 0;
        this.itemsCollected = 0;
        this.obstaclesAvoided = 0;
        this.isNewHighScore = false;
        
        this.updateDifficulty();
        audioManager.playBackgroundMusic();
        
        console.log('Game started');
    }
    
    update(deltaTime) {
        if (this.currentState !== 'playing') return;
        
        // Update fuel consumption
        this.fuel -= this.fuelConsumptionRate * deltaTime;
        this.fuel = Math.max(0, this.fuel);
        
        // Check fuel depletion
        if (this.fuel <= 0) {
            this.gameOver('Out of fuel!');
            return;
        }
        
        // Update level progress
        const currentTime = Date.now();
        const levelElapsed = (currentTime - this.levelStartTime) / 1000;
        this.levelProgress = Math.min(levelElapsed / this.levelDuration, 1);
        
        // Check level completion
        if (this.levelProgress >= 1) {
            this.completeLevel();
        }
        
        // Update total play time
        this.totalPlayTime = (currentTime - this.startTime) / 1000;
    }
    
    completeLevel() {
        if (this.level >= this.maxLevel) {
            this.gameWon();
            return;
        }
        
        // Calculate level completion bonus
        const timeBonus = Math.floor((this.levelDuration - (Date.now() - this.levelStartTime) / 1000) * 10);
        const fuelBonus = Math.floor(this.fuel * 5);
        const totalBonus = Math.max(0, timeBonus + fuelBonus);
        
        this.addScore(totalBonus);
        this.currentState = 'levelComplete';
        
        audioManager.playSuccessSound();
        
        console.log(`Level ${this.level} complete! Bonus: ${totalBonus}`);
        
        // Update UI
        uiManager.showLevelComplete(this.score, totalBonus);
    }
    
    nextLevel() {
        this.level++;
        this.levelStartTime = Date.now();
        this.levelProgress = 0;
        this.currentState = 'playing';
        
        // Restore some fuel for next level
        this.fuel = Math.min(this.maxFuel, this.fuel + 30);
        
        this.updateDifficulty();
        
        console.log(`Starting level ${this.level}`);
        
        // Hide level complete screen
        uiManager.hideLevelComplete();
    }
    
    updateDifficulty() {
        const difficultyMultiplier = 1 + (this.level - 1) * 0.3;
        
        this.currentDifficulty = {
            obstacleSpawnRate: Math.max(0.5, this.baseDifficulty.obstacleSpawnRate / difficultyMultiplier),
            collectibleSpawnRate: Math.max(1.5, this.baseDifficulty.collectibleSpawnRate / (difficultyMultiplier * 0.8)),
            fuelSpawnRate: Math.max(4, this.baseDifficulty.fuelSpawnRate / (difficultyMultiplier * 0.6)),
            powerUpSpawnRate: Math.max(6, this.baseDifficulty.powerUpSpawnRate / (difficultyMultiplier * 0.7)),
            obstacleSpeed: this.baseDifficulty.obstacleSpeed * difficultyMultiplier
        };
        
        console.log(`Level ${this.level} difficulty:`, this.currentDifficulty);
    }
    
    addScore(points) {
        this.score += points;
        console.log(`Score increased by ${points}. Total: ${this.score}`);
    }
    
    addFuel(amount) {
        const oldFuel = this.fuel;
        this.fuel = Math.min(this.maxFuel, this.fuel + amount);
        const actualAdded = this.fuel - oldFuel;
        
        console.log(`Fuel restored: ${actualAdded}. Current: ${this.fuel}`);
        return actualAdded;
    }
    
    gameOver(reason = 'Game Over') {
        this.currentState = 'gameOver';
        audioManager.stopBackgroundMusic();
        audioManager.playHitSound();
        
        // Check for new high score
        this.checkHighScore();
        
        console.log('Game Over:', reason);
        
        // Update UI
        uiManager.showGameOverScreen(this.score, this.level, this.highScore, this.isNewHighScore);
    }
    
    gameWon() {
        this.currentState = 'gameWon';
        audioManager.stopBackgroundMusic();
        audioManager.playSuccessSound();
        
        // Final bonus for completing all levels
        const completionBonus = 5000;
        this.addScore(completionBonus);
        
        // Check for new high score
        this.checkHighScore();
        
        console.log('Game Won! All levels completed!');
        
        // Show as game over with special message
        uiManager.showGameOverScreen(this.score, this.level, this.highScore, this.isNewHighScore, 'Congratulations! You completed all levels!');
    }
    
    restartGame() {
        this.currentState = 'start';
        audioManager.stopBackgroundMusic();
        
        // Reset all stats
        this.score = 0;
        this.level = 1;
        this.fuel = this.maxFuel;
        this.levelProgress = 0;
        this.totalPlayTime = 0;
        this.itemsCollected = 0;
        this.obstaclesAvoided = 0;
        
        this.updateDifficulty();
        
        console.log('Game reset');
    }
    
    // Getters for UI
    getFuelPercentage() {
        return (this.fuel / this.maxFuel) * 100;
    }
    
    getLevelProgress() {
        return this.levelProgress * 100;
    }
    
    getGameStats() {
        return {
            score: this.score,
            level: this.level,
            fuel: Math.round(this.fuel),
            fuelPercentage: this.getFuelPercentage(),
            levelProgress: this.getLevelProgress(),
            playTime: Math.round(this.totalPlayTime),
            itemsCollected: this.itemsCollected,
            obstaclesAvoided: this.obstaclesAvoided,
            highScore: this.highScore,
            isNewHighScore: this.isNewHighScore
        };
    }
    
    // High Score Management
    
    saveHighScore() {
        try {
            localStorage.setItem('carRacingHighScore', this.highScore.toString());
            console.log(`New high score saved: ${this.highScore}`);
        } catch (error) {
            console.warn('Could not save high score to localStorage:', error);
        }
    }
    
    checkHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.isNewHighScore = true;
            this.saveHighScore();
            console.log(`New high score achieved: ${this.highScore}!`);
        } else {
            this.isNewHighScore = false;
        }
    }
}

// Global game state instance
const gameState = new GameState();
