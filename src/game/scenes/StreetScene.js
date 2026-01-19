import Phaser from 'phaser'
import { COLORS } from '../config'

export default class StreetScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StreetScene' })
    // Sprite scale factors to normalize sizes
    // Idle sprites: ~300x490, Walking sprites: ~160x275
    this.idleScale = 0.1
    this.walkScale = 0.18
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Sky gradient background
    const sky = this.add.graphics()
    sky.fillGradientStyle(0x2d1b4e, 0x2d1b4e, 0x1a1a2e, 0x1a1a2e, 1)
    sky.fillRect(0, 0, width * 3, height)

    // Stars in background
    for (let i = 0; i < 100; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width * 3),
        Phaser.Math.Between(0, height * 0.4),
        Phaser.Math.Between(1, 2),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.3, 1)
      )
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: star.alpha * 0.3 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      })
    }

    // Moon
    const moon = this.add.circle(width * 2.2, 100, 40, 0xFFF8F0, 0.9)
    this.add.circle(width * 2.2 - 10, 95, 35, 0x2d1b4e, 0.3)

    // Buildings - far background layer
    this.createBuildingLayer(0, 0.2, 0x1a1a2e, height * 0.6)

    // Buildings - mid layer
    this.createBuildingLayer(100, 0.4, 0x2d2d2d, height * 0.5)

    // Buildings - near layer with windows
    this.createBuildingLayer(200, 0.6, 0x3d3d3d, height * 0.4)

    // Ground/sidewalk
    const ground = this.add.rectangle(width * 1.5, height - 40, width * 3, 80, 0x4a4a4a)
    ground.setScrollFactor(1)

    // Sidewalk edge
    this.add.rectangle(width * 1.5, height - 82, width * 3, 4, 0x8B7355).setScrollFactor(1)

    // Street lamps
    for (let i = 0; i < 8; i++) {
      this.createStreetLamp(200 + i * 400, height - 80)
    }

    // Player starting position
    this.player = this.physics.add.sprite(100, height - 100, 'alaa-idle')
    this.player.setScale(this.idleScale)
    this.player.setCollideWorldBounds(false)

    // Walking animation state
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

    // Camera follows player
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    this.cameras.main.setBounds(0, 0, width * 3, height)

    // Controls
    this.cursors = this.input.keyboard.createCursorKeys()
    this.wasd = this.input.keyboard.addKeys('W,A,S,D')

    // Mobile controls
    this.createMobileControls()

    // Intro text
    this.introText = this.add.text(width / 2, height / 2 - 100,
      "It's your birthday...\nsomething special awaits", {
      fontFamily: '"Press Start 2P"',
      fontSize: '18px',
      fill: '#FFF8F0',
      align: 'center',
      lineSpacing: 15
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setAlpha(0)

    // Controls hint (hide on mobile)
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone
    this.controlsHint = this.add.text(width / 2, height - 30,
      isMobile ? 'Use on-screen controls to move' : 'Use ARROW KEYS or WASD to move', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#A8B5A0'
    })
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setAlpha(0)

    // Fade in
    this.cameras.main.fadeIn(1000)

    // Show intro text with delay
    this.time.delayedCall(500, () => {
      this.tweens.add({
        targets: this.introText,
        alpha: 1,
        duration: 1500,
        onComplete: () => {
          this.time.delayedCall(3000, () => {
            this.tweens.add({
              targets: this.introText,
              alpha: 0,
              duration: 1000
            })
          })
        }
      })
    })

    // Show controls hint
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: this.controlsHint,
        alpha: 1,
        duration: 1000
      })
    })

    // Scene transition trigger
    this.cafeEntrance = width * 2.5
  }

  createBuildingLayer(offsetY, scrollFactor, color, baseHeight) {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    for (let i = 0; i < 15; i++) {
      const buildingWidth = Phaser.Math.Between(80, 150)
      const buildingHeight = Phaser.Math.Between(150, 300)
      const x = i * 200 + Phaser.Math.Between(-30, 30)
      const y = height - 80 - buildingHeight / 2 + offsetY

      const building = this.add.rectangle(x, y, buildingWidth, buildingHeight, color)
      building.setScrollFactor(scrollFactor)

      // Windows for near buildings
      if (scrollFactor > 0.5) {
        const windowRows = Math.floor(buildingHeight / 40)
        const windowCols = Math.floor(buildingWidth / 30)
        for (let row = 0; row < windowRows; row++) {
          for (let col = 0; col < windowCols; col++) {
            const isLit = Math.random() > 0.4
            const windowRect = this.add.rectangle(
              x - buildingWidth / 2 + 20 + col * 30,
              y - buildingHeight / 2 + 25 + row * 40,
              15, 20,
              isLit ? 0xFFE4B5 : 0x1a1a2e,
              isLit ? 0.8 : 0.5
            )
            windowRect.setScrollFactor(scrollFactor)

            if (isLit && Math.random() > 0.7) {
              this.tweens.add({
                targets: windowRect,
                alpha: { from: 0.8, to: 0.4 },
                duration: Phaser.Math.Between(2000, 5000),
                yoyo: true,
                repeat: -1
              })
            }
          }
        }
      }
    }
  }

  createStreetLamp(x, y) {
    // Pole
    this.add.rectangle(x, y - 80, 6, 160, 0x2d2d2d).setScrollFactor(1)

    // Lamp head
    this.add.rectangle(x, y - 165, 30, 15, 0x3d3d3d).setScrollFactor(1)

    // Light glow
    const light = this.add.circle(x, y - 150, 60, 0xFFE4B5, 0.15)
    light.setScrollFactor(1)

    // Light cone
    const lightCone = this.add.graphics()
    lightCone.fillStyle(0xFFE4B5, 0.08)
    lightCone.fillTriangle(x - 5, y - 155, x + 5, y - 155, x - 40, y, x + 40, y)
    lightCone.setScrollFactor(1)
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
      right: false
    }

    // Left button
    const leftBtn = this.add.circle(80, height - 80, 40, 0x3d3d3d, 0.5)
    leftBtn.setScrollFactor(0)
    leftBtn.setDepth(1000)
    leftBtn.setInteractive()

    const leftArrow = this.add.text(80, height - 80, '◄', {
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

    const rightArrow = this.add.text(180, height - 80, '►', {
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
  }

  toggleWalkFrame() {
    if (this.player.isMoving) {
      this.player.walkFrame = this.player.walkFrame === 1 ? 2 : 1
      const textureKey = `alaa-${this.player.direction}${this.player.walkFrame}`
      this.player.setTexture(textureKey)
      this.player.setScale(this.walkScale)
    }
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

    // Check for scene transition
    if (this.player.x >= this.cafeEntrance) {
      this.transitionToEntrance()
    }
  }

  transitionToEntrance() {
    this.player.setVelocityX(0)
    this.cameras.main.fadeOut(1000)
    this.time.delayedCall(1000, () => {
      this.scene.start('EntranceScene')
    })
  }
}
