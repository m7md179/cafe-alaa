import Phaser from 'phaser'

export default class TableScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TableScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Warm background
    this.add.rectangle(width / 2, height / 2, width, height, 0xFFF8F0)

    // Dreamy overlay
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0xFFE4B5, 0.2)

    // Table view (first person perspective)
    this.createTableView(width, height)

    // Coffee cup
    const drink = this.registry.get('selectedDrink')
    this.createCoffeeCup(width / 2, height - 150, drink)

    // Intro text
    const introText = this.add.text(width / 2, 80, 'Your coffee is being prepared...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      fill: '#3E2723'
    }).setOrigin(0.5).setAlpha(0)

    // Continue cafe music from previous scene
    this.bgMusic = this.sound.add('cafe-music', {
      volume: 0.25,
      loop: true
    })
    this.bgMusic.play()

    // Fade in
    this.cameras.main.fadeIn(1000)

    // Show intro
    this.tweens.add({
      targets: introText,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          this.tweens.add({
            targets: introText,
            alpha: 0,
            duration: 500,
            onComplete: () => {
              this.startMemoryLane()
            }
          })
        })
      }
    })

    // Photos array
    this.photos = []
    this.photoIndex = 0
    this.photoCount = this.registry.get('photoCount') || 48

    // Sparkle particles
    this.createSparkles(width, height)
  }

  createTableView(width, height) {
    // Table edge
    this.add.rectangle(width / 2, height - 50, width, 200, 0x8B7355)
    this.add.rectangle(width / 2, height - 150, width - 100, 10, 0x7a6348)

    // Table cloth/napkin
    this.add.rectangle(width / 2 - 200, height - 100, 80, 80, 0xFFF8F0)
      .setAngle(5)

    // Decorative elements
    // Small plant
    this.add.ellipse(width - 200, height - 200, 40, 50, 0x228B22)
    this.add.rectangle(width - 200, height - 160, 25, 30, 0x8B4513)

    // Window view in background
    this.add.rectangle(width / 2, 200, 600, 300, 0x87CEEB, 0.3)
    this.add.rectangle(width / 2, 200, 600, 300).setStrokeStyle(8, 0x5a4a3a)

    // Stars through window
    for (let i = 0; i < 20; i++) {
      const star = this.add.circle(
        width / 2 - 280 + Math.random() * 560,
        80 + Math.random() * 200,
        Phaser.Math.Between(1, 2),
        0xFFFFFF,
        0.7
      )
      this.tweens.add({
        targets: star,
        alpha: { from: 0.7, to: 0.2 },
        duration: Phaser.Math.Between(1000, 2000),
        yoyo: true,
        repeat: -1
      })
    }
  }

  createCoffeeCup(x, y, drink) {
    // Saucer
    this.add.ellipse(x, y + 20, 100, 30, 0xFFF8F0)
    this.add.ellipse(x, y + 20, 100, 30).setStrokeStyle(2, 0xD4AF37)

    // Cup
    this.add.ellipse(x, y, 70, 25, 0xFFF8F0)
    this.add.rectangle(x, y - 20, 60, 40, 0xFFF8F0)

    // Coffee inside
    this.add.ellipse(x, y - 10, 55, 18, 0x3E2723)

    // Handle
    this.add.arc(x + 40, y - 15, 15, 0, Math.PI, false, 0xFFF8F0)
      .setStrokeStyle(6, 0xFFF8F0)

    // Steam
    for (let i = 0; i < 3; i++) {
      const steam = this.add.text(x - 20 + i * 20, y - 60 + i * 5, '~', {
        fontSize: '20px',
        fill: '#CCCCCC'
      }).setAlpha(0.5)

      this.tweens.add({
        targets: steam,
        y: steam.y - 30,
        alpha: 0,
        duration: 2000,
        repeat: -1,
        delay: i * 300
      })
    }

    // Drink name label
    if (drink) {
      this.add.text(x, y + 60, drink.name, {
        fontFamily: '"Press Start 2P"',
        fontSize: '8px',
        fill: '#8B7355'
      }).setOrigin(0.5)
    }
  }

  createSparkles(width, height) {
    // Create sparkle particles that float around
    for (let i = 0; i < 30; i++) {
      const sparkle = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(2, 4),
        0xD4AF37,
        0
      )

      this.tweens.add({
        targets: sparkle,
        alpha: { from: 0, to: 0.8 },
        y: sparkle.y - 100,
        duration: Phaser.Math.Between(3000, 5000),
        repeat: -1,
        delay: Phaser.Math.Between(0, 5000),
        yoyo: true
      })
    }
  }

  startMemoryLane() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Memory lane title
    const memoryTitle = this.add.text(width / 2, 50, 'Memory Lane', {
      fontFamily: '"Press Start 2P"',
      fontSize: '20px',
      fill: '#D4735E'
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({
      targets: memoryTitle,
      alpha: 1,
      duration: 1000
    })

    // Start spawning photos (faster: 600ms instead of 1200ms)
    this.time.addEvent({
      delay: 600,
      callback: this.spawnPhoto,
      callbackScope: this,
      repeat: this.photoCount - 1
    })

    // Transition to celebration after photos (adjusted timing)
    this.time.delayedCall(this.photoCount * 600 + 2000, () => {
      this.transitionToCelebration()
    })
  }

  spawnPhoto() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    if (this.photoIndex >= this.photoCount) return

    // Random position
    const x = Phaser.Math.Between(150, width - 150)
    const y = Phaser.Math.Between(150, height - 250)

    // Create polaroid frame
    const frameWidth = 140
    const frameHeight = 160
    const frame = this.add.rectangle(x, y, frameWidth, frameHeight, 0xFFF8F0)
    frame.setAlpha(0)
    frame.setAngle(Phaser.Math.Between(-15, 15))
    frame.setDepth(this.photoIndex)

    // Add shadow
    const shadow = this.add.rectangle(x + 5, y + 5, frameWidth, frameHeight, 0x000000, 0.2)
    shadow.setAngle(frame.angle)
    shadow.setDepth(this.photoIndex - 0.5)
    shadow.setAlpha(0)

    // Photo inside
    const photo = this.add.image(x, y - 10, `photo-${this.photoIndex}`)
    photo.setDisplaySize(120, 120)
    photo.setAlpha(0)
    photo.setAngle(frame.angle)
    photo.setDepth(this.photoIndex + 0.5)

    this.photos.push({ frame, shadow, photo })

    // Fade in
    this.tweens.add({
      targets: [frame, photo, shadow],
      alpha: 1,
      duration: 800
    })

    // Float animation
    this.tweens.add({
      targets: [frame, photo, shadow],
      y: y + 15,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })

    // Fade out after some time (faster: 4000ms instead of 8000ms)
    this.time.delayedCall(4000, () => {
      this.tweens.add({
        targets: [frame, photo, shadow],
        alpha: 0,
        duration: 600,
        onComplete: () => {
          frame.destroy()
          photo.destroy()
          shadow.destroy()
        }
      })
    })

    this.photoIndex++
  }

  showAchievement(text) {
    const width = this.cameras.main.width

    const achievementText = this.add.text(width / 2, 120, text, {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      fill: '#D4AF37',
      stroke: '#3E2723',
      strokeThickness: 2
    }).setOrigin(0.5).setAlpha(0).setDepth(1000)

    // Sparkle effect around achievement
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const sparkle = this.add.circle(
        width / 2 + Math.cos(angle) * 100,
        120 + Math.sin(angle) * 30,
        3,
        0xD4AF37,
        0
      )
      sparkle.setDepth(999)

      this.tweens.add({
        targets: sparkle,
        alpha: { from: 0, to: 1 },
        scale: { from: 0, to: 1.5 },
        duration: 500,
        yoyo: true,
        onComplete: () => sparkle.destroy()
      })
    }

    this.tweens.add({
      targets: achievementText,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      duration: 500,
      onComplete: () => {
        this.time.delayedCall(3000, () => {
          this.tweens.add({
            targets: achievementText,
            alpha: 0,
            y: achievementText.y - 30,
            duration: 500,
            onComplete: () => achievementText.destroy()
          })
        })
      }
    })
  }

  transitionToCelebration() {
    // Final message
    const finalText = this.add.text(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      'So many beautiful memories...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '16px',
      fill: '#3E2723',
      align: 'center'
    }).setOrigin(0.5).setAlpha(0).setDepth(2000)

    this.tweens.add({
      targets: finalText,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        this.time.delayedCall(2000, () => {
          // Fade out music
          this.tweens.add({
            targets: this.bgMusic,
            volume: 0,
            duration: 1500
          })

          this.cameras.main.fadeOut(1500)
          this.time.delayedCall(1500, () => {
            this.bgMusic.stop()
            this.scene.start('CelebrationScene')
          })
        })
      }
    })
  }

  shutdown() {
    // Clean up audio when scene is destroyed
    if (this.bgMusic) {
      this.bgMusic.stop()
      this.bgMusic.destroy()
    }
  }
}
