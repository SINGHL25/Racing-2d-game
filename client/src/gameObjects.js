/**
 * Game Objects - Player car, obstacles, collectibles, and power-ups
 */

// Base GameObject class
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.active = true;
    }
    
    update(deltaTime) {
        this.x += this.speedX * deltaTime;
        this.y += this.speedY * deltaTime;
    }
    
    draw(ctx) {
        // Override in subclasses
    }
    
    // Simple AABB collision detection
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
    
    isOffScreen(canvasHeight) {
        return this.y > canvasHeight + 50;
    }
}

// Player Car
class PlayerCar extends GameObject {
    constructor(x, y) {
        super(x, y, 40, 70);
        this.baseSpeed = 300; // pixels per second
        this.currentSpeed = this.baseSpeed;
        this.maxSpeed = 500;
        this.acceleration = 800;
        this.friction = 0.85;
        
        // Power-up states
        this.hasShield = false;
        this.shieldTimer = 0;
        this.speedBoostTimer = 0;
        this.speedBoostMultiplier = 1.5;
        this.invincibilityTimer = 0;
        this.magneticTimer = 0;
        this.magneticRange = 80; // pixels
        
        // Animation
        this.bounceOffset = 0;
        this.bounceSpeed = 5;
    }
    
    update(deltaTime, canvasWidth) {
        // Handle input
        const horizontalInput = inputManager.getHorizontalInput();
        
        // Apply acceleration based on input
        this.speedX += horizontalInput * this.acceleration * deltaTime;
        
        // Apply friction
        this.speedX *= this.friction;
        
        // Limit speed
        const maxSpeed = this.hasSpeedBoost() ? this.maxSpeed * this.speedBoostMultiplier : this.maxSpeed;
        this.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, this.speedX));
        
        // Update position
        super.update(deltaTime);
        
        // Keep within canvas bounds
        this.x = Math.max(0, Math.min(canvasWidth - this.width, this.x));
        
        // Update power-up timers
        this.updatePowerUps(deltaTime);
        
        // Update animation
        this.bounceOffset = Math.sin(Date.now() * 0.01 * this.bounceSpeed) * 2;
        
        // Create spark trail when speed boost is active
        if (this.hasSpeedBoost() && Math.random() < 0.7) {
            particleSystem.createSparkTrail(
                this.x + this.width / 2 + (Math.random() - 0.5) * this.width,
                this.y + this.height - 5,
                2
            );
        }
    }
    
    updatePowerUps(deltaTime) {
        if (this.shieldTimer > 0) {
            this.shieldTimer -= deltaTime;
            if (this.shieldTimer <= 0) {
                this.hasShield = false;
                console.log('Shield expired');
            }
        }
        
        if (this.speedBoostTimer > 0) {
            this.speedBoostTimer -= deltaTime;
            if (this.speedBoostTimer <= 0) {
                console.log('Speed boost expired');
            }
        }
        
        if (this.invincibilityTimer > 0) {
            this.invincibilityTimer -= deltaTime;
            if (this.invincibilityTimer <= 0) {
                console.log('Invincibility expired');
            }
        }
        
        if (this.magneticTimer > 0) {
            this.magneticTimer -= deltaTime;
            if (this.magneticTimer <= 0) {
                console.log('Magnetic effect expired');
            }
        }
    }
    
    draw(ctx) {
        const drawY = this.y + this.bounceOffset;
        
        // Draw shield effect
        if (this.hasShield) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.strokeStyle = '#00ffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, drawY + this.height/2, this.width/2 + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
        
        // Draw car body
        ctx.fillStyle = this.hasSpeedBoost() ? '#ff4444' : '#4444ff';
        ctx.fillRect(this.x, drawY, this.width, this.height);
        
        // Draw car details
        ctx.fillStyle = '#333';
        // Wheels
        ctx.fillRect(this.x - 3, drawY + 10, 6, 15);
        ctx.fillRect(this.x + this.width - 3, drawY + 10, 6, 15);
        ctx.fillRect(this.x - 3, drawY + this.height - 25, 6, 15);
        ctx.fillRect(this.x + this.width - 3, drawY + this.height - 25, 6, 15);
        
        // Windshield
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(this.x + 5, drawY + 5, this.width - 10, 15);
        
        // Speed boost effect
        if (this.hasSpeedBoost()) {
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = '#ffaa00';
            for (let i = 0; i < 3; i++) {
                ctx.fillRect(this.x + 5 + i * 10, drawY + this.height + 5 + i * 8, 8, 20);
            }
            ctx.restore();
        }
    }
    
    activateShield(duration = 5) {
        this.hasShield = true;
        this.shieldTimer = duration;
        console.log(`Shield activated for ${duration} seconds`);
    }
    
    activateSpeedBoost(duration = 3) {
        this.speedBoostTimer = duration;
        console.log(`Speed boost activated for ${duration} seconds`);
    }
    
    hasSpeedBoost() {
        return this.speedBoostTimer > 0;
    }
    
    activateInvincibility(duration = 4) {
        this.invincibilityTimer = duration;
        console.log(`Invincibility activated for ${duration} seconds`);
    }
    
    activateMagnetic(duration = 6) {
        this.magneticTimer = duration;
        console.log(`Magnetic effect activated for ${duration} seconds`);
    }
    
    isInvincible() {
        return this.invincibilityTimer > 0;
    }
    
    hasMagnetic() {
        return this.magneticTimer > 0;
    }
    
    takeDamage() {
        if (this.isInvincible()) {
            console.log('Invincibility absorbed damage');
            return false; // No damage taken
        }
        if (this.hasShield) {
            this.hasShield = false;
            this.shieldTimer = 0;
            console.log('Shield absorbed damage');
            return false; // No damage taken
        }
        return true; // Damage taken
    }
}

// Obstacle class
class Obstacle extends GameObject {
    constructor(x, y, type = 'cone') {
        const sizes = {
            cone: { width: 25, height: 35 },
            car: { width: 40, height: 70 },
            truck: { width: 50, height: 90 }
        };
        
        const size = sizes[type] || sizes.cone;
        super(x, y, size.width, size.height);
        
        this.type = type;
        this.baseSpeed = 150;
        this.speedY = this.baseSpeed;
        this.animationOffset = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Simple animation for cones
        if (this.type === 'cone') {
            this.animationOffset += deltaTime * 3;
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        switch (this.type) {
            case 'cone':
                this.drawCone(ctx);
                break;
            case 'car':
                this.drawCar(ctx);
                break;
            case 'truck':
                this.drawTruck(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    drawCone(ctx) {
        const wobble = Math.sin(this.animationOffset) * 2;
        
        // Cone body
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(this.x + this.width/2, this.y + wobble);
        ctx.lineTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
        
        // White stripes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 3, this.y + this.height - 20, this.width - 6, 4);
        ctx.fillRect(this.x + 3, this.y + this.height - 10, this.width - 6, 4);
    }
    
    drawCar(ctx) {
        // Car body
        ctx.fillStyle = '#666666';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Car details
        ctx.fillStyle = '#333';
        // Wheels
        ctx.fillRect(this.x - 3, this.y + 10, 6, 15);
        ctx.fillRect(this.x + this.width - 3, this.y + 10, 6, 15);
        ctx.fillRect(this.x - 3, this.y + this.height - 25, 6, 15);
        ctx.fillRect(this.x + this.width - 3, this.y + this.height - 25, 6, 15);
        
        // Windshield
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(this.x + 5, this.y + this.height - 20, this.width - 10, 15);
    }
    
    drawTruck(ctx) {
        // Truck body
        ctx.fillStyle = '#444444';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Truck cab
        ctx.fillStyle = '#666666';
        ctx.fillRect(this.x + 5, this.y + this.height - 30, this.width - 10, 25);
        
        // Wheels
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - 4, this.y + 15, 8, 20);
        ctx.fillRect(this.x + this.width - 4, this.y + 15, 8, 20);
        ctx.fillRect(this.x - 4, this.y + this.height - 25, 8, 20);
        ctx.fillRect(this.x + this.width - 4, this.y + this.height - 25, 8, 20);
    }
    
    setSpeed(speed) {
        this.speedY = speed;
    }
}

// Collectible Star/Coin
class Collectible extends GameObject {
    constructor(x, y, type = 'star') {
        super(x, y, 25, 25);
        this.type = type;
        this.speedY = 100;
        this.rotationAngle = 0;
        this.rotationSpeed = 5;
        this.pulseScale = 1;
        this.pulseSpeed = 3;
        
        this.points = type === 'star' ? 100 : 50;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.rotationAngle += this.rotationSpeed * deltaTime;
        this.pulseScale = 1 + Math.sin(Date.now() * 0.01 * this.pulseSpeed) * 0.2;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.rotate(this.rotationAngle);
        ctx.scale(this.pulseScale, this.pulseScale);
        
        if (this.type === 'star') {
            this.drawStar(ctx);
        } else {
            this.drawCoin(ctx);
        }
        
        ctx.restore();
    }
    
    drawStar(ctx) {
        const spikes = 5;
        const outerRadius = this.width / 2;
        const innerRadius = outerRadius * 0.5;
        
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    drawCoin(ctx) {
        ctx.fillStyle = '#ffaa00';
        ctx.strokeStyle = '#ff8800';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Inner circle
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    setSpeed(speed) {
        this.speedY = speed;
    }
}

// Fuel Pickup
class FuelPickup extends GameObject {
    constructor(x, y) {
        super(x, y, 30, 40);
        this.speedY = 120;
        this.glowIntensity = 0;
        this.glowDirection = 1;
        this.fuelAmount = 25; // Percentage of fuel to restore
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Glow animation
        this.glowIntensity += this.glowDirection * deltaTime * 3;
        if (this.glowIntensity >= 1) {
            this.glowIntensity = 1;
            this.glowDirection = -1;
        } else if (this.glowIntensity <= 0) {
            this.glowIntensity = 0;
            this.glowDirection = 1;
        }
    }
    
    draw(ctx) {
        // Glow effect
        ctx.save();
        ctx.globalAlpha = this.glowIntensity * 0.3;
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(this.x + this.width/2, this.y + this.height/2, this.width/2 + 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        
        // Fuel canister body
        ctx.fillStyle = '#228B22';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, this.height - 10);
        
        // Fuel canister cap
        ctx.fillStyle = '#333';
        ctx.fillRect(this.x + 8, this.y, this.width - 16, 8);
        
        // Fuel symbol
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('F', this.x + this.width/2, this.y + this.height/2 + 5);
    }
    
    setSpeed(speed) {
        this.speedY = speed;
    }
}

// Power-up Item
class PowerUp extends GameObject {
    constructor(x, y, type = 'speed') {
        super(x, y, 35, 35);
        this.type = type; // 'speed', 'shield', 'invincibility', or 'magnetic'
        this.speedY = 110;
        this.rotationAngle = 0;
        this.rotationSpeed = 4;
        this.floatOffset = 0;
        this.floatSpeed = 4;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.rotationAngle += this.rotationSpeed * deltaTime;
        this.floatOffset = Math.sin(Date.now() * 0.01 * this.floatSpeed) * 3;
    }
    
    draw(ctx) {
        const drawY = this.y + this.floatOffset;
        
        ctx.save();
        ctx.translate(this.x + this.width/2, drawY + this.height/2);
        ctx.rotate(this.rotationAngle);
        
        if (this.type === 'speed') {
            this.drawSpeedBoost(ctx);
        } else if (this.type === 'shield') {
            this.drawShield(ctx);
        } else if (this.type === 'invincibility') {
            this.drawInvincibility(ctx);
        } else if (this.type === 'magnetic') {
            this.drawMagnetic(ctx);
        }
        
        ctx.restore();
    }
    
    drawSpeedBoost(ctx) {
        // Lightning bolt for speed boost
        ctx.fillStyle = '#ffff00';
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(-8, -12);
        ctx.lineTo(2, -12);
        ctx.lineTo(-2, -2);
        ctx.lineTo(8, -2);
        ctx.lineTo(-2, 12);
        ctx.lineTo(2, 2);
        ctx.lineTo(-8, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    
    drawShield(ctx) {
        // Shield shape
        ctx.fillStyle = '#00aaff';
        ctx.strokeStyle = '#0088cc';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(0, -15);
        ctx.lineTo(12, -8);
        ctx.lineTo(12, 8);
        ctx.lineTo(0, 15);
        ctx.lineTo(-12, 8);
        ctx.lineTo(-12, -8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Shield emblem
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(0, -8);
        ctx.lineTo(6, -2);
        ctx.lineTo(6, 6);
        ctx.lineTo(0, 10);
        ctx.lineTo(-6, 6);
        ctx.lineTo(-6, -2);
        ctx.closePath();
        ctx.fill();
    }
    
    drawInvincibility(ctx) {
        // Golden star for invincibility
        ctx.fillStyle = '#ffd700';
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 2;
        
        const spikes = 8;
        const outerRadius = 15;
        const innerRadius = 8;
        
        ctx.beginPath();
        for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Inner glow
        ctx.fillStyle = '#ffff99';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawMagnetic(ctx) {
        // Magnet shape for magnetic collection
        ctx.fillStyle = '#c0392b';
        ctx.strokeStyle = '#922b21';
        ctx.lineWidth = 2;
        
        // Magnet body (U-shape)
        ctx.beginPath();
        ctx.moveTo(-10, -12);
        ctx.lineTo(-10, 8);
        ctx.lineTo(-6, 12);
        ctx.lineTo(-2, 12);
        ctx.lineTo(-2, -8);
        ctx.lineTo(2, -8);
        ctx.lineTo(2, 12);
        ctx.lineTo(6, 12);
        ctx.lineTo(10, 8);
        ctx.lineTo(10, -12);
        ctx.lineTo(6, -12);
        ctx.lineTo(6, -8);
        ctx.lineTo(-6, -8);
        ctx.lineTo(-6, -12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Magnetic field lines
        ctx.strokeStyle = '#3498db';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        
        for (let i = 0; i < 3; i++) {
            const radius = 15 + i * 3;
            ctx.beginPath();
            ctx.arc(-6, 0, radius, -Math.PI * 0.6, -Math.PI * 0.4);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(6, 0, radius, -Math.PI * 0.6, -Math.PI * 0.4);
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
    }
    
    setSpeed(speed) {
        this.speedY = speed;
    }
}
