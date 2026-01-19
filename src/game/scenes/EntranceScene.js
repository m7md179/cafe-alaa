import Phaser from 'phaser'
import { COLORS } from '../config'

export default class EntranceScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EntranceScene' })
    // Sprite scale factors to normalize sizes
    this.idleScale = 0.1
    this.walkScale = 0.18
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Night sky
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e)

    // Stars
    for (let i = 0; i < 50; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height * 0.3),
        Phaser.Math.Between(1, 2),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.3, 0.8)
      )
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: star.alpha * 0.3 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      })
    }

    // Background buildings
    this.add.rectangle(100, height / 2, 200, height, 0x2d2d2d)
    this.add.rectangle(width - 100, height / 2, 200, height, 0x2d2d2d)

    // Ground
    this.add.rectangle(width / 2, height - 40, width, 80, 0x4a4a4a)
    this.add.rectangle(width / 2, height - 82, width, 4, 0x8B7355)

    // Cafe building
    const cafeWidth = 500
    const cafeHeight = 450
    const cafeX = width / 2
    const cafeY = height - 80 - cafeHeight / 2

    // Building main
    this.add.rectangle(cafeX, cafeY, cafeWidth, cafeHeight, 0x8B7355)

    // Awning (green)
    this.add.rectangle(cafeX, cafeY - cafeHeight / 2 + 40, cafeWidth + 40, 60, 0x2d5016)
    // Awning stripes
    for (let i = 0; i < 8; i++) {
      this.add.rectangle(
        cafeX - cafeWidth / 2 + 35 + i * 65,
        cafeY - cafeHeight / 2 + 50,
        8, 40,
        0x1a3010
      )
    }

    // Sign
    this.add.rectangle(cafeX, cafeY - cafeHeight / 2 + 100, 200, 50, 0x3E2723)
    this.add.text(cafeX, cafeY - cafeHeight / 2 + 100, 'CAFE ALAA', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      fill: '#D4AF37'
    }).setOrigin(0.5)

    // Large window
    this.add.rectangle(cafeX, cafeY + 20, cafeWidth - 100, 200, 0x2d1b4e, 0.8)
    // Window frame
    this.add.rectangle(cafeX, cafeY + 20, cafeWidth - 100, 200)
      .setStrokeStyle(4, 0x5a4a3a)

    // Window warm glow
    const windowGlow = this.add.rectangle(cafeX, cafeY + 20, cafeWidth - 120, 180, 0xFFE4B5, 0.3)
    this.tweens.add({
      targets: windowGlow,
      alpha: { from: 0.3, to: 0.15 },
      duration: 2000,
      yoyo: true,
      repeat: -1
    })

    // Door
    this.doorX = cafeX
    this.doorY = cafeY + cafeHeight / 2 - 80
    this.door = this.add.rectangle(this.doorX, this.doorY, 80, 150, 0x3E2723)
    this.add.rectangle(this.doorX, this.doorY, 80, 150).setStrokeStyle(3, 0x5a4a3a)

    // Door window
    this.add.rectangle(this.doorX, this.doorY - 30, 50, 60, 0xFFE4B5, 0.4)

    // Door handle
    this.add.circle(this.doorX + 25, this.doorY, 6, 0xD4AF37)

    // Potted plants
    this.createPlant(cafeX - 180, height - 100)
    this.createPlant(cafeX + 180, height - 100)

    // Street lamps
    this.createStreetLamp(100, height - 80)
    this.createStreetLamp(width - 100, height - 80)

    // Player
    this.player = this.physics.add.sprite(200, height - 100, 'alaa-idle')
    this.player.setScale(this.idleScale)
    this.player.isMoving = false
    this.player.walkFrame = 1
    this.player.direction = 'right'

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

    // Mobile controls
    this.createMobileControls()

    // Prompt text
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone
    this.promptText = this.add.text(width / 2, height - 220, isMobile ? 'Press A to enter' : 'Press SPACE to enter', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      fill: '#D4AF37'
    }).setOrigin(0.5).setAlpha(0)

    // Fade in
    this.cameras.main.fadeIn(1000)

    // Door interaction zone
    this.canEnter = false
  }

  createPlant(x, y) {
    // Pot
    this.add.rectangle(x, y + 20, 40, 40, 0x8B4513)
    this.add.rectangle(x, y + 5, 50, 10, 0x8B4513)

    // Plant
    for (let i = 0; i < 5; i++) {
      const leafX = x + Phaser.Math.Between(-15, 15)
      const leafY = y - 20 - i * 10
      this.add.ellipse(leafX, leafY, 20, 30, 0x228B22, 0.9)
        .setAngle(Phaser.Math.Between(-20, 20))
    }
  }

  createStreetLamp(x, y) {
    this.add.rectangle(x, y - 80, 6, 160, 0x2d2d2d)
    this.add.rectangle(x, y - 165, 30, 15, 0x3d3d3d)
    this.add.circle(x, y - 150, 50, 0xFFE4B5, 0.15)
  }

  createMobileControls() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Only create controls on mobile devices
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone
    if (!isMobile) return

    // Virtual buttons state
    this.mobileControls = {
      left: false,
      right: false,
      action: false
    }

    // Left button
    const leftBtn = this.add.circle(80, height - 80, 40, 0x3d3d3d, 0.5)
    leftBtn.setScrollFactor(0)
    leftBtn.setDepth(1000)
    leftBtn.setInteractive()

    this.add.text(80, height - 80, '◄', {
      fontSize: '32px',
      fill: '#FFF8F0'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001)

    leftBtn.on('pointerdown', () => {
      this.mobileControls.left = true
      leftBtn.setAlpha(0.8)
    })

    leftBtn.on('pointerup', () => {
      this.mobileControls.left = false
      leftBtn.setAlpha(0.5)
    })

    leftBtn.on('pointerout', () => {
      this.mobileControls.left = false
      leftBtn.setAlpha(0.5)
    })

    // Right button
    const rightBtn = this.add.circle(180, height - 80, 40, 0x3d3d3d, 0.5)
    rightBtn.setScrollFactor(0)
    rightBtn.setDepth(1000)
    rightBtn.setInteractive()

    this.add.text(180, height - 80, '►', {
      fontSize: '32px',
      fill: '#FFF8F0'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001)

    rightBtn.on('pointerdown', () => {
      this.mobileControls.right = true
      rightBtn.setAlpha(0.8)
    })

    rightBtn.on('pointerup', () => {
      this.mobileControls.right = false
      rightBtn.setAlpha(0.5)
    })

    rightBtn.on('pointerout', () => {
      this.mobileControls.right = false
      rightBtn.setAlpha(0.5)
    })

    // Action button (for entering)
    const actionBtn = this.add.circle(width - 80, height - 100, 40, 0xD4735E, 0.6)
    actionBtn.setScrollFactor(0).setDepth(1000).setInteractive()
    this.add.text(width - 80, height - 100, 'A', {
      fontFamily: '"Press Start 2P"',
      fontSize: '20px',
      fill: '#FFF8F0'
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1001)

    actionBtn.on('pointerdown', () => { this.mobileControls.action = true; actionBtn.setAlpha(0.9) })
    actionBtn.on('pointerup', () => { this.mobileControls.action = false; actionBtn.setAlpha(0.6) })
    actionBtn.on('pointerout', () => { this.mobileControls.action = false; actionBtn.setAlpha(0.6) })
  }

  toggleWalkFrame() {
    if (this.player.isMoving) {
      this.player.walkFrame = this.player.walkFrame === 1 ? 2 : 1
      const textureKey = `alaa-${this.player.direction}${this.player.walkFrame}`
      this.player.setTexture(textureKey)
      this.player.setScale(this.walkScale)
    }
  }

  checkMobileAction() {
    if (!this.mobileControls) return false

    // Check if action was just pressed (not held)
    if (this.mobileControls.action && !this.lastMobileAction) {
      this.lastMobileAction = true
      return true
    } else if (!this.mobileControls.action) {
      this.lastMobileAction = false
    }
    return false
  }

  update() {
    const speed = 150

    // Check mobile controls
    const mobileLeft = this.mobileControls && this.mobileControls.left
    const mobileRight = this.mobileControls && this.mobileControls.right

    // Movement
    if (this.cursors.left.isDown || this.wasd.A.isDown || mobileLeft) {
      this.player.setVelocityX(-speed)
      this.player.direction = 'left'
      if (!this.player.isMoving) {
        this.player.setTexture('alaa-left1')
        this.player.setScale(this.walkScale)
        this.player.isMoving = true
      }
    } else if (this.cursors.right.isDown || this.wasd.D.isDown || mobileRight) {
      this.player.setVelocityX(speed)
      this.player.direction = 'right'
      if (!this.player.isMoving) {
        this.player.setTexture('alaa-right1')
        this.player.setScale(this.walkScale)
        this.player.isMoving = true
      }
    } else {
      this.player.setVelocityX(0)
      if (this.player.isMoving) {
        this.player.setTexture('alaa-idle')
        this.player.setScale(this.idleScale)
        this.player.isMoving = false
      }
    }

    // Check proximity to door
    const distToDoor = Math.abs(this.player.x - this.doorX)
    if (distToDoor < 80) {
      if (!this.canEnter) {
        this.canEnter = true
        this.tweens.add({
          targets: this.promptText,
          alpha: 1,
          duration: 300
        })
      }
    } else {
      if (this.canEnter) {
        this.canEnter = false
        this.tweens.add({
          targets: this.promptText,
          alpha: 0,
          duration: 300
        })
      }
    }

    // Enter cafe
    if (this.canEnter && (Phaser.Input.Keyboard.JustDown(this.spaceKey) || this.checkMobileAction())) {
      this.enterCafe()
    }
  }

  enterCafe() {
    this.player.setVelocityX(0)

    // Door opening animation
    this.tweens.add({
      targets: this.door,
      scaleX: 0.1,
      duration: 500
    })

    // Player walks in
    this.time.delayedCall(300, () => {
      this.tweens.add({
        targets: this.player,
        x: this.doorX,
        y: this.doorY,
        scale: 0.05,
        alpha: 0,
        duration: 800
      })
    })

    // Transition
    this.cameras.main.fadeOut(1200)
    this.time.delayedCall(1200, () => {
      this.scene.start('CafeInteriorScene')
    })
  }
}
