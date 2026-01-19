import Phaser from 'phaser'
import { drinks } from '../config'

export default class CafeInteriorScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CafeInteriorScene' })
    // Sprite scale factors for smaller box
    this.idleScale = 0.1
    this.walkScale = 0.18
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Black background for everything outside the cafe box
    this.cameras.main.setBackgroundColor('#000000')

    // Define cafe interior box (20% smaller: 640x384)
    this.cafeBox = {
      x: 320,
      y: 168,
      width: 640,
      height: 384
    }

    // Create the cafe interior container
    this.createCafeInterior()

    // Player starting position
    const playerStartX = this.cafeBox.x + 60
    const playerStartY = this.cafeBox.y + this.cafeBox.height - 50

    this.player = this.physics.add.sprite(playerStartX, playerStartY, 'alaa-idle-right')
    this.player.setScale(this.idleScale)
    this.player.setSize(20, 20)
    this.player.setOffset(5, 25)
    this.player.isMoving = false
    this.player.walkFrame = 1
    this.player.direction = 'right'
    this.player.setDepth(10)

    // Add collision with obstacles (disabled to allow free movement)
    // this.physics.add.collider(this.player, this.obstacles)

    // Animation timer for walking
    this.walkTimer = this.time.addEvent({
      delay: 200,
      callback: this.toggleWalkFrame,
      callbackScope: this,
      loop: true
    })

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys('W,A,S,D')
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // Prompt text
    this.promptText = this.add.text(width / 2, this.cafeBox.y + 80, 'Press SPACE to order', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#D4AF37'
    }).setOrigin(0.5).setAlpha(0).setDepth(100)

    // Menu UI (hidden initially)
    this.menuContainer = this.add.container(width / 2, height / 2).setAlpha(0).setDepth(200)
    this.createMenuUI()

    // State
    this.canOrder = false
    this.isOrdering = false
    this.hasOrdered = false

    // Counter position for interactions (now at the back center)
    this.counterX = this.cafeBox.x + this.cafeBox.width / 2
    this.counterY = this.cafeBox.y + 90

    // Fade in
    this.cameras.main.fadeIn(1000)

    // Audio setup
    this.setupAudio()

    // Welcome text
    this.showWelcome()
  }

  setupAudio() {
    // Background music (looped, lower volume)
    this.bgMusic = this.sound.add('cafe-music', {
      volume: 0.3,
      loop: true
    })
    this.bgMusic.play()

    // Ambient cafe chatter (looped, very low volume)
    this.cafeChatter = this.sound.add('cafe-chatter', {
      volume: 0.15,
      loop: true
    })
    this.cafeChatter.play()

    // Sound effects (one-time plays)
    this.menuClickSound = this.sound.add('menu-click', { volume: 0.4 })
    this.coffeeBrewingSound = this.sound.add('coffee-brewing', { volume: 0.25 })
  }

  createCafeInterior() {
    const box = this.cafeBox

    // Floor tiles covering the ENTIRE interior box (depth -1)
    const floorTile = this.add.tileSprite(
      box.x + box.width / 2,
      box.y + box.height / 2,
      box.width,
      box.height,
      'cafe-floor'
    )
    floorTile.setDepth(-1)

    // Collision group for furniture
    this.obstacles = this.physics.add.staticGroup()

    // === BACK AREA: Counter and barista at the top ===
    // Back counter with espresso machine (centered at back)
    const backCounter = this.add.image(box.x + box.width / 2 + 80, box.y + 90, 'cafe-back-counter')
    backCounter.setScale(0.45)
    backCounter.setDepth(2)

    // Counter with register (at back)
    const counterRegister = this.add.image(box.x + box.width / 2 - 80, box.y + 90, 'cafe-counter-register')
    counterRegister.setScale(0.45)
    counterRegister.setDepth(2)

    // Barista behind counter at the back
    this.barista = this.add.sprite(box.x + box.width / 2, box.y + 70, 'barista')
    this.barista.setScale(0.32)
    this.barista.setDepth(1)

    // === CENTER: Seating area ===
    // Bottom row of tables (3 tables)
    const table1 = this.add.image(box.x + 100, box.y + box.height - 80, 'cafe-table-chairs')
    table1.setScale(0.42)
    table1.setDepth(3)

    const table2 = this.add.image(box.x + 260, box.y + box.height - 80, 'cafe-table-chairs')
    table2.setScale(0.42)
    table2.setDepth(3)

    const table3 = this.add.image(box.x + 420, box.y + box.height - 80, 'cafe-table-chairs')
    table3.setScale(0.42)
    table3.setDepth(3)

    // Middle row of tables (3 tables)
    const table4 = this.add.image(box.x + 100, box.y + box.height - 200, 'cafe-table-chairs')
    table4.setScale(0.40)
    table4.setDepth(3)

    const table5 = this.add.image(box.x + 260, box.y + box.height - 200, 'cafe-table-chairs')
    table5.setScale(0.40)
    table5.setDepth(3)

    const table6 = this.add.image(box.x + 420, box.y + box.height - 200, 'cafe-table-chairs')
    table6.setScale(0.40)
    table6.setDepth(3)

    // === PLANTS ===
    // Corner plants at bottom
    const plant1 = this.add.image(box.x + 30, box.y + box.height - 50, 'cafe-plant')
    plant1.setScale(0.38)
    plant1.setDepth(4)

    const plant2 = this.add.image(box.x + box.width - 30, box.y + box.height - 50, 'cafe-plant2')
    plant2.setScale(0.35)
    plant2.setDepth(4)

    // Plants near counter at back
    const plant3 = this.add.image(box.x + 40, box.y + 100, 'cafe-plant')
    plant3.setScale(0.32)
    plant3.setDepth(2)

    const plant4 = this.add.image(box.x + box.width - 40, box.y + 100, 'cafe-plant2')
    plant4.setScale(0.32)
    plant4.setDepth(2)

    // Brown border around the cafe box
    const border = this.add.graphics()
    border.lineStyle(6, 0x3E2723, 1)
    border.strokeRect(box.x, box.y, box.width, box.height)
    border.setDepth(50)

    // Store table position for interaction (first table)
    this.tableZonePos = { x: box.x + 100, y: box.y + box.height - 80 }
  }

  showWelcome() {
    const welcomeText = this.add.text(
      this.cafeBox.x + this.cafeBox.width / 2,
      this.cafeBox.y + 25,
      'Welcome to Cafe Alaa!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      fill: '#3E2723'
    }).setOrigin(0.5).setAlpha(0).setDepth(60)

    this.tweens.add({
      targets: welcomeText,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: welcomeText,
            alpha: 0,
            duration: 1000
          })
        })
      }
    })
  }

  createMenuUI() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background overlay
    const overlay = this.add.rectangle(0, 0, width, height, 0x000000, 0.7)
    this.menuContainer.add(overlay)

    // Menu board
    const board = this.add.rectangle(0, 0, 550, 450, 0x3E2723)
    this.menuContainer.add(board)

    const boardBorder = this.add.rectangle(0, 0, 550, 450)
      .setStrokeStyle(4, 0xD4AF37)
    this.menuContainer.add(boardBorder)

    // Title
    const title = this.add.text(0, -180, 'Choose Your Drink', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      fill: '#D4AF37'
    }).setOrigin(0.5)
    this.menuContainer.add(title)

    // Drink options
    this.drinkButtons = []
    drinks.forEach((drink, index) => {
      const row = Math.floor(index / 2)
      const col = index % 2
      const x = col === 0 ? -130 : 130
      const y = -90 + row * 90

      // Button background
      const btn = this.add.rectangle(x, y, 230, 70, 0x5a4a3a)
        .setInteractive({ useHandCursor: true })
      this.menuContainer.add(btn)

      // Button border
      const btnBorder = this.add.rectangle(x, y, 230, 70)
        .setStrokeStyle(2, 0x8B7355)
      this.menuContainer.add(btnBorder)

      // Drink name
      const nameText = this.add.text(x, y - 12, drink.name, {
        fontFamily: '"Press Start 2P"',
        fontSize: '7px',
        fill: '#FFF8F0',
        align: 'center',
        wordWrap: { width: 210 }
      }).setOrigin(0.5)
      this.menuContainer.add(nameText)

      // Drink description
      const descText = this.add.text(x, y + 18, drink.description, {
        fontFamily: '"Press Start 2P"',
        fontSize: '5px',
        fill: '#A8B5A0',
        align: 'center'
      }).setOrigin(0.5)
      this.menuContainer.add(descText)

      // Hover effects
      btn.on('pointerover', () => {
        btn.setFillStyle(0x7a6348)
        btnBorder.setStrokeStyle(2, 0xD4AF37)
      })

      btn.on('pointerout', () => {
        btn.setFillStyle(0x5a4a3a)
        btnBorder.setStrokeStyle(2, 0x8B7355)
      })

      btn.on('pointerdown', () => {
        this.menuClickSound.play()
        this.selectDrink(drink)
      })

      this.drinkButtons.push(btn)
    })
  }

  selectDrink(drink) {
    this.registry.set('selectedDrink', drink)
    this.hasOrdered = true

    // Play coffee brewing sound
    this.coffeeBrewingSound.play()

    // Hide menu
    this.tweens.add({
      targets: this.menuContainer,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.isOrdering = false
      }
    })

    // Barista response
    const responseText = this.add.text(
      this.counterX,
      this.counterY - 20,
      'Excellent choice!\nHave a seat.', {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      fill: '#3E2723',
      align: 'center',
      lineSpacing: 6
    }).setOrigin(0.5).setDepth(60)

    this.time.delayedCall(2500, () => {
      this.tweens.add({
        targets: responseText,
        alpha: 0,
        duration: 500
      })
    })

    // Update prompt to find seat
    this.time.delayedCall(3000, () => {
      this.promptText.setText('Walk to a table')
      this.promptText.setPosition(this.tableZonePos.x, this.tableZonePos.y - 60)
      this.tweens.add({
        targets: this.promptText,
        alpha: 1,
        duration: 500
      })
    })

    // Enable table interaction
    this.time.delayedCall(3000, () => {
      this.tableZone = this.tableZonePos
    })
  }

  toggleWalkFrame() {
    if (this.player.isMoving) {
      // Only animate left/right walking, use idle sprites for up/down
      if (this.player.direction === 'left' || this.player.direction === 'right') {
        this.player.walkFrame = this.player.walkFrame === 1 ? 2 : 1
        const textureKey = `alaa-${this.player.direction}${this.player.walkFrame}`
        this.player.setTexture(textureKey)
        this.player.setScale(this.walkScale)
      } else {
        // For up/down movement, use idle sprites with slight scale variation for animation
        const scale = this.player.walkFrame === 1 ? this.idleScale : this.idleScale * 0.98
        this.player.walkFrame = this.player.walkFrame === 1 ? 2 : 1
        this.player.setScale(scale)
      }
    }
  }

  getIdleTexture(direction) {
    switch(direction) {
      case 'left': return 'alaa-idle-left'
      case 'right': return 'alaa-idle-right'
      case 'up': return 'alaa-idle-back'
      case 'down': return 'alaa-idle'
      default: return 'alaa-idle-right'
    }
  }

  setIdleState() {
    this.player.isMoving = false
    this.player.setTexture(this.getIdleTexture(this.player.direction))
    this.player.setScale(this.idleScale)
  }

  update() {
    if (this.isOrdering) return

    const speed = 130
    let isMovingNow = false
    const box = this.cafeBox

    // Horizontal movement
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.setVelocityX(-speed)
      this.player.direction = 'left'
      isMovingNow = true
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.setVelocityX(speed)
      this.player.direction = 'right'
      isMovingNow = true
    } else {
      this.player.setVelocityX(0)
    }

    // Vertical movement
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.setVelocityY(-speed)
      if (!isMovingNow) this.player.direction = 'up'
      isMovingNow = true
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.setVelocityY(speed)
      if (!isMovingNow) this.player.direction = 'down'
      isMovingNow = true
    } else {
      this.player.setVelocityY(0)
    }

    // Update movement state and texture
    if (isMovingNow && !this.player.isMoving) {
      this.player.isMoving = true
      if (this.player.direction === 'left' || this.player.direction === 'right') {
        this.player.setTexture(`alaa-${this.player.direction}1`)
        this.player.setScale(this.walkScale)
      } else if (this.player.direction === 'up') {
        this.player.setTexture('alaa-idle-back')
        this.player.setScale(this.idleScale)
      } else if (this.player.direction === 'down') {
        this.player.setTexture('alaa-idle')
        this.player.setScale(this.idleScale)
      }
    } else if (!isMovingNow && this.player.isMoving) {
      this.setIdleState()
    }

    // Keep player in bounds (within the cafe box)
    const margin = 20
    this.player.x = Phaser.Math.Clamp(this.player.x, box.x + margin, box.x + box.width - margin)
    this.player.y = Phaser.Math.Clamp(this.player.y, box.y + 100, box.y + box.height - 25)

    // Counter proximity
    if (!this.hasOrdered) {
      const distToCounter = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        this.counterX, this.counterY + 60
      )

      if (distToCounter < 120) {
        if (!this.canOrder) {
          this.canOrder = true
          this.promptText.setPosition(this.counterX, this.counterY + 40)
          this.tweens.add({
            targets: this.promptText,
            alpha: 1,
            duration: 300
          })
        }
      } else {
        if (this.canOrder) {
          this.canOrder = false
          this.tweens.add({
            targets: this.promptText,
            alpha: 0,
            duration: 300
          })
        }
      }

      // Open menu
      if (this.canOrder && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.openMenu()
      }
    }

    // Table proximity (after ordering)
    if (this.hasOrdered && this.tableZone) {
      const distToTable = Phaser.Math.Distance.Between(
        this.player.x, this.player.y,
        this.tableZone.x, this.tableZone.y
      )

      if (distToTable < 70) {
        this.promptText.setText('Press SPACE to sit')
        this.promptText.setPosition(this.tableZone.x, this.tableZone.y - 60)
        this.promptText.setAlpha(1)

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
          this.sitAtTable()
        }
      }
    }
  }

  openMenu() {
    this.isOrdering = true
    this.tweens.add({
      targets: this.menuContainer,
      alpha: 1,
      duration: 300
    })
  }

  sitAtTable() {
    this.player.setVelocity(0, 0)

    // Fade out music
    this.tweens.add({
      targets: [this.bgMusic, this.cafeChatter],
      volume: 0,
      duration: 1000
    })

    // Fade out and transition
    this.cameras.main.fadeOut(1000)
    this.time.delayedCall(1000, () => {
      this.bgMusic.stop()
      this.cafeChatter.stop()
      this.scene.start('TableScene')
    })
  }

  shutdown() {
    // Clean up audio when scene is destroyed
    if (this.bgMusic) {
      this.bgMusic.stop()
      this.bgMusic.destroy()
    }
    if (this.cafeChatter) {
      this.cafeChatter.stop()
      this.cafeChatter.destroy()
    }
  }
}
