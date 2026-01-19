import Phaser from 'phaser'
import { COLORS } from '../config'

export default class LetterScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LetterScene' })
  }

  create() {
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Warm background
    this.add.rectangle(width / 2, height / 2, width, height, 0xFFF8F0)

    // Soft vignette
    const vignette = this.add.graphics()
    vignette.fillStyle(0x000000, 0.2)
    vignette.fillCircle(width / 2, height / 2, width)

    // Table surface
    this.add.rectangle(width / 2, height / 2 + 200, width, 300, 0x8B7355)

    // Letter/Envelope
    this.createEnvelope(width / 2, height / 2 - 50)

    // Intro text
    const introText = this.add.text(width / 2, 80, 'The barista left something for you...', {
      fontFamily: '"Press Start 2P"',
      fontSize: '12px',
      fill: '#8B7355'
    }).setOrigin(0.5).setAlpha(0)

    // Prompt
    this.promptText = this.add.text(width / 2, height - 80, 'Press SPACE to read the letter', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#D4AF37'
    }).setOrigin(0.5).setAlpha(0)

    // Controls
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

    // State
    this.letterOpened = false
    this.letterContainer = null

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
            targets: [introText, this.promptText],
            alpha: { introText: 0, promptText: 1 },
            duration: 500
          })
          this.promptText.setAlpha(1)
        })
      }
    })
  }

  createEnvelope(x, y) {
    this.envelope = this.add.container(x, y)

    // Envelope body
    const body = this.add.rectangle(0, 0, 350, 220, 0xFFF8DC)
    body.setStrokeStyle(2, 0xD4AF37)
    this.envelope.add(body)

    // Envelope flap (triangle)
    const flap = this.add.triangle(0, -110, -175, 0, 175, 0, 0, 80, 0xF5DEB3)
    flap.setStrokeStyle(2, 0xD4AF37)
    this.envelope.add(flap)

    // Seal
    const seal = this.add.circle(0, -50, 25, 0xD4735E)
    this.envelope.add(seal)

    // Heart on seal
    const heart = this.add.text(0, -50, '♥', {
      fontSize: '24px',
      fill: '#FFF8F0'
    }).setOrigin(0.5)
    this.envelope.add(heart)

    // "For Alaa" text
    const forText = this.add.text(0, 30, 'For Alaa', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      fill: '#8B7355'
    }).setOrigin(0.5)
    this.envelope.add(forText)

    // Subtle floating animation
    this.tweens.add({
      targets: this.envelope,
      y: y + 10,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    })
  }

  openLetter() {
    this.letterOpened = true
    this.promptText.setAlpha(0)

    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Envelope flies away
    this.tweens.add({
      targets: this.envelope,
      y: -300,
      alpha: 0,
      duration: 800,
      ease: 'Back.easeIn'
    })

    // Create letter
    this.time.delayedCall(500, () => {
      this.showLetter(width, height)
    })
  }

  showLetter(width, height) {
    this.letterContainer = this.add.container(width / 2, height / 2)

    // Letter paper
    const paper = this.add.rectangle(0, 0, 700, 500, 0xFFFFF0)
    paper.setStrokeStyle(3, 0xD4AF37)
    this.letterContainer.add(paper)

    // Decorative corners
    const cornerSize = 30
    const corners = [
      { x: -340, y: -240 },
      { x: 340, y: -240 },
      { x: -340, y: 240 },
      { x: 340, y: 240 }
    ]
    corners.forEach(corner => {
      const c = this.add.rectangle(corner.x, corner.y, cornerSize, cornerSize, 0xD4AF37, 0.3)
      c.setAngle(45)
      this.letterContainer.add(c)
    })

    // Letter content - your personal message
    const letterContent = `Dear Alaa,

Happy Birthday!

On this special day, I wanted to create something
unique just for you. A little digital cafe where
your memories could come alive.

You've accomplished so much - your incredible GPA,
your Master's in Psychology, and most importantly,
the beautiful person you are.

May this year bring you all the happiness,
success, and love you deserve.

Here's to new adventures, warm coffee,
and making more wonderful memories.

With warmth and admiration,
Someone who thinks you're amazing ♥`

    // Typewriter effect
    this.typewriterText = this.add.text(-320, -220, '', {
      fontFamily: 'Georgia, serif',
      fontSize: '14px',
      fill: '#3E2723',
      lineSpacing: 8,
      wordWrap: { width: 640 }
    })
    this.letterContainer.add(this.typewriterText)

    // Start typewriter
    this.letterContainer.setAlpha(0)
    this.letterContainer.setScale(0.8)

    this.tweens.add({
      targets: this.letterContainer,
      alpha: 1,
      scale: 1,
      duration: 500,
      onComplete: () => {
        this.startTypewriter(letterContent)
      }
    })
  }

  startTypewriter(text) {
    let index = 0
    const speed = 30 // ms per character

    this.time.addEvent({
      delay: speed,
      callback: () => {
        if (index < text.length) {
          this.typewriterText.text += text[index]
          index++
        } else {
          // Show continue prompt
          this.showContinuePrompt()
        }
      },
      repeat: text.length - 1
    })
  }

  showContinuePrompt() {
    const width = this.cameras.main.width

    // Mark as read
    this.registry.set('hasReadLetter', true)

    // Continue prompt
    this.continueText = this.add.text(width / 2, this.cameras.main.height - 50,
      'Press SPACE to continue', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#8B7355'
    }).setOrigin(0.5).setAlpha(0)

    this.tweens.add({
      targets: this.continueText,
      alpha: 1,
      duration: 500
    })

    this.canContinue = true
  }

  update() {
    if (!this.letterOpened && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.openLetter()
    } else if (this.canContinue && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.goToExploration()
    }
  }

  goToExploration() {
    this.canContinue = false
    this.cameras.main.fadeOut(1000)
    this.time.delayedCall(1000, () => {
      this.scene.start('ExplorationScene')
    })
  }
}
