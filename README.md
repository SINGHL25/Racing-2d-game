# 2D Car Racing Game

A complete 2D car racing game built with vanilla JavaScript, HTML5 Canvas, and CSS3. Navigate through 5 challenging levels while avoiding obstacles, collecting stars, managing fuel, and using power-ups!

## 🎮 Game Features

### Core Gameplay
- **Smooth Car Controls**: Use arrow keys or WASD to steer your car left and right
- **Progressive Difficulty**: 5 levels with increasing challenge - faster obstacles and tighter gaps
- **Obstacle Avoidance**: Dodge cones, cars, and trucks on the road
- **Scoring System**: Collect stars (100 pts) and coins (50 pts) for points

### Fuel System
- **Fuel Management**: Your fuel decreases over time - don't let it run out!
- **Fuel Pickups**: Collect green fuel canisters to refill your tank
- **Strategic Planning**: Balance risk vs reward when deciding whether to grab fuel

### Power-ups
- **Speed Boost** ⚡: Temporary increased speed and acceleration
- **Shield** 🛡️: Protection from one obstacle collision
- **Visual Effects**: Clear indicators when power-ups are active

### User Interface
- **Real-time Stats**: Score, level, and fuel bar always visible
- **Power-up Indicators**: Shows active power-ups and remaining time
- **Game Screens**: Start screen with instructions, level complete celebration, game over screen
- **Responsive Design**: Works on desktop and mobile devices

## 🕹️ Controls

### Keyboard Controls
- **Arrow Keys** or **WASD**: Steer your car left and right
- **Space**: Start game / Restart / Continue to next level
- **M**: Toggle audio mute

### Game Objective
1. Avoid all obstacles (cones, cars, trucks)
2. Collect stars and coins for maximum score
3. Pick up fuel to keep your car running
4. Use power-ups strategically
5. Complete all 5 levels to win!

## 🚀 Getting Started

### Option 1: Run Locally
1. Clone or download this repository
2. Open `index.html` in a web browser
3. Click "Start Game" and enjoy!

### Option 2: Deploy to GitHub Pages
1. Fork this repository
2. Go to Settings > Pages
3. Select "Deploy from a branch" and choose `main`
4. Your game will be available at `https://yourusername.github.io/2d-car-racing`

### Option 3: Run on Replit
1. Import this repository to Replit
2. Click the "Run" button
3. The game will be served on port 5000

## 🎵 Audio Features

The game includes three audio tracks:
- **Background Music**: Continuous atmospheric music during gameplay
- **Hit Sound**: Collision and impact effects  
- **Success Sound**: Collection and achievement audio

*Note: Audio files should be placed in the `client/public/sounds/` directory*

## 🛠️ Technical Details

### Architecture
- **Modular Design**: Separate files for different game systems
  - `game.js`: Main game loop and coordination
  - `gameObjects.js`: Player, obstacles, collectibles, and power-ups
  - `gameState.js`: Level progression and difficulty scaling
  - `input.js`: Keyboard input handling
  - `audio.js`: Sound and music management
  - `ui.js`: User interface and screen management

### Performance Features
- **Efficient Rendering**: Canvas-based graphics with optimized draw calls
- **Object Pooling**: Smart cleanup of off-screen objects
- **Responsive Frame Rate**: Smooth 60fps gameplay with delta time calculations
- **Memory Management**: Proper cleanup to prevent memory leaks

### Difficulty Progression
Each level increases:
- Obstacle spawn rate (more frequent obstacles)
- Obstacle speed (faster moving objects)
- Collectible spacing (requires more skill to collect)
- Overall game pace

## 🎨 Customization

### Easy Modifications
- **Colors**: Edit `style.css` to change the color scheme
- **Difficulty**: Modify values in `gameState.js` for different challenge levels
- **Controls**: Add new key bindings in `input.js`
- **Sounds**: Replace audio files in `/public/sounds/` directory
- **Game Objects**: Add new obstacle types or power-ups in `gameObjects.js`

### Adding New Features
The modular code structure makes it easy to add:
- New obstacle types with unique behaviors
- Additional power-up types
- More visual effects
- Multiplayer functionality
- Level editor
- High score persistence

## 🌟 Game Tips

1. **Fuel Management**: Always prioritize fuel pickups when your tank is low
2. **Shield Strategy**: Save shield power-ups for dense obstacle sections
3. **Speed Boost Timing**: Use speed boosts to quickly navigate through tight spaces
4. **Score Maximization**: Collect every star and coin while staying safe
5. **Pattern Recognition**: Later levels have predictable obstacle patterns

## 🐛 Troubleshooting

### Common Issues
- **Audio not playing**: Click anywhere on the page to enable audio (browser requirement)
- **Controls not working**: Make sure the game canvas has focus by clicking on it
- **Performance issues**: Try refreshing the page or closing other browser tabs

### Browser Compatibility
- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support (may need user interaction for audio)
- **Mobile**: Touch controls not implemented (keyboard required)

## 📝 License

MIT License - Feel free to use this code for learning, modification, or distribution.

## 🙏 Credits

- Built with vanilla JavaScript for maximum compatibility
- Uses HTML5 Canvas for 2D graphics rendering
- Responsive design with CSS3 animations
- No external dependencies required

---

**Enjoy the game and happy racing! 🏎️💨**
