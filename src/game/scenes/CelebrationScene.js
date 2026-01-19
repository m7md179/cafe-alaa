import Phaser from 'phaser'
import { COLORS } from '../config'

export default class CelebrationScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CelebrationScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Darker background for birthday moment
    this.bg = this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e)

    // Ambient warm spots
    for (let i = 0; i < 5; i++) {
      const spot = this.add.circle(
        Phaser.Math.Between(100, width - 100),
        Phaser.Math.Between(100, height - 100),
        80,
        0xFFE4B5,
        0.05
      )
    }

    // Table with cake
    this.createCakeTable(width / 2, height - 100)

    // Birthday cake
    this.cake = this.createBirthdayCake(width / 2, height - 200)

    // Candle and flame
    this.candle = this.add.rectangle(width / 2, height - 300, 8, 40, 0xFFF8F0)
    this.flame = this.createFlame(width / 2, height - 325)
    this.candleLit = true

    // Staff members (silhouettes)
    this.createStaff(width, height)

    // Birthday text
    this.birthdayText = this.add.text(width / 2, 100, 'Happy Birthday Alaa!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '24px',
      fill: '#D4AF37',
      stroke: '#3E2723',
      strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0)

    // Prompt
    this.promptText = this.add.text(width / 2, height - 50, 'Press SPACE to blow out the candle', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#A8B5A0'
    }).setOrigin(0.5).setAlpha(0)

    // Controls
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // Background music
    this.birthdayMusic = this.sound.add('birthday-music', {
      volume: 0.4,
      loop: true
    })
    this.birthdayMusic.play()

    // Confetti sound effect
    this.confettiSound = this.sound.add('confetti-pop', { volume: 0.5 })

    // Fade in
    this.cameras.main.fadeIn(1500)

    // Start celebration sequence
    this.time.delayedCall(1000, () => {
      this.startCelebration()
    })
  }

  createCakeTable(x, y) {
    // Table
    this.add.ellipse(x, y + 30, 300, 60, 0x8B7355)
    this.add.ellipse(x, y + 30, 280, 50, 0x7a6348)

    // Tablecloth edges
    this.add.rectangle(x, y + 60, 280, 20, 0xD4735E, 0.5)
  }

  createBirthdayCake(x, y) {
    const cake = this.add.container(x, y)

    // Cake plate
    cake.add(this.add.ellipse(0, 70, 180, 30, 0xFFF8F0))

    // Bottom layer
    cake.add(this.add.ellipse(0, 50, 150, 25, 0xFFB6C1))
    cake.add(this.add.rectangle(0, 25, 150, 50, 0xFFB6C1))
    cake.add(this.add.ellipse(0, 0, 150, 25, 0xFFB6C1))

    // Frosting decoration on bottom layer
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      cake.add(this.add.circle(
        Math.cos(angle) * 65,
        25 + Math.sin(angle) * 10,
        8,
        0xFFF8F0
      ))
    }

    // Middle layer
    cake.add(this.add.ellipse(0, -10, 110, 20, 0xDDA0DD))
    cake.add(this.add.rectangle(0, -35, 110, 50, 0xDDA0DD))
    cake.add(this.add.ellipse(0, -60, 110, 20, 0xDDA0DD))

    // Top layer
    cake.add(this.add.ellipse(0, -70, 70, 15, 0xFFB6C1))
    cake.add(this.add.rectangle(0, -90, 70, 40, 0xFFB6C1))
    cake.add(this.add.ellipse(0, -110, 70, 15, 0xFFF8F0))

    // Decorative elements
    // Roses
    const roseColors = [0xD4735E, 0xFFB6C1, 0xFFF8F0]
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2
      cake.add(this.add.circle(
        Math.cos(angle) * 45,
        -60 + Math.sin(angle) * 8,
        10,
        roseColors[i % 3]
      ))
    }

    return cake
  }

  createFlame(x, y) {
    const flame = this.add.container(x, y)

    // Outer glow
    const glow = this.add.circle(0, 0, 30, 0xFFAA00, 0.3)
    flame.add(glow)

    // Flame body
    const flameBody = this.add.ellipse(0, 0, 12, 25, 0xFFAA00)
    flame.add(flameBody)

    // Inner flame
    const innerFlame = this.add.ellipse(0, 3, 6, 15, 0xFFFF00)
    flame.add(innerFlame)

    // Animate flame
    this.tweens.add({
      targets: [flameBody, innerFlame],
      scaleX: { from: 1, to: 0.8 },
      scaleY: { from: 1, to: 1.1 },
      duration: 100,
      yoyo: true,
      repeat: -1
    })

    this.tweens.add({
      targets: glow,
      alpha: { from: 0.3, to: 0.5 },
      scale: { from: 1, to: 1.2 },
      duration: 200,
      yoyo: true,
      repeat: -1
    })

    return flame
  }

  createStaff(width, height) {
    // Silhouettes of cafe staff
    const positions = [
      { x: 150, scale: 0.8 },
      { x: 300, scale: 0.9 },
      { x: width - 300, scale: 0.9 },
      { x: width - 150, scale: 0.8 }
    ]

    positions.forEach(pos => {
      // Body
      this.add.ellipse(pos.x, height - 250, 60 * pos.scale, 100 * pos.scale, 0x2d2d2d)
      // Head
      this.add.circle(pos.x, height - 330, 25 * pos.scale, 0x2d2d2d)
    })
  }

  startCelebration() {
    // Show birthday text with animation
    this.tweens.add({
      targets: this.birthdayText,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      duration: 1000
    })

    // Rainbow colors cycling on text
    this.time.addEvent({
      delay: 500,
      callback: () => {
        const colors = ['#D4735E', '#D4AF37', '#A8B5A0', '#6B5B95', '#FFB6C1']
        const color = colors[Math.floor(Math.random() * colors.length)]
        this.birthdayText.setColor(color)
      },
      repeat: -1
    })

    // Show prompt after a moment
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: this.promptText,
        alpha: 1,
        duration: 500
      })
    })
  }

  update() {
    if (this.candleLit && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.blowOutCandle()
    }
  }

  blowOutCandle() {
    this.candleLit = false

    // Hide prompt
    this.promptText.setAlpha(0)

    // Blow out animation
    this.tweens.add({
      targets: this.flame,
      alpha: 0,
      scale: 0,
      duration: 300,
      onComplete: () => {
        this.flame.destroy()

        // Small puff of smoke
        for (let i = 0; i < 5; i++) {
          const smoke = this.add.circle(
            this.candle.x + Phaser.Math.Between(-10, 10),
            this.candle.y - 30,
            5,
            0x888888,
            0.5
          )
          this.tweens.add({
            targets: smoke,
            y: smoke.y - 50,
            alpha: 0,
            duration: 1000,
            onComplete: () => smoke.destroy()
          })
        }

        // Lights come up
        this.time.delayedCall(500, () => {
          this.tweens.add({
            targets: this.bg,
            fillColor: 0xFFF8F0,
            duration: 1000
          })

          // Start confetti
          this.createConfetti()

          // Applause text
          this.showApplause()
        })
      }
    })
  }

  createConfetti() {
    const width = this.cameras.main.width
    const colors = [0xD4735E, 0xA8B5A0, 0xD4AF37, 0x6B5B95, 0xFFB6C1, 0xFFAA00]

    // Play confetti sound
    this.confettiSound.play()

    // Create confetti burst
    for (let i = 0; i < 100; i++) {
      const confetti = this.add.rectangle(
        Phaser.Math.Between(0, width),
        -20,
        Phaser.Math.Between(5, 12),
        Phaser.Math.Between(5, 12),
        colors[Math.floor(Math.random() * colors.length)]
      )
      confetti.setAngle(Phaser.Math.Between(0, 360))

      this.tweens.add({
        targets: confetti,
        y: this.cameras.main.height + 50,
        x: confetti.x + Phaser.Math.Between(-100, 100),
        angle: confetti.angle + Phaser.Math.Between(-360, 360),
        duration: Phaser.Math.Between(2000, 4000),
        delay: Phaser.Math.Between(0, 1000),
        onComplete: () => confetti.destroy()
      })
    }

    // Camera shake for excitement
    this.cameras.main.shake(500, 0.005)
  }

  showApplause() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Applause text
    const applauseText = this.add.text(width / 2, height / 2, '* APPLAUSE *', {
      fontFamily: '"Press Start 2P"',
      fontSize: '18px',
      fill: '#D4735E'
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({
      targets: applauseText,
      alpha: 1,
      duration: 500,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: applauseText,
            alpha: 0,
            duration: 500
          })
        })
      }
    })

    // Continue text
    this.time.delayedCall(3500, () => {
      const continueText = this.add.text(width / 2, height - 50, 'Press SPACE to continue', {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        fill: '#8B7355'
      }).setOrigin(0.5).setAlpha(0)

      this.tweens.add({
        targets: continueText,
        alpha: 1,
        duration: 500
      })

      // Enable continue
      this.canContinue = true
    })
  }

  update() {
    if (this.candleLit && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.blowOutCandle()
    } else if (this.canContinue && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.goToLetter()
    }
  }

  goToLetter() {
    this.canContinue = false

    // Fade out music
    this.tweens.add({
      targets: this.birthdayMusic,
      volume: 0,
      duration: 1000
    })

    this.cameras.main.fadeOut(1000)
    this.time.delayedCall(1000, () => {
      this.birthdayMusic.stop()
      this.scene.start('LetterScene')
    })
  }

  shutdown() {
    // Clean up audio when scene is destroyed
    if (this.birthdayMusic) {
      this.birthdayMusic.stop()
      this.birthdayMusic.destroy()
    }
  }
}
