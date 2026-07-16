class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const barBg = this.add.graphics();
    barBg.fillStyle(0x2c3e50, 1);
    barBg.fillRoundedRect(w / 2 - 160, h / 2 - 15, 320, 30, 8);
    const bar = this.add.graphics();
    const loadingText = this.add.text(w / 2, h / 2 - 40, 'Loading...', {
      fontSize: '16px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      bar.clear();
      bar.fillStyle(0xe67e22, 1);
      bar.fillRoundedRect(w / 2 - 155, h / 2 - 10, 310 * value, 20, 6);
    });

    this.load.on('complete', () => {
      bar.destroy();
      barBg.destroy();
      loadingText.destroy();
    });

    this.load.json('questions', 'data/questions.json?v=3');
    
    this.load.image('logo', 'assets/logo.png?v=3');
    this.load.image('beach_bg', 'assets/beach_bg.jpg?v=3');
    this.load.image('wooden_sign', 'assets/wooden_sign.png?v=3');
    this.load.spritesheet('character', 'assets/character_1.png?v=3', {
      frameWidth: 261,
      frameHeight: 341
    });
  }

  create() {
    window.gameSound.init();
    this.generateTextures();
    this.generateParticles();
    this.createAnimations();
    this.scene.start('TitleScene');
  }

  generateTextures() {
    const g = this.add.graphics();

    g.clear();
    g.fillStyle(0x8B6914, 1);
    g.fillRoundedRect(0, 0, 64, 64, 8);
    g.fillStyle(0xA0782C, 1);
    g.fillRoundedRect(2, 2, 60, 30, 6);
    g.fillStyle(0x6B4F12, 1);
    for (let i = 0; i < 8; i++) {
      g.fillRect(Phaser.Math.Between(4, 56), Phaser.Math.Between(32, 58), Phaser.Math.Between(4, 12), 3);
    }
    g.lineStyle(2, 0x5C4010, 1);
    g.strokeRoundedRect(0, 0, 64, 64, 8);
    g.generateTexture('ground', 64, 64);

    g.clear();
    g.fillStyle(0x3498db, 1);
    g.fillRect(0, 0, 64, 64);
    g.fillStyle(0x5DADE2, 0.6);
    g.fillRect(0, 0, 64, 16);
    g.fillStyle(0xAED6F1, 0.4);
    g.fillRect(4, 4, 20, 6);
    g.fillRect(36, 10, 18, 5);
    g.generateTexture('water', 64, 64);

    g.clear();
    g.fillStyle(0xffffff, 0.95);
    g.fillCircle(50, 30, 22);
    g.fillCircle(30, 28, 18);
    g.fillCircle(70, 28, 18);
    g.fillCircle(20, 35, 14);
    g.fillCircle(80, 35, 14);
    g.fillStyle(0xf0f0f0, 0.5);
    g.fillCircle(50, 38, 20);
    g.generateTexture('cloud', 100, 56);

    g.clear();
    g.fillStyle(0x6D4C2A, 1);
    g.fillRoundedRect(6, 0, 12, 48, 3);
    g.fillStyle(0x8B6914, 0.5);
    g.fillRect(8, 4, 3, 40);
    g.generateTexture('trunk', 24, 48);

    g.clear();
    g.fillStyle(0x27ae60, 1);
    g.fillCircle(22, 18, 18);
    g.fillCircle(10, 22, 14);
    g.fillCircle(34, 22, 14);
    g.fillStyle(0x2ecc71, 0.7);
    g.fillCircle(22, 12, 10);
    g.fillStyle(0x1e8449, 0.6);
    g.fillCircle(14, 26, 8);
    g.fillCircle(30, 28, 8);
    g.generateTexture('leaves', 44, 40);

    g.clear();
    g.fillStyle(0x2c3e50, 1);
    g.fillRoundedRect(0, 0, 160, 50, 14);
    g.fillStyle(0x34495e, 0.6);
    g.fillRoundedRect(4, 4, 152, 20, 10);
    g.lineStyle(3, 0x5dade2, 0.8);
    g.strokeRoundedRect(0, 0, 160, 50, 14);
    g.generateTexture('platform', 160, 50);

    g.clear();
    g.fillStyle(0x1e8449, 1);
    g.fillRoundedRect(0, 0, 160, 50, 14);
    g.fillStyle(0x27ae60, 0.6);
    g.fillRoundedRect(4, 4, 152, 20, 10);
    g.lineStyle(3, 0x2ecc71, 1);
    g.strokeRoundedRect(0, 0, 160, 50, 14);
    g.generateTexture('platformGreen', 160, 50);

    g.clear();
    g.fillStyle(0x922b21, 1);
    g.fillRoundedRect(0, 0, 160, 50, 14);
    g.fillStyle(0xc0392b, 0.6);
    g.fillRoundedRect(4, 4, 152, 20, 10);
    g.lineStyle(3, 0xe74c3c, 1);
    g.strokeRoundedRect(0, 0, 160, 50, 14);
    g.generateTexture('platformRed', 160, 50);

    g.destroy();
  }

  generateParticles() {
    const pt = this.add.graphics();
    pt.fillStyle(0xffffff, 1);
    pt.fillCircle(4, 4, 4);
    pt.generateTexture('particle', 8, 8);
    pt.destroy();
    
    const sp = this.add.graphics();
    sp.fillStyle(0xffffff, 1);
    sp.fillTriangle(4, 0, 5, 3, 8, 4);
    sp.fillTriangle(8, 4, 5, 5, 4, 8);
    sp.fillTriangle(4, 8, 3, 5, 0, 4);
    sp.fillTriangle(0, 4, 3, 3, 4, 0);
    sp.generateTexture('sparkle', 8, 8);
    sp.destroy();

    const arrow = this.add.graphics();
    arrow.fillStyle(0xf1c40f, 1);
    arrow.fillTriangle(0, 15, 30, 0, 30, 30);
    arrow.fillStyle(0xf39c12, 1);
    arrow.fillTriangle(10, 15, 30, 6, 30, 24);
    arrow.generateTexture('arrow', 30, 30);
    arrow.destroy();
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
      frames: [{ key: 'character', frame: 5 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'think',
      frames: [{ key: 'character', frame: 4 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'celebrate',
      frames: this.anims.generateFrameNumbers('character', { start: 6, end: 6 }),
      frameRate: 4,
      repeat: 2
    });

    this.anims.create({
      key: 'crouch',
      frames: [{ key: 'character', frame: 7 }],
      frameRate: 1
    });

    this.anims.create({
      key: 'jump',
      frames: [{ key: 'character', frame: 8 }],
      frameRate: 10,
      repeat: 0
    });

    this.anims.create({
      key: 'float',
      frames: this.anims.generateFrameNumbers('character', { start: 9, end: 10 }),
      frameRate: 4,
      repeat: -1
    });

    this.anims.create({
      key: 'hurt',
      frames: [{ key: 'character', frame: 11 }],
      frameRate: 1
    });
  }
}
