/**
 * Particle System - Visual effects for explosions and power-ups
 */

// Individual Particle class
class Particle {
    constructor(x, y, type = 'explosion', subType = 'speed') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        
        // Initialize based on particle type
        switch (type) {
            case 'explosion':
                this.initExplosion();
                break;
            case 'powerup':
                this.initPowerUp(subType);
                break;
            case 'collect':
                this.initCollect();
                break;
            case 'spark':
                this.initSpark();
                break;
        }
    }
    
    initExplosion() {
        this.color = `hsl(${Math.random() * 60}, 100%, ${50 + Math.random() * 30}%)`; // Orange/red hues
        this.size = 2 + Math.random() * 4;
        this.maxSize = this.size;
        this.velocityX = (Math.random() - 0.5) * 200;
        this.velocityY = (Math.random() - 0.5) * 200;
        this.gravity = 50;
        this.friction = 0.95;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.fadeRate = 2.0 + Math.random() * 1.0;
    }
    
    initPowerUp(powerType = 'speed') {
        // Different colors for different power-up types
        if (powerType === 'fuel') {
            this.color = `hsl(${120 + Math.random() * 60}, 80%, ${50 + Math.random() * 30}%)`; // Green hues
        } else if (powerType === 'shield') {
            this.color = `hsl(${180 + Math.random() * 60}, 80%, ${50 + Math.random() * 30}%)`; // Cyan hues
        } else if (powerType === 'invincibility') {
            this.color = `hsl(${45 + Math.random() * 15}, 100%, ${60 + Math.random() * 20}%)`; // Gold hues
        } else if (powerType === 'magnetic') {
            this.color = `hsl(${Math.random() * 20}, 80%, ${50 + Math.random() * 30}%)`; // Red hues
        } else { // speed
            this.color = `hsl(${Math.random() * 60 + 300}, 80%, ${60 + Math.random() * 20}%)`; // Purple/pink hues
        }
        
        this.size = 3 + Math.random() * 3;
        this.maxSize = this.size;
        this.velocityX = (Math.random() - 0.5) * 100;
        this.velocityY = -50 - Math.random() * 50;
        this.gravity = -20; // Float upward
        this.friction = 0.98;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.fadeRate = 1.5;
        this.sparkle = Math.random() * Math.PI * 2;
        this.powerType = powerType;
    }
    
    initCollect() {
        this.color = '#ffd700';
        this.size = 2 + Math.random() * 2;
        this.maxSize = this.size;
        this.velocityX = (Math.random() - 0.5) * 80;
        this.velocityY = -80 - Math.random() * 40;
        this.gravity = 100;
        this.friction = 0.96;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.fadeRate = 2.5;
    }
    
    initSpark() {
        this.color = '#ffffff';
        this.size = 1 + Math.random() * 2;
        this.maxSize = this.size;
        this.velocityX = (Math.random() - 0.5) * 150;
        this.velocityY = (Math.random() - 0.5) * 150;
        this.gravity = 0;
        this.friction = 0.92;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.fadeRate = 3.0;
    }
    
    update(deltaTime) {
        if (!this.active) return;
        
        // Update physics
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Apply gravity and friction
        this.velocityY += this.gravity * deltaTime;
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;
        
        // Update life and size
        this.life -= this.fadeRate * deltaTime;
        this.size = this.maxSize * (this.life / this.maxLife);
        
        // Update special effects
        if (this.type === 'powerup') {
            this.sparkle += deltaTime * 10;
        }
        
        // Deactivate when life is over
        if (this.life <= 0) {
            this.active = false;
        }
    }
    
    draw(ctx) {
        if (!this.active || this.size <= 0) return;
        
        ctx.save();
        
        // Set alpha based on life
        ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
        
        // Draw based on type
        switch (this.type) {
            case 'explosion':
                this.drawExplosion(ctx);
                break;
            case 'powerup':
                this.drawPowerUp(ctx);
                break;
            case 'collect':
                this.drawCollect(ctx);
                break;
            case 'spark':
                this.drawSpark(ctx);
                break;
        }
        
        ctx.restore();
    }
    
    drawExplosion(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add inner glow
        ctx.globalAlpha *= 0.5;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawPowerUp(ctx) {
        // Main particle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkle effect
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            const angle = this.sparkle + (i * Math.PI / 2);
            const length = this.size * 1.5;
            const x1 = this.x + Math.cos(angle) * length * 0.5;
            const y1 = this.y + Math.sin(angle) * length * 0.5;
            const x2 = this.x + Math.cos(angle) * length;
            const y2 = this.y + Math.sin(angle) * length;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        }
        ctx.stroke();
    }
    
    drawCollect(ctx) {
        // Golden star-like effect
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#ffaa00';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Add sparkle
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size, this.y);
        ctx.lineTo(this.x + this.size, this.y);
        ctx.moveTo(this.x, this.y - this.size);
        ctx.lineTo(this.x, this.y + this.size);
        ctx.stroke();
    }
    
    drawSpark(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Particle System Manager
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 500; // Limit for performance
        this.debugMode = false; // Set to true for particle creation logs
    }
    
    createExplosion(x, y, intensity = 1) {
        const particleCount = Math.floor(10 + intensity * 15);
        
        for (let i = 0; i < particleCount; i++) {
            if (this.particles.length >= this.maxParticles) break;
            
            const offsetX = (Math.random() - 0.5) * 20;
            const offsetY = (Math.random() - 0.5) * 20;
            this.particles.push(new Particle(x + offsetX, y + offsetY, 'explosion'));
        }
        
        if (this.debugMode) {
            console.log(`Created explosion with ${particleCount} particles at (${Math.round(x)}, ${Math.round(y)})`);
        }
    }
    
    createPowerUpEffect(x, y, type = 'speed') {
        const particleCount = 15;
        
        for (let i = 0; i < particleCount; i++) {
            if (this.particles.length >= this.maxParticles) break;
            
            const offsetX = (Math.random() - 0.5) * 30;
            const offsetY = (Math.random() - 0.5) * 30;
            this.particles.push(new Particle(x + offsetX, y + offsetY, 'powerup', type));
        }
        
        // Add some sparks for extra flair
        for (let i = 0; i < 8; i++) {
            if (this.particles.length >= this.maxParticles) break;
            
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;
            this.particles.push(new Particle(x + offsetX, y + offsetY, 'spark'));
        }
        
        if (this.debugMode) {
            console.log(`Created ${type} power-up effect with ${particleCount + 8} particles`);
        }
    }
    
    createCollectEffect(x, y) {
        const particleCount = 8;
        
        for (let i = 0; i < particleCount; i++) {
            if (this.particles.length >= this.maxParticles) break;
            
            const offsetX = (Math.random() - 0.5) * 15;
            const offsetY = (Math.random() - 0.5) * 15;
            this.particles.push(new Particle(x + offsetX, y + offsetY, 'collect'));
        }
    }
    
    createSparkTrail(x, y, count = 3) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;
            
            const offsetX = (Math.random() - 0.5) * 10;
            const offsetY = (Math.random() - 0.5) * 10;
            this.particles.push(new Particle(x + offsetX, y + offsetY, 'spark'));
        }
    }
    
    update(deltaTime) {
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update(deltaTime);
            
            // Remove inactive particles
            if (!particle.active) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw(ctx) {
        // Draw all particles
        this.particles.forEach(particle => particle.draw(ctx));
    }
    
    clear() {
        this.particles = [];
    }
    
    getActiveParticleCount() {
        return this.particles.length;
    }
}

// Global particle system instance
const particleSystem = new ParticleSystem();