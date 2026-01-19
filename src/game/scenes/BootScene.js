import Phaser from 'phaser'

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width
    const height = this.cameras.main.height

    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 100, 'Cafe Alaa', {
      fontFamily: '"Press Start 2P"',
      fontSize: '32px',
      fill: '#D4735E'
    }).setOrigin(0.5)

    // Progress bar background
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x2d2d2d, 1)
    progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30)

    // Progress bar border
    const progressBorder = this.add.graphics()
    progressBorder.lineStyle(3, 0xD4AF37, 1)
    progressBorder.strokeRect(width / 2 - 160, height / 2 - 15, 320, 30)

    // Progress bar fill
    const progressBar = this.add.graphics()

    // Loading percentage text
    const percentText = this.add.text(width / 2, height / 2 + 50, '0%', {
      fontFamily: '"Press Start 2P"',
      fontSize: '14px',
      fill: '#A8B5A0'
    }).setOrigin(0.5)

    // Asset text
    const assetText = this.add.text(width / 2, height / 2 + 90, '', {
      fontFamily: '"Press Start 2P"',
      fontSize: '10px',
      fill: '#8B7355'
    }).setOrigin(0.5)

    // Update progress
    this.load.on('progress', (value) => {
      progressBar.clear()
      progressBar.fillStyle(0xD4735E, 1)
      progressBar.fillRect(width / 2 - 157, height / 2 - 12, 314 * value, 24)
      percentText.setText(Math.round(value * 100) + '%')
    })

    this.load.on('fileprogress', (file) => {
      assetText.setText('Loading: ' + file.key)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      progressBorder.destroy()
      loadingText.destroy()
      percentText.destroy()
      assetText.destroy()
    })

    // Load player sprites
    this.load.image('alaa-idle', 'assets/sprites/alaa_idel_front.png')
    this.load.image('alaa-idle-back', 'assets/sprites/alaa_idel_back.png')
    this.load.image('alaa-idle-left', 'assets/sprites/alaa_idel_left_looking.png')
    this.load.image('alaa-idle-right', 'assets/sprites/alaa_idel_right_looking.png')
    this.load.image('alaa-moving', 'assets/sprites/alaa_moving.png')
    this.load.image('alaa-left1', 'assets/sprites/alaa_moving_left.png')
    this.load.image('alaa-left2', 'assets/sprites/alaa_moving_left2.png')
    this.load.image('alaa-right1', 'assets/sprites/alaa_moving_right.png')
    this.load.image('alaa-right2', 'assets/sprites/alaa_moving_right2.png')

    // Load barista
    this.load.image('barista', 'assets/sprites/barista.png')

    // Load cafe interior assets
    this.load.image('cafe-floor', 'assets/sprites/inside_assets_floor.png')
    this.load.image('cafe-wall', 'assets/sprites/inside_assets_wall.png')
    this.load.image('cafe-wall-shelf', 'assets/sprites/inside_assets_wall_with_shelf.png')
    this.load.image('cafe-counter', 'assets/sprites/inside_assets_counter.png')
    this.load.image('cafe-counter-register', 'assets/sprites/inside_assets_counter_with_regester.png')
    this.load.image('cafe-back-counter', 'assets/sprites/inside_assets_back_counter_with_espresso_machine.png')
    this.load.image('cafe-hanging-menu', 'assets/sprites/inside_assets_hanging_menu.png')
    this.load.image('cafe-hanging-plant', 'assets/sprites/inside_assets_hanging_plant.png')
    this.load.image('cafe-pastry-stand', 'assets/sprites/inside_assets_pastry_stand.png')
    this.load.image('cafe-plant', 'assets/sprites/inside_assets_plant.png')
    this.load.image('cafe-plant2', 'assets/sprites/inside_assets_plant2.png')
    this.load.image('cafe-table', 'assets/sprites/inside_assets_table.png')
    this.load.image('cafe-table-chairs', 'assets/sprites/inside_assets_table_with_chairs.png')
    this.load.image('cafe-chair-left', 'assets/sprites/inside_assets_chair_facing_left.png')
    this.load.image('cafe-chair-right', 'assets/sprites/inside_assets_chair_facing_right.png')

    // Load other assets
    this.load.image('outside-assets', 'assets/sprites/outside_assets.png')
    this.load.image('sitting-table', 'assets/sprites/sitting_on_table.png')

    // Load audio assets
    this.load.audio('street-music', 'assets/audio/music/The Weeknd - Call Out My Name (Official Video).mp3')
    this.load.audio('cafe-music', 'assets/audio/music/Acquainted.mp3')
    this.load.audio('birthday-music', 'assets/audio/music/happy-birthday.mp3')
    this.load.audio('cafe-chatter', 'assets/audio/sfx/cafe-chatter.mp3')
    this.load.audio('coffee-brewing', 'assets/audio/sfx/moka-express-brewing-27875.mp3')
    this.load.audio('menu-click', 'assets/audio/sfx/single-mouse-click-sound-hd-379373.mp3')
    this.load.audio('confetti-pop', 'assets/audio/sfx/Confetti Party Popper  Free Sound Effect.mp3')

    // Load photos (all 51 photos)
    const photoFiles = [
      '2909080060010971064_2909080052058653499.jpg',
      '2909080060010971064_2909080052067039671.jpg',
      '2909080060010971064_2909080052067039671.jpg',
      '2909080060010971064_2909080052067188303.jpg',
      '2909080060010971064_2909080052075428717.jpg',
      '3107638819929863765.jpg',
      '3517945139063665822_3517945134089155443.jpg',
      '3517945139063665822_3517945134089231516.jpg',
      '3547023760645793475_3547023749648461164.jpg',
      '3547023760645793475_3547023749656692777.jpg',
      '3547023760645793475_3547023749824555152.jpg',
      '3547023760645793475_3547023749841370928.jpg',
      '3552145429396448932_3552145423088197320.jpg',
      '3552145429396448932_3552145423096588573.jpg',
      '3552145429396448932_3552145423180404191.jpg',
      '3552145429396448932_3552145423247384947.jpg',
      '3557894925022782864_3557894916667681229.jpg',
      '3557894925022782864_3557894916676231485.jpg',
      '3557894925022782864_3557894916734962334.jpg',
      '3570981310630536200_3570981302325895198.jpg',
      '3570981310630536200_3570981302334303165.jpg',
      '3570981310630536200_3570981302460186495.jpg',
      '3576795663099234653_3576795654685566139.jpg',
      '3576795663099234653_3576795654685572702.jpg',
      '3576795663099234653_3576795654685604356.jpg',
      '3576795663099234653_3576795654685624615.jpg',
      '3623832027565112867_3623832021919353566.jpg',
      '3623832027565112867_3623832021927798625.jpg',
      '3636880825572701893_3636880819239361550.jpg',
      '3636880825572701893_3636880819423966129.jpg',
      '3636880825572701893_3636880819490969126.jpg',
      '3723824739178554551.jpg',
      '3744228272897834892_3744228264777621993.jpg',
      '3744228272897834892_3744228264777634741.jpg',
      '3744228272897834892_3744228265121602616.jpg',
      '3761367238130284608_3761367232778344037.jpg',
      '3761367238130284608_3761367232778362188.jpg',
      '3761367238130284608_3761367232778390957.jpg',
      '3763054698904201490_3763054693225091679.jpg',
      '3763054698904201490_3763054693225129813.jpg',
      '3772487021672303778_3772487014701390270.jpg',
      '3772487021672303778_3772487014709751824.jpg',
      '3779543369094323409_3779543365839529237.jpg',
      '3779543369094323409_3779543366065996641.jpg',
      '3786909768502534455_3786909760633971895.jpg',
      '3786909768502534455_3786909760642398771.jpg',
      '3786909768502534455_3786909760650796954.jpg',
      '3801320980266918343_3801320975007272279.jpg',
      '3801320980266918343_3801320975200174702.jpg',
      '3807697138742988947_3807697132887766601.jpg',
      '3807697138742988947_3807697132887771976.jpg',
      '3807697138742988947_3807697132887784902.jpg'
    ]

    photoFiles.forEach((file, index) => {
      this.load.image(`photo-${index}`, `assets/photos/${file}`)
    })

    // Store photo count in registry
    this.registry.set('photoCount', photoFiles.length)
  }

  create() {
    // Initialize game registry data
    this.registry.set('selectedDrink', null)
    this.registry.set('easterEggsFound', [])
    this.registry.set('hasReadLetter', false)

    // Small delay for dramatic effect
    this.time.delayedCall(500, () => {
      this.cameras.main.fadeOut(500)
      this.time.delayedCall(500, () => {
        this.scene.start('StreetScene')
      })
    })
  }
}
