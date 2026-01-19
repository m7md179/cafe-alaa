import Phaser from 'phaser'

export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e)

    // Stars
    for (let i = 0; i < 100; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 3),
        0xFFFFFF,
        Phaser.Math.FloatBetween(0.2, 0.8)
      )
      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: star.alpha * 0.3 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1
      })
    }

    // Thank you message
    const thankYou = this.add.text(width / 2, height / 2 - 100,
      'Thank You For Playing!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '24px',
      fill: '#D4AF37'
    }).setOrigin(0.5).setAlpha(0)

    // Birthday wish
    const birthday = this.add.text(width / 2, height / 2,
      'Happy Birthday, Alaa!', {
      fontFamily: '"Press Start 2P"',
      fontSize: '20px',
      fill: '#D4735E'
    }).setOrigin(0.5).setAlpha(0)

    // Signature
    const signature = this.add.text(width / 2, height / 2 + 80,
      'Made with love, just for you', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#A8B5A0'
    }).setOrigin(0.5).setAlpha(0)

    // Heart decoration
    const heart = this.add.text(width / 2, height / 2 + 150, '♥', {
      fontSize: '48px',
      fill: '#D4735E'
    }).setOrigin(0.5).setAlpha(0)

    // Fade in elements
    this.cameras.main.fadeIn(1500)

    this.tweens.add({
      targets: thankYou,
      alpha: 1,
      y: thankYou.y + 20,
      duration: 1500,
      delay: 500
    })

    this.tweens.add({
      targets: birthday,
      alpha: 1,
      scale: { from: 0.8, to: 1 },
      duration: 1500,
      delay: 1500
    })

    this.tweens.add({
      targets: signature,
      alpha: 1,
      duration: 1500,
      delay: 2500
    })

    this.tweens.add({
      targets: heart,
      alpha: 1,
      scale: { from: 0.5, to: 1 },
      duration: 1000,
      delay: 3500,
      onComplete: () => {
        // Pulsing heart
        this.tweens.add({
          targets: heart,
          scale: { from: 1, to: 1.2 },
          duration: 500,
          yoyo: true,
          repeat: -1
        })
      }
    })

    // Play again option
    this.time.delayedCall(5000, () => {
      const playAgain = this.add.text(width / 2, height - 50,
        'Press SPACE to play again', {
        fontFamily: '"Press Start 2P"',
        fontSize: '10px',
        fill: '#8B7355'
      }).setOrigin(0.5).setAlpha(0)

      this.tweens.add({
        targets: playAgain,
        alpha: 1,
        duration: 500
      })

      // Enable restart
      this.canRestart = true
    })

    // Controls
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  update() {
    if (this.canRestart && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      // Reset game state
      this.registry.set('selectedDrink', null)
      this.registry.set('easterEggsFound', [])
      this.registry.set('hasReadLetter', false)

      this.cameras.main.fadeOut(1000)
      this.time.delayedCall(1000, () => {
        this.scene.start('StreetScene')
      })
    }
  }
}
