/**
 * Input Manager - Handles keyboard input for the game
 */
class InputManager {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        
        this.keyMap = {
            'ArrowLeft': 'left',
            'KeyA': 'left',
            'ArrowRight': 'right',
            'KeyD': 'right',
            'ArrowUp': 'up',
            'KeyW': 'up',
            'ArrowDown': 'down',
            'KeyS': 'down'
        };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.keyMap[e.code]) {
                e.preventDefault();
                this.keys[this.keyMap[e.code]] = true;
                console.log(`Key pressed: ${e.code} -> ${this.keyMap[e.code]}`);
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (this.keyMap[e.code]) {
                e.preventDefault();
                this.keys[this.keyMap[e.code]] = false;
                console.log(`Key released: ${e.code} -> ${this.keyMap[e.code]}`);
            }
        });
        
        // Handle window focus/blur to prevent stuck keys
        window.addEventListener('blur', () => {
            this.resetKeys();
        });
    }
    
    resetKeys() {
        Object.keys(this.keys).forEach(key => {
            this.keys[key] = false;
        });
    }
    
    isPressed(key) {
        return this.keys[key] || false;
    }
    
    // Get horizontal movement direction (-1, 0, 1)
    getHorizontalInput() {
        let direction = 0;
        if (this.isPressed('left')) direction -= 1;
        if (this.isPressed('right')) direction += 1;
        return direction;
    }
    
    // Get vertical movement direction (-1, 0, 1)
    getVerticalInput() {
        let direction = 0;
        if (this.isPressed('up')) direction -= 1;
        if (this.isPressed('down')) direction += 1;
        return direction;
    }
}

// Global input manager instance
const inputManager = new InputManager();
