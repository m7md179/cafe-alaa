import Phaser from 'phaser'
import { gameConfig } from './game/config'
import './index.css'

// Check for mobile/small screen
const isMobile = window.innerWidth < 900 || window.innerHeight < 500

if (isMobile) {
  // Show mobile warning
  const warning = document.createElement('div')
  warning.className = 'mobile-warning'
  warning.innerHTML = `
    <h2>Best Experience on Desktop</h2>
    <p>This game is optimized for desktop browsers with a keyboard.</p>
    <button id="continue-btn">Continue Anyway</button>
  `
  document.getElementById('root').appendChild(warning)

  document.getElementById('continue-btn').addEventListener('click', () => {
    warning.remove()
    startGame()
  })
} else {
  startGame()
}

function startGame() {
  // Create game container
  const container = document.createElement('div')
  container.className = 'game-container'
  container.id = 'game-container'
  document.getElementById('root').appendChild(container)

  // Initialize Phaser game
  const config = {
    ...gameConfig,
    parent: 'game-container'
  }

  new Phaser.Game(config)
}
