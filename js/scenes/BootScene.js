class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.json('questions', 'data/questions.json');
    
    // Load new visual assets
    this.load.image('logo', 'assets/logo.png');
    this.load.image('beach_bg', 'assets/beach_bg.png');
    this.load.image('wooden_sign', 'assets/wooden_sign.png');
    this.load.image('stone_platform', 'assets/stone_platform.png');
    
    // Load character spritesheet
    this.load.spritesheet('character', 'assets/character.png', {
      frameWidth: 352,
      frameHeight: 192
    });
  }

  create() {
    this.createAnimations();
    this.generateParticles();
    this.scene.start('GameScene');
  }

  createAnimations() {
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('character', { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'character', frame: 4 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'jump',
      frames: this.anims.generateFrameNumbers('character', { start: 8, end: 10 }),
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'trip',
      frames: this.anims.generateFrameNumbers('character', { start: 12, end: 15 }),
      frameRate: 8,
      repeat: 0
    });
  }

  generateParticles() {
    // Generate simple white particle (since we might still want dust/sparkles)
    const pt = this.add.graphics();
    pt.fillStyle(0xffffff, 1);
    pt.fillCircle(4, 4, 4);
    pt.generateTexture('particle', 8, 8);
    pt.destroy();
    
    // Generate sparkle (star shape)
    const sp = this.add.graphics();
    sp.fillStyle(0xffffff, 1);
    sp.fillTriangle(4,0, 5,3, 8,4);
    sp.fillTriangle(8,4, 5,5, 4,8);
    sp.fillTriangle(4,8, 3,5, 0,4);
    sp.fillTriangle(0,4, 3,3, 4,0);
    sp.generateTexture('sparkle', 8, 8);
    sp.destroy();

    // Arrow indicator (juicy)
    const arrow = this.add.graphics();
    arrow.fillStyle(0xf1c40f, 1);
    arrow.fillTriangle(0, 15, 30, 0, 30, 30);
    arrow.fillStyle(0xf39c12, 1);
    arrow.fillTriangle(10, 15, 30, 6, 30, 24);
    arrow.generateTexture('arrow', 30, 30);
    arrow.destroy();
  }
}