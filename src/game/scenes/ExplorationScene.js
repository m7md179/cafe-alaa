import Phaser from 'phaser'
import { COLORS, easterEggs } from '../config'

export default class ExplorationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ExplorationScene' })
    // Sprite scale factors for smaller box
    this.idleScale = 0.1
    this.walkScale = 0.18
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Initialize found eggs
    this.foundEggs = this.registry.get('easterEggsFound') || []

    // Black background
    this.cameras.main.setBackgroundColor('#000000')

    // Cafe interior box (20% smaller: 640x384)
    this.cafeBox = {
      x: 320,
      y: 168,
      width: 640,
      height: 384
    }

    // Create the cafe interior
    this.createCafeInterior()

    // Create interactive objects (easter eggs)
    this.interactiveObjects = []
    this.createInteractiveObjects()

    // Player
    const playerStartX = this.cafeBox.x + this.cafeBox.width / 2
    const playerStartY = this.cafeBox.y + this.cafeBox.height - 50

    this.player = this.physics.add.sprite(playerStartX, playerStartY, 'alaa-idle-right')
    this.player.setScale(this.idleScale)
    this.player.setSize(20, 20)
    this.player.setOffset(5, 25)
    this.player.isMoving = false
    this.player.walkFrame = 1
    this.player.direction = 'right'
    this.player.setDepth(10)

    // Add collision with obstacles
    this.physics.add.collider(this.player, this.obstacles)

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

    // UI
    this.createUI()

    // Prompt
    this.promptText = this.add.text(width / 2, height / 2, '', {
      fontFamily: '"Press Start 2P"',
      fontSize: '9px',
      fill: '#D4AF37'
    }).setOrigin(0.5).setAlpha(0).setDepth(100)

    // Message display
    this.messageContainer = this.add.container(width / 2, height / 2).setAlpha(0).setDepth(200)

    // Fade in
    this.cameras.main.fadeIn(1000)

    // Welcome message
    this.showWelcome()
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

    // Wall tiles stuck to VERY TOP border
    for (let i = 0; i < 5; i++) {
      const wall = this.add.image(box.x + 64 + i * 128, box.y + 35, 'cafe-wall')
      wall.setScale(0.35)
      wall.setDepth(1)
    }

    // === RIGHT SIDE: Counter area ===
    // Back counter with espresso machine (upper right)
    const backCounter = this.add.image(box.x + box.width - 70, box.y + 95, 'cafe-back-counter')
    backCounter.setScale(0.45)
    backCounter.setDepth(2)
    this.obstacles.create(box.x + box.width - 70, box.y + 95).setSize(90, 50).setVisible(false)

    // Counter with register (lower right)
    const counterRegister = this.add.image(box.x + box.width - 80, box.y + box.height - 80, 'cafe-counter-register')
    counterRegister.setScale(0.45)
    counterRegister.setDepth(5)
    this.obstacles.create(box.x + box.width - 80, box.y + box.height - 80).setSize(100, 60).setVisible(false)

    // Pastry stand next to register
    const pastryStand = this.add.image(box.x + box.width - 160, box.y + box.height - 90, 'cafe-pastry-stand')
    pastryStand.setScale(0.32)
    pastryStand.setDepth(6)
    this.obstacles.create(box.x + box.width - 160, box.y + box.height - 90).setSize(40, 40).setVisible(false)

    // === LEFT SIDE: Seating area ===
    // Bottom row of tables (3 tables)
    const table1 = this.add.image(box.x + 90, box.y + box.height - 70, 'cafe-table-chairs')
    table1.setScale(0.4)
    table1.setDepth(3)
    this.obstacles.create(box.x + 90, box.y + box.height - 70).setSize(80, 50).setVisible(false)

    const table2 = this.add.image(box.x + 220, box.y + box.height - 70, 'cafe-table-chairs')
    table2.setScale(0.4)
    table2.setDepth(3)
    this.obstacles.create(box.x + 220, box.y + box.height - 70).setSize(80, 50).setVisible(false)

    const table3 = this.add.image(box.x + 350, box.y + box.height - 70, 'cafe-table-chairs')
    table3.setScale(0.4)
    table3.setDepth(3)
    this.obstacles.create(box.x + 350, box.y + box.height - 70).setSize(80, 50).setVisible(false)

    // Upper row of tables (2 tables)
    const table4 = this.add.image(box.x + 90, box.y + box.height - 170, 'cafe-table-chairs')
    table4.setScale(0.38)
    table4.setDepth(3)
    this.obstacles.create(box.x + 90, box.y + box.height - 170).setSize(75, 45).setVisible(false)

    const table5 = this.add.image(box.x + 220, box.y + box.height - 170, 'cafe-table-chairs')
    table5.setScale(0.38)
    table5.setDepth(3)
    this.obstacles.create(box.x + 220, box.y + box.height - 170).setSize(75, 45).setVisible(false)

    // === PLANTS ===
    // Corner plants
    const plant1 = this.add.image(box.x + 25, box.y + box.height - 45, 'cafe-plant')
    plant1.setScale(0.35)
    plant1.setDepth(4)
    this.obstacles.create(box.x + 25, box.y + box.height - 45).setSize(30, 30).setVisible(false)

    const plant2 = this.add.image(box.x + box.width - 15, box.y + box.height - 45, 'cafe-plant2')
    plant2.setScale(0.32)
    plant2.setDepth(4)
    this.obstacles.create(box.x + box.width - 15, box.y + box.height - 45).setSize(25, 25).setVisible(false)

    // Plants along back wall
    const plant3 = this.add.image(box.x + 40, box.y + 85, 'cafe-plant')
    plant3.setScale(0.3)
    plant3.setDepth(2)

    const plant4 = this.add.image(box.x + 150, box.y + 82, 'cafe-plant2')
    plant4.setScale(0.28)
    plant4.setDepth(2)

    const plant5 = this.add.image(box.x + 280, box.y + 85, 'cafe-plant')
    plant5.setScale(0.28)
    plant5.setDepth(2)

    const plant6 = this.add.image(box.x + 400, box.y + 82, 'cafe-plant2')
    plant6.setScale(0.28)
    plant6.setDepth(2)

    // Exit door (left side)
    this.exitDoor = { x: box.x + 20, y: box.y + box.height - 65 }
    this.add.rectangle(this.exitDoor.x, this.exitDoor.y, 35, 60, 0x3E2723).setDepth(4)
    this.add.rectangle(this.exitDoor.x, this.exitDoor.y, 35, 60).setStrokeStyle(2, 0x5a4a3a).setDepth(4)
    this.add.rectangle(this.exitDoor.x, this.exitDoor.y - 8, 24, 28, 0xFFE4B5, 0.3).setDepth(4)
    this.add.text(this.exitDoor.x, this.exitDoor.y - 42, 'EXIT', {
      fontFamily: '"Press Start 2P"',
      fontSize: '5px',
      fill: '#D4735E'
    }).setOrigin(0.5).setDepth(5)

    // Brown border
    const border = this.add.graphics()
    border.lineStyle(4, 0x3E2723, 1)
    border.strokeRect(box.x, box.y, box.width, box.height)
    border.setDepth(50)
  }

  createInteractiveObjects() {
    const box = this.cafeBox

    // Evil Eye (wall decoration - on wall)
    this.createInteractive('evil-eye', box.x + 100, box.y + 55, () => {
      this.add.ellipse(box.x + 100, box.y + 55, 24, 16, 0x4169E1).setDepth(3)
      this.add.circle(box.x + 100, box.y + 55, 5, 0x000000).setDepth(3)
      this.add.circle(box.x + 100, box.y + 55, 2, 0xFFFFFF).setDepth(3)
    })

    // Piano (left side near tables)
    this.createInteractive('piano', box.x + 350, box.y + 140, () => {
      this.add.rectangle(box.x + 350, box.y + 140, 50, 35, 0x1a1a1a).setDepth(3)
      for (let i = 0; i < 4; i++) {
        this.add.rectangle(box.x + 332 + i * 10, box.y + 148, 6, 14, 0xFFFFF0).setDepth(3)
      }
      for (let i = 0; i < 3; i++) {
        this.add.rectangle(box.x + 337 + i * 10, box.y + 144, 4, 9, 0x1a1a1a).setDepth(3)
      }
    })

    // Palestinian Flag (on wall)
    this.createInteractive('flag', box.x + 230, box.y + 50, () => {
      const fx = box.x + 230
      const fy = box.y + 50
      const flagWidth = 36
      const flagHeight = 22
      this.add.rectangle(fx, fy - flagHeight / 6, flagWidth, flagHeight / 3, 0x000000).setDepth(3)
      this.add.rectangle(fx, fy, flagWidth, flagHeight / 3, 0xFFFFFF).setDepth(3)
      this.add.rectangle(fx, fy + flagHeight / 6, flagWidth, flagHeight / 3, 0x007A3D).setDepth(3)
      this.add.triangle(fx - flagWidth / 2, fy, 0, -flagHeight / 2, 0, flagHeight / 2, flagWidth / 3, 0, 0xCE1126).setDepth(3)
      this.add.rectangle(fx - flagWidth / 2 - 2, fy, 3, flagHeight + 8, 0x8B4513).setDepth(3)
    })

    // Monstera Plant (corner plant - interactive)
    this.createInteractive('plant', box.x + 40, box.y + 85, () => {
      // Uses the existing plant3 visual, this is just the interaction zone
    })

    // Espresso Machine (on back counter)
    this.createInteractive('espresso', box.x + box.width - 70, box.y + 90, () => {
      const steam = this.add.text(box.x + box.width - 70, box.y + 65, '~  ~', {
        fontSize: '7px',
        fill: '#CCCCCC'
      }).setOrigin(0.5).setDepth(4)
      this.tweens.add({
        targets: steam,
        y: steam.y - 8,
        alpha: 0,
        duration: 2000,
        repeat: -1
      })
    })

    // Moon through window (on wall)
    this.createInteractive('moon', box.x + 500, box.y + 60, () => {
      this.add.rectangle(box.x + 500, box.y + 60, 45, 55, 0x1a1a2e).setDepth(3)
      this.add.rectangle(box.x + 500, box.y + 60, 45, 55).setStrokeStyle(2, 0x5a4a3a).setDepth(3)
      this.add.circle(box.x + 500, box.y + 50, 10, 0xFFF8F0, 0.9).setDepth(3)
      this.add.circle(box.x + 497, box.y + 48, 8, 0x1a1a2e, 0.3).setDepth(3)
      for (let i = 0; i < 4; i++) {
        this.add.circle(
          box.x + 485 + Math.random() * 30,
          box.y + 45 + Math.random() * 25,
          1, 0xFFFFFF, 0.7
        ).setDepth(3)
      }
    })

    // Bookshelf (on wall)
    this.createInteractive('books', box.x + 350, box.y + 55, () => {
      this.add.rectangle(box.x + 350, box.y + 55, 55, 40, 0x5a4a3a).setDepth(3)
      this.add.rectangle(box.x + 350, box.y + 42, 48, 2, 0x3E2723).setDepth(3)
      this.add.rectangle(box.x + 350, box.y + 60, 48, 2, 0x3E2723).setDepth(3)
      const bookColors = [0xD4735E, 0x4169E1, 0x228B22, 0xD4AF37, 0x6B5B95]
      for (let row = 0; row < 2; row++) {
        for (let i = 0; i < 4; i++) {
          const bookHeight = Phaser.Math.Between(10, 14)
          this.add.rectangle(
            box.x + 330 + i * 9,
            box.y + 48 + row * 18 - bookHeight / 2 + 4,
            5, bookHeight,
            bookColors[i % bookColors.length]
          ).setDepth(3)
        }
      }
    })
  }

  createInteractive(id, x, y, drawFunc) {
    drawFunc()

    const zone = this.add.zone(x, y, 55, 55).setInteractive()

    this.interactiveObjects.push({
      id,
      zone,
      x,
      y,
      found: this.foundEggs.includes(id)
    })
  }

  createUI() {
    const box = this.cafeBox

    // Easter egg counter
    this.eggCountText = this.add.text(box.x + box.width - 10, box.y + 8,
      `Easter Eggs: ${this.foundEggs.length}/7`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      fill: '#D4AF37'
    }).setOrigin(1, 0).setDepth(60)

    // Instructions
    this.add.text(box.x + 8, box.y + 8, 'Explore the cafe!\nFind hidden easter eggs.', {
      fontFamily: '"Press Start 2P"',
      fontSize: '6px',
      fill: '#8B7355',
      lineSpacing: 4
    }).setDepth(60)
  }

  showWelcome() {
    const box = this.cafeBox

    const welcomeText = this.add.text(
      box.x + box.width / 2,
      box.y + 25,
      'Feel free to explore!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '11px',
      fill: '#3E2723'
    }).setOrigin(0.5).setAlpha(0).setDepth(60)

    this.tweens.add({
      targets: welcomeText,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.time.delayedCall(2500, () => {
          this.tweens.add({
            targets: welcomeText,
            alpha: 0,
            duration: 500
          })
        })
      }
    })
  }

  toggleWalkFrame() {
    if (this.player.isMoving) {
      this.player.walkFrame = this.player.walkFrame === 1 ? 2 : 1
      const textureKey = `alaa-${this.player.direction}${this.player.walkFrame}`
      this.player.setTexture(textureKey)
      this.player.setScale(this.walkScale)
    }
  }

  getIdleTexture(direction) {
    switch(direction) {
      case 'left': return 'alaa-idle-left'
      case 'right': return 'alaa-idle-right'
      case 'up': return 'alaa-idle-back'
      default: return 'alaa-idle-right'
    }
  }

  update() {
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
      }
    } else if (!isMovingNow && this.player.isMoving) {
      this.player.isMoving = false
      this.player.setTexture(this.getIdleTexture(this.player.direction))
      this.player.setScale(this.idleScale)
    }

    // Keep player in bounds
    const margin = 20
    this.player.x = Phaser.Math.Clamp(this.player.x, box.x + margin, box.x + box.width - margin)
    this.player.y = Phaser.Math.Clamp(this.player.y, box.y + 100, box.y + box.height - 25)

    // Check proximity to interactive objects
    this.checkInteractions()

    // Check exit door
    this.checkExit()
  }

  checkInteractions() {
    let nearObject = null

    this.interactiveObjects.forEach(obj => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, obj.x, obj.y)
      if (dist < 70 && !obj.found) {
        nearObject = obj
      }
    })

    if (nearObject) {
      this.promptText.setText('Press SPACE to interact')
      this.promptText.setPosition(nearObject.x, nearObject.y - 50)
      this.tweens.add({
        targets: this.promptText,
        alpha: 1,
        duration: 200
      })

      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.discoverEasterEgg(nearObject)
      }
    } else {
      if (this.promptText.alpha > 0) {
        this.tweens.add({
          targets: this.promptText,
          alpha: 0,
          duration: 200
        })
      }
    }
  }

  discoverEasterEgg(obj) {
    obj.found = true
    this.foundEggs.push(obj.id)
    this.registry.set('easterEggsFound', this.foundEggs)

    this.eggCountText.setText(`Easter Eggs: ${this.foundEggs.length}/7`)

    const eggInfo = easterEggs.find(e => e.id === obj.id)
    this.showEasterEggMessage(eggInfo)
    this.createSparkles(obj.x, obj.y)

    if (this.foundEggs.length === 7) {
      this.time.delayedCall(3000, () => {
        this.showAllFoundCelebration()
      })
    }
  }

  showEasterEggMessage(eggInfo) {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    this.messageContainer.removeAll(true)

    const bg = this.add.rectangle(0, 0, 400, 110, 0x3E2723, 0.95)
    bg.setStrokeStyle(3, 0xD4AF37)
    this.messageContainer.add(bg)

    const title = this.add.text(0, -30, `Found: ${eggInfo.name}!`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#D4AF37'
    }).setOrigin(0.5)
    this.messageContainer.add(title)

    const message = this.add.text(0, 10, eggInfo.message, {
      fontFamily: '"Press Start 2P"',
      fontSize: '8px',
      fill: '#FFF8F0'
    }).setOrigin(0.5)
    this.messageContainer.add(message)

    const counter = this.add.text(0, 38, `${this.foundEggs.length}/7 found`, {
      fontFamily: '"Press Start 2P"',
      fontSize: '7px',
      fill: '#A8B5A0'
    }).setOrigin(0.5)
    this.messageContainer.add(counter)

    this.messageContainer.setAlpha(0)
    this.messageContainer.setScale(0.8)
    this.tweens.add({
      targets: this.messageContainer,
      alpha: 1,
      scale: 1,
      duration: 300,
      onComplete: () => {
        this.time.delayedCall(2500, () => {
          this.tweens.add({
            targets: this.messageContainer,
            alpha: 0,
            duration: 300
          })
        })
      }
    })
  }

  createSparkles(x, y) {
    const colors = [0xD4AF37, 0xFFFFFF, 0xD4735E]

    for (let i = 0; i < 12; i++) {
      const sparkle = this.add.circle(
        x + Phaser.Math.Between(-30, 30),
        y + Phaser.Math.Between(-30, 30),
        Phaser.Math.Between(2, 4),
        colors[Math.floor(Math.random() * colors.length)],
        1
      )
      sparkle.setDepth(150)

      this.tweens.add({
        targets: sparkle,
        alpha: 0,
        scale: 0,
        y: sparkle.y - 30,
        duration: 1000,
        delay: i * 50,
        onComplete: () => sparkle.destroy()
      })
    }
  }

  showAllFoundCelebration() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7)
    overlay.setDepth(300)

    const celebText = this.add.text(width / 2, height / 2 - 40,
      'You found all Easter Eggs!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '16px',
      fill: '#D4AF37'
    }).setOrigin(0.5).setDepth(301)

    const subText = this.add.text(width / 2, height / 2 + 10,
      'You truly know this cafe well!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#FFF8F0'
    }).setOrigin(0.5).setDepth(301)

    this.createConfetti()

    this.time.delayedCall(3000, () => {
      const continueText = this.add.text(width / 2, height / 2 + 70,
        'Press SPACE to continue', {
        fontFamily: '"Press Start 2P"',
        fontSize: '9px',
        fill: '#A8B5A0'
      }).setOrigin(0.5).setDepth(301)

      this.allFoundComplete = true
    })
  }

  createConfetti() {
    const width = this.cameras.main.width
    const colors = [0xD4735E, 0xA8B5A0, 0xD4AF37, 0x6B5B95, 0xFFB6C1]

    for (let i = 0; i < 50; i++) {
      const confetti = this.add.rectangle(
        Phaser.Math.Between(0, width),
        -20,
        Phaser.Math.Between(4, 7),
        Phaser.Math.Between(4, 7),
        colors[Math.floor(Math.random() * colors.length)]
      )
      confetti.setDepth(302)
      confetti.setAngle(Phaser.Math.Between(0, 360))

      this.tweens.add({
        targets: confetti,
        y: this.cameras.main.height + 50,
        x: confetti.x + Phaser.Math.Between(-50, 50),
        angle: confetti.angle + Phaser.Math.Between(-360, 360),
        duration: Phaser.Math.Between(2000, 3500),
        delay: Phaser.Math.Between(0, 800)
      })
    }
  }

  checkExit() {
    const dist = Phaser.Math.Distance.Between(
      this.player.x, this.player.y,
      this.exitDoor.x, this.exitDoor.y
    )

    if (dist < 50) {
      this.promptText.setText('Press SPACE to exit')
      this.promptText.setPosition(this.exitDoor.x + 35, this.exitDoor.y - 50)
      this.tweens.add({
        targets: this.promptText,
        alpha: 1,
        duration: 200
      })

      if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
        this.exitCafe()
      }
    }
  }

  exitCafe() {
    this.cameras.main.fadeOut(1000)
    this.time.delayedCall(1000, () => {
      this.scene.start('EndScene')
    })
  }
}
