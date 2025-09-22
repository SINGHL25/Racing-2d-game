/**
 * Main Game Loop - 2D Car Racing Game
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.setupCanvas();
        
        // Game objects
        this.player = null;
        this.obstacles = [];
        this.collectibles = [];
        this.fuelPickups = [];
        this.powerUps = [];
        
        // Spawning timers
        this.lastObstacleSpawn = 0;
        this.lastCollectibleSpawn = 0;
        this.lastFuelSpawn = 0;
        this.lastPowerUpSpawn = 0;
        
        // Game loop
        this.lastTime = 0;
        this.isRunning = false;
        
        // Background
        this.roadOffset = 0;
        this.roadSpeed = 200;
        
        this.initializeGame();
        this.startGameLoop();
    }
    
    setupCanvas() {
        // Set canvas size
        const maxWidth = Math.min(window.innerWidth - 40, 800);
        const maxHeight = Math.min(window.innerHeight - 40, 600);
        
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;
        
        // Setup canvas properties
        this.ctx.imageSmoothingEnabled = false;
        
        console.log(`Canvas size: ${this.canvas.width}x${this.canvas.height}`);
    }
    
    initializeGame() {
        // Create player car
        this.player = new PlayerCar(
            this.canvas.width / 2 - 20,
            this.canvas.height - 100
        );
        
        // Reset spawn timers
        this.resetSpawnTimers();
        
        console.log('Game initialized');
    }
    
    resetSpawnTimers() {
        const currentTime = Date.now() / 1000;
        this.lastObstacleSpawn = currentTime;
        this.lastCollectibleSpawn = currentTime;
        this.lastFuelSpawn = currentTime;
        this.lastPowerUpSpawn = currentTime;
    }
    
    startGameLoop() {
        this.isRunning = true;
        this.gameLoop();
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Limit delta time to prevent large jumps
        const clampedDeltaTime = Math.min(deltaTime, 0.016);
        
        this.update(clampedDeltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // Update game state
        gameState.update(deltaTime);
        
        // Only update game objects when playing
        if (gameState.currentState !== 'playing') {
            uiManager.updateGameUI();
            // Still update particles for game over effects
            particleSystem.update(deltaTime);
            return;
        }
        
        // Update background
        this.roadOffset += this.roadSpeed * deltaTime;
        if (this.roadOffset >= 50) {
            this.roadOffset = 0;
        }
        
        // Update player
        this.player.update(deltaTime, this.canvas.width);
        
        // Spawn new objects
        this.spawnObjects();
        
        // Update all game objects
        this.updateGameObjects(deltaTime);
        
        // Check collisions (before updating particles for immediate effect)
        this.checkCollisions();
        
        // Update particle system after collisions for immediate effect
        particleSystem.update(deltaTime);
        
        // Clean up off-screen objects
        this.cleanupObjects();
        
        // Update UI
        uiManager.updateGameUI();
    }
    
    spawnObjects() {
        const currentTime = Date.now() / 1000;
        const difficulty = gameState.currentDifficulty;
        
        // Spawn obstacles
        if (currentTime - this.lastObstacleSpawn >= difficulty.obstacleSpawnRate) {
            this.spawnObstacle();
            this.lastObstacleSpawn = currentTime;
        }
        
        // Spawn collectibles
        if (currentTime - this.lastCollectibleSpawn >= difficulty.collectibleSpawnRate) {
            this.spawnCollectible();
            this.lastCollectibleSpawn = currentTime;
        }
        
        // Spawn fuel pickups
        if (currentTime - this.lastFuelSpawn >= difficulty.fuelSpawnRate) {
            this.spawnFuelPickup();
            this.lastFuelSpawn = currentTime;
        }
        
        // Spawn power-ups
        if (currentTime - this.lastPowerUpSpawn >= difficulty.powerUpSpawnRate) {
            this.spawnPowerUp();
            this.lastPowerUpSpawn = currentTime;
        }
    }
    
    spawnObstacle() {
        const types = ['cone', 'car', 'truck'];
        const weights = [0.5, 0.3, 0.2]; // Probability weights
        
        let type = 'cone';
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < types.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                type = types[i];
                break;
            }
        }
        
        const x = Math.random() * (this.canvas.width - 50);
        const obstacle = new Obstacle(x, -50, type);
        obstacle.setSpeed(gameState.currentDifficulty.obstacleSpeed);
        
        this.obstacles.push(obstacle);
        
        console.log(`Spawned obstacle: ${type} at x=${Math.round(x)}`);
    }
    
    spawnCollectible() {
        const type = Math.random() < 0.7 ? 'star' : 'coin';
        const x = Math.random() * (this.canvas.width - 25);
        const collectible = new Collectible(x, -30, type);
        collectible.setSpeed(100 + Math.random() * 50);
        
        this.collectibles.push(collectible);
        
        console.log(`Spawned collectible: ${type} at x=${Math.round(x)}`);
    }
    
    spawnFuelPickup() {
        const x = Math.random() * (this.canvas.width - 30);
        const fuelPickup = new FuelPickup(x, -40);
        fuelPickup.setSpeed(120 + Math.random() * 30);
        
        this.fuelPickups.push(fuelPickup);
        
        console.log(`Spawned fuel pickup at x=${Math.round(x)}`);
    }
    
    spawnPowerUp() {
        const types = ['speed', 'shield', 'invincibility', 'magnetic'];
        const weights = [0.35, 0.35, 0.15, 0.15]; // Probability weights
        
        let type = 'speed';
        const random = Math.random();
        let cumulative = 0;
        
        for (let i = 0; i < types.length; i++) {
            cumulative += weights[i];
            if (random <= cumulative) {
                type = types[i];
                break;
            }
        }
        const x = Math.random() * (this.canvas.width - 35);
        const powerUp = new PowerUp(x, -35, type);
        powerUp.setSpeed(110 + Math.random() * 40);
        
        this.powerUps.push(powerUp);
        
        console.log(`Spawned power-up: ${type} at x=${Math.round(x)}`);
    }
    
    updateGameObjects(deltaTime) {
        // Update obstacles
        this.obstacles.forEach(obstacle => obstacle.update(deltaTime));
        
        // Update collectibles
        this.collectibles.forEach(collectible => collectible.update(deltaTime));
        
        // Update fuel pickups
        this.fuelPickups.forEach(fuel => fuel.update(deltaTime));
        
        // Update power-ups
        this.powerUps.forEach(powerUp => powerUp.update(deltaTime));
    }
    
    checkCollisions() {
        // Check obstacle collisions
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            
            if (this.player.collidesWith(obstacle)) {
                // Create explosion effect at collision point
                const explosionX = (this.player.x + this.player.width / 2 + obstacle.x + obstacle.width / 2) / 2;
                const explosionY = (this.player.y + this.player.height / 2 + obstacle.y + obstacle.height / 2) / 2;
                
                if (this.player.takeDamage()) {
                    // Player took damage - game over
                    particleSystem.createExplosion(explosionX, explosionY, 2);
                    gameState.gameOver('Crashed into obstacle!');
                    uiManager.flashScreen('rgba(255, 0, 0, 0.5)', 300);
                } else {
                    // Shield absorbed damage
                    particleSystem.createExplosion(explosionX, explosionY, 1);
                    uiManager.flashScreen('rgba(0, 255, 255, 0.3)', 200);
                }
                
                // Remove obstacle
                this.obstacles.splice(i, 1);
                audioManager.playHitSound();
                break;
            }
        }
        
        // Check collectible collisions
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            
            if (this.player.collidesWith(collectible)) {
                gameState.addScore(collectible.points);
                gameState.itemsCollected++;
                
                // Create collect effect
                particleSystem.createCollectEffect(
                    collectible.x + collectible.width / 2,
                    collectible.y + collectible.height / 2
                );
                
                // Visual feedback
                uiManager.showScorePopup(
                    collectible.points,
                    collectible.x + collectible.width / 2,
                    collectible.y + collectible.height / 2
                );
                
                this.collectibles.splice(i, 1);
                audioManager.playSuccessSound();
            }
        }
        
        // Check fuel pickup collisions
        for (let i = this.fuelPickups.length - 1; i >= 0; i--) {
            const fuel = this.fuelPickups[i];
            
            if (this.player.collidesWith(fuel)) {
                gameState.addFuel(fuel.fuelAmount);
                
                // Create fuel collect effect with green particles
                particleSystem.createPowerUpEffect(
                    fuel.x + fuel.width / 2,
                    fuel.y + fuel.height / 2,
                    'fuel'
                );
                
                // Visual feedback
                uiManager.showScorePopup(
                    'FUEL',
                    fuel.x + fuel.width / 2,
                    fuel.y + fuel.height / 2
                );
                
                this.fuelPickups.splice(i, 1);
                audioManager.playSuccessSound();
            }
        }
        
        // Check power-up collisions
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (this.player.collidesWith(powerUp)) {
                // Create power-up effect
                particleSystem.createPowerUpEffect(
                    powerUp.x + powerUp.width / 2,
                    powerUp.y + powerUp.height / 2,
                    powerUp.type
                );
                
                if (powerUp.type === 'speed') {
                    this.player.activateSpeedBoost(3);
                    uiManager.showPowerUpIndicator('speedBoost', 3);
                } else if (powerUp.type === 'shield') {
                    this.player.activateShield(5);
                    uiManager.showPowerUpIndicator('shield', 5);
                } else if (powerUp.type === 'invincibility') {
                    this.player.activateInvincibility(4);
                    uiManager.showPowerUpIndicator('invincibility', 4);
                } else if (powerUp.type === 'magnetic') {
                    this.player.activateMagnetic(6);
                    uiManager.showPowerUpIndicator('magnetic', 6);
                }
                
                // Visual feedback
                uiManager.showScorePopup(
                    powerUp.type.toUpperCase(),
                    powerUp.x + powerUp.width / 2,
                    powerUp.y + powerUp.height / 2
                );
                
                this.powerUps.splice(i, 1);
                audioManager.playSuccessSound();
            }
        }
    }
    
    cleanupObjects() {
        // Remove off-screen obstacles
        this.obstacles = this.obstacles.filter(obstacle => !obstacle.isOffScreen(this.canvas.height));
        
        // Remove off-screen collectibles
        this.collectibles = this.collectibles.filter(collectible => !collectible.isOffScreen(this.canvas.height));
        
        // Remove off-screen fuel pickups
        this.fuelPickups = this.fuelPickups.filter(fuel => !fuel.isOffScreen(this.canvas.height));
        
        // Remove off-screen power-ups
        this.powerUps = this.powerUps.filter(powerUp => !powerUp.isOffScreen(this.canvas.height));
        
        // Count obstacles that passed for stats
        const initialCount = this.obstacles.length + this.collectibles.length + this.fuelPickups.length + this.powerUps.length;
        // This is simplified - in a real implementation you'd track this more accurately
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.drawBackground();
        
        // Only draw game objects when playing
        if (gameState.currentState === 'playing') {
            this.drawGameObjects();
        }
        
        // Always draw particles (including explosion effects on game over)
        particleSystem.draw(this.ctx);
    }
    
    drawBackground() {
        // Sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(1, '#98FB98');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Road
        this.ctx.fillStyle = '#444444';
        const roadWidth = this.canvas.width * 0.8;
        const roadX = (this.canvas.width - roadWidth) / 2;
        this.ctx.fillRect(roadX, 0, roadWidth, this.canvas.height);
        
        // Road markings
        this.ctx.fillStyle = '#FFFF00';
        const markingWidth = 4;
        const markingHeight = 30;
        const markingGap = 20;
        
        for (let y = -markingHeight + this.roadOffset; y < this.canvas.height + markingHeight; y += markingHeight + markingGap) {
            this.ctx.fillRect(
                this.canvas.width / 2 - markingWidth / 2,
                y,
                markingWidth,
                markingHeight
            );
        }
        
        // Road edges
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(roadX - 2, 0, 4, this.canvas.height);
        this.ctx.fillRect(roadX + roadWidth - 2, 0, 4, this.canvas.height);
        
        // Side grass/scenery
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, 0, roadX, this.canvas.height);
        this.ctx.fillRect(roadX + roadWidth, 0, this.canvas.width - (roadX + roadWidth), this.canvas.height);
    }
    
    drawGameObjects() {
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw obstacles
        this.obstacles.forEach(obstacle => obstacle.draw(this.ctx));
        
        // Draw collectibles
        this.collectibles.forEach(collectible => collectible.draw(this.ctx));
        
        // Draw fuel pickups
        this.fuelPickups.forEach(fuel => fuel.draw(this.ctx));
        
        // Draw power-ups
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
    }
    
    // Handle window resize
    handleResize() {
        this.setupCanvas();
        
        // Reposition player to stay centered
        if (this.player) {
            this.player.x = this.canvas.width / 2 - this.player.width / 2;
        }
    }
    
    // Reset game for new game
    resetGame() {
        this.obstacles = [];
        this.collectibles = [];
        this.fuelPickups = [];
        this.powerUps = [];
        
        this.player = new PlayerCar(
            this.canvas.width / 2 - 20,
            this.canvas.height - 100
        );
        
        this.resetSpawnTimers();
        
        console.log('Game reset');
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    console.log('Initializing 2D Car Racing Game...');
    
    const game = new Game();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        game.handleResize();
    });
    
    // Handle game state changes
    gameState.currentState = 'start';
    
    // Listen for game restart
    document.addEventListener('gameRestart', () => {
        game.resetGame();
    });
    
    console.log('Game ready! Click Start to begin.');
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause background music when tab is hidden
        audioManager.sounds.background.pause();
    } else {
        // Resume music when tab is visible (if not muted)
        if (!audioManager.isMuted && gameState.currentState === 'playing') {
            audioManager.playBackgroundMusic();
        }
    }
});
