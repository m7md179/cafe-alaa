import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import StreetScene from './scenes/StreetScene'
import EntranceScene from './scenes/EntranceScene'
import CafeInteriorScene from './scenes/CafeInteriorScene'
import TableScene from './scenes/TableScene'
import CelebrationScene from './scenes/CelebrationScene'
import LetterScene from './scenes/LetterScene'
import ExplorationScene from './scenes/ExplorationScene'
import EndScene from './scenes/EndScene'

export const gameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  pixelArt: true,
  antialias: false,
  roundPixels: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [
    BootScene,
    StreetScene,
    EntranceScene,
    CafeInteriorScene,
    TableScene,
    CelebrationScene,
    LetterScene,
    ExplorationScene,
    EndScene
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  backgroundColor: '#1a1a2e'
}

export const COLORS = {
  warmCream: 0xFFF8F0,
  terracotta: 0xD4735E,
  sageGreen: 0xA8B5A0,
  softBrown: 0x8B7355,
  gold: 0xD4AF37,
  deepPurple: 0x6B5B95,
  coffeeBrown: 0x3E2723
}

export const drinks = [
  {
    id: 'aquarius-americano',
    name: 'The Aquarius Americano',
    description: 'Bold, innovative, intellectual'
  },
  {
    id: 'seoul-matcha',
    name: 'Seoul Matcha Latte',
    description: 'Smooth, balanced, culturally rich'
  },
  {
    id: 'palestinian-mint',
    name: 'Palestinian Mint Tea',
    description: 'Refreshing, meaningful, rooted'
  },
  {
    id: 'weeknd-espresso',
    name: "The Weeknd's Espresso",
    description: 'Smooth, deep, unforgettable'
  },
  {
    id: 'le-reve-cappuccino',
    name: 'Le Reve Cappuccino',
    description: 'Elegant, dreamy, French-inspired'
  },
  {
    id: 'cosmic-cold-brew',
    name: 'Cosmic Cold Brew',
    description: 'Mystical, smooth, enlightening'
  }
]

// Achievements are currently disabled
// export const achievements = [
//   { text: '3.99 GPA', delay: 5000 },
//   { text: "Master's in Psychology", delay: 15000 },
//   { text: 'Plant Mom', delay: 25000 },
//   { text: 'Music Lover', delay: 35000 },
//   { text: 'Aquarius', delay: 45000 }
// ]

export const easterEggs = [
  { id: 'evil-eye', name: 'Evil Eye', message: 'Protection and good vibes' },
  { id: 'piano', name: 'Piano', message: 'Music feeds the soul' },
  { id: 'flag', name: 'Palestinian Flag', message: 'Stand for what matters' },
  { id: 'plant', name: 'Monstera Plant', message: 'Growth takes patience' },
  { id: 'espresso', name: 'Espresso Machine', message: 'Life is better with coffee' },
  { id: 'moon', name: 'Moon', message: 'Aquarius: The Water Bearer' },
  { id: 'books', name: 'Bookshelf', message: 'Every book is a new world' }
]
