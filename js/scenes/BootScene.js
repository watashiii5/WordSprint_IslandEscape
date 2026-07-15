class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.json('questions', 'data/questions.json');
  }

  create() {
    this.generateTextures();
    this.scene.start('GameScene');
  }

  generateTextures() {
    // Character body
    const charBody = this.add.graphics();
    charBody.fillStyle(0x4a90d9, 1);
    charBody.fillRoundedRect(0, 0, 28, 36, 6);
    charBody.generateTexture('charBody', 28, 36);
    charBody.destroy();

    // Character head
    const charHead = this.add.graphics();
    charHead.fillStyle(0xf5c6a0, 1);
    charHead.fillCircle(12, 12, 12);
    charHead.fillStyle(0x333333, 1);
    charHead.fillCircle(8, 10, 2);
    charHead.fillCircle(16, 10, 2);
    charHead.lineStyle(2, 0x333333, 1);
    charHead.beginPath();
    charHead.arc(12, 14, 5, 0.2, Math.PI - 0.2, false);
    charHead.strokePath();
    charHead.generateTexture('charHead', 24, 24);
    charHead.destroy();

    // Ground tile
    const ground = this.add.graphics();
    ground.fillStyle(0x8B4513, 1);
    ground.fillRect(0, 0, 64, 48);
    ground.fillStyle(0x228B22, 1);
    ground.fillRect(0, 0, 64, 12);
    ground.fillStyle(0x2d8f2d, 1);
    for (let i = 0; i < 8; i++) {
      ground.fillRect(i * 8, 0, 4, 16);
    }
    ground.generateTexture('ground', 64, 48);
    ground.destroy();

    // Answer platform
    const platform = this.add.graphics();
    platform.fillStyle(0x5a3e1b, 1);
    platform.fillRoundedRect(0, 0, 160, 50, 8);
    platform.lineStyle(2, 0x8B6914, 1);
    platform.strokeRoundedRect(0, 0, 160, 50, 8);
    platform.generateTexture('platform', 160, 50);
    platform.destroy();

    // Green platform (correct)
    const platGreen = this.add.graphics();
    platGreen.fillStyle(0x27ae60, 1);
    platGreen.fillRoundedRect(0, 0, 160, 50, 8);
    platGreen.lineStyle(2, 0x2ecc71, 1);
    platGreen.strokeRoundedRect(0, 0, 160, 50, 8);
    platGreen.generateTexture('platformGreen', 160, 50);
    platGreen.destroy();

    // Red platform (incorrect)
    const platRed = this.add.graphics();
    platRed.fillStyle(0xc0392b, 1);
    platRed.fillRoundedRect(0, 0, 160, 50, 8);
    platRed.lineStyle(2, 0xe74c3c, 1);
    platRed.strokeRoundedRect(0, 0, 160, 50, 8);
    platRed.generateTexture('platformRed', 160, 50);
    platRed.destroy();

    // Cloud
    const cloud = this.add.graphics();
    cloud.fillStyle(0xffffff, 0.85);
    cloud.fillCircle(30, 30, 20);
    cloud.fillCircle(55, 25, 25);
    cloud.fillCircle(80, 30, 18);
    cloud.fillCircle(45, 38, 18);
    cloud.generateTexture('cloud', 100, 56);
    cloud.destroy();

    // Palm tree trunk
    const trunk = this.add.graphics();
    trunk.fillStyle(0x8B5A2B, 1);
    trunk.fillRect(0, 0, 14, 60);
    trunk.fillStyle(0x7a4e26, 1);
    for (let i = 0; i < 6; i++) {
      trunk.fillRect(0, i * 10, 14, 2);
    }
    trunk.generateTexture('trunk', 14, 60);
    trunk.destroy();

    // Palm tree leaves
    const leaves = this.add.graphics();
    leaves.fillStyle(0x228B22, 1);
    leaves.fillEllipse(0, 10, 50, 16);
    leaves.fillEllipse(40, 0, 50, 16);
    leaves.fillEllipse(20, -5, 40, 14);
    leaves.fillStyle(0x2ea82e, 1);
    leaves.fillEllipse(10, 5, 30, 10);
    leaves.generateTexture('leaves', 60, 30);
    leaves.destroy();

    // Water tile
    const water = this.add.graphics();
    water.fillStyle(0x3498db, 0.8);
    water.fillRect(0, 0, 64, 48);
    water.lineStyle(2, 0x2980b9, 0.5);
    for (let i = 0; i < 3; i++) {
      water.beginPath();
      water.moveTo(0, 10 + i * 16);
      water.lineTo(16, 6 + i * 16);
      water.lineTo(32, 10 + i * 16);
      water.lineTo(48, 6 + i * 16);
      water.lineTo(64, 10 + i * 16);
      water.strokePath();
    }
    water.generateTexture('water', 64, 48);
    water.destroy();

    // Arrow indicator
    const arrow = this.add.graphics();
    arrow.fillStyle(0xffffff, 0.8);
    arrow.fillTriangle(0, 15, 30, 0, 30, 30);
    arrow.generateTexture('arrow', 30, 30);
    arrow.destroy();
  }
}