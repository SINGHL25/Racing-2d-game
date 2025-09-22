/**
 * Audio Manager - Handles all game sounds and music
 */
class AudioManager {
    constructor() {
        this.sounds = {
            background: document.getElementById('backgroundMusic'),
            hit: document.getElementById('hitSound'),
            success: document.getElementById('successSound')
        };
        
        this.isMuted = false;
        this.musicVolume = 0.3;
        this.effectVolume = 0.5;
        
        this.initializeAudio();
    }
    
    initializeAudio() {
        // Set initial volumes
        this.sounds.background.volume = this.musicVolume;
        this.sounds.hit.volume = this.effectVolume;
        this.sounds.success.volume = this.effectVolume;
        
        // Handle audio loading errors gracefully
        Object.values(this.sounds).forEach(audio => {
            audio.addEventListener('error', (e) => {
                console.warn('Audio file could not be loaded:', e.target.src);
            });
        });
    }
    
    playBackgroundMusic() {
        if (this.isMuted) return;
        
        this.sounds.background.currentTime = 0;
        this.sounds.background.play().catch(e => {
            console.warn('Background music play failed:', e);
        });
    }
    
    stopBackgroundMusic() {
        this.sounds.background.pause();
        this.sounds.background.currentTime = 0;
    }
    
    playHitSound() {
        if (this.isMuted) return;
        
        // Clone the audio for overlapping sounds
        const hitClone = this.sounds.hit.cloneNode();
        hitClone.volume = this.effectVolume;
        hitClone.play().catch(e => {
            console.warn('Hit sound play failed:', e);
        });
    }
    
    playSuccessSound() {
        if (this.isMuted) return;
        
        this.sounds.success.currentTime = 0;
        this.sounds.success.play().catch(e => {
            console.warn('Success sound play failed:', e);
        });
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.sounds.background.pause();
        } else {
            this.playBackgroundMusic();
        }
        
        console.log(`Audio ${this.isMuted ? 'muted' : 'unmuted'}`);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        this.sounds.background.volume = this.musicVolume;
    }
    
    setEffectVolume(volume) {
        this.effectVolume = Math.max(0, Math.min(1, volume));
        this.sounds.hit.volume = this.effectVolume;
        this.sounds.success.volume = this.effectVolume;
    }
}

// Global audio manager instance
const audioManager = new AudioManager();
