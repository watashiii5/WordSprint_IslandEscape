class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const fontFamily = '"Nunito", "Segoe UI", Arial, sans-serif';

    // Sky gradient background
    const bg = this.add.graphics();
    for (let i = 0; i < 540; i++) {
      const t = i / 540;
      const r = Math.floor(135 - t * 30);
      const g = Math.floor(206 + t * 20);
      const b = Math.floor(235 + t * 10);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      bg.fillRect(0, i, 960, 1);
    }

    // Sun
    const sun = this.add.circle(750, 120, 50, 0xffeaa7);
    this.tweens.add({
      targets: sun,
      scale: 1.1,
      alpha: 0.8,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Clouds
    for (let i = 0; i < 4; i++) {
      const cloud = this.add.image(100 + i * 230, 60 + Phaser.Math.Between(-20, 40), 'cloud');
      cloud.setAlpha(Phaser.Math.FloatBetween(0.6, 0.9));
      cloud.setScale(Phaser.Math.FloatBetween(0.8, 1.4));
      this.tweens.add({
        targets: cloud,
        x: cloud.x + Phaser.Math.Between(20, 40),
        duration: Phaser.Math.Between(4000, 7000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Mountains
    const mountains = this.add.graphics();
    mountains.fillStyle(0x34495e, 0.5);
    for (let x = 0; x < 960; x += 150) {
      const h = Phaser.Math.Between(80, 160);
      mountains.fillTriangle(x, 440, x + 100, 440 - h, x + 250, 440);
    }

    // Ground
    for (let x = 0; x < 960; x += 64) {
      this.add.image(x, 440, 'ground');
    }

    // Water below ground
    for (let x = 0; x < 960; x += 64) {
      const w = this.add.image(x, 468, 'water');
      this.tweens.add({
        targets: w,
        y: w.y + 5,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    // Decorative trees
    const treePositions = [120, 350, 700, 850];
    treePositions.forEach(tx => {
      this.add.image(tx, 410, 'trunk');
      const leaves = this.add.image(tx, 385, 'leaves');
      this.tweens.add({
        targets: leaves,
        angle: Phaser.Math.Between(-3, 3),
        duration: Phaser.Math.Between(2000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    });

    // Walking character
    const char = this.add.sprite(120, 400, 'char_0');
    char.setScale(0.7);
    char.play('walk');
    this.tweens.add({
      targets: char,
      x: 960,
      duration: 6000,
      repeat: -1,
      onRepeat: () => { char.x = -60; }
    });

    // Logo
    const logo = this.add.image(480, 150, 'logo');
    logo.setScale(Math.min(700 / logo.width, 250 / logo.height));
    logo.setOrigin(0.5);
    logo.setAlpha(0);
    this.tweens.add({
      targets: logo,
      alpha: 1,
      y: 160,
      scale: { from: logo.scale * 0.5, to: logo.scale },
      duration: 800,
      ease: 'Back.easeOut'
    });

    // Subtitle
    const subtitle = this.add.text(480, 270, 'Test your vocabulary as you escape the island!', {
      fontSize: '20px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 2, color: '#000000', blur: 3, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 600,
      delay: 600
    });

    // Start button
    const btnContainer = this.add.container(480, 360).setAlpha(0);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xe67e22, 1);
    btnBg.fillRoundedRect(-120, -35, 240, 70, 18);
    btnBg.lineStyle(4, 0xf39c12, 1);
    btnBg.strokeRoundedRect(-120, -35, 240, 70, 18);

    const btnText = this.add.text(0, 0, 'START GAME', {
      fontSize: '30px',
      fontFamily: fontFamily,
      fontWeight: '900',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 3, color: '#000000', blur: 3, fill: true }
    }).setOrigin(0.5);

    btnContainer.add([btnBg, btnText]);

    const btnZone = this.add.zone(0, 0, 240, 70).setInteractive({ useHandCursor: true });
    btnContainer.add(btnZone);

    btnZone.on('pointerover', () => {
      this.tweens.add({ targets: btnContainer, scale: 1.1, duration: 150, ease: 'Back.easeOut' });
      btnBg.clear();
      btnBg.fillStyle(0xf39c12, 1);
      btnBg.fillRoundedRect(-120, -35, 240, 70, 18);
      btnBg.lineStyle(4, 0xe67e22, 1);
      btnBg.strokeRoundedRect(-120, -35, 240, 70, 18);
    });

    btnZone.on('pointerout', () => {
      this.tweens.add({ targets: btnContainer, scale: 1, duration: 150, ease: 'Power1' });
      btnBg.clear();
      btnBg.fillStyle(0xe67e22, 1);
      btnBg.fillRoundedRect(-120, -35, 240, 70, 18);
      btnBg.lineStyle(4, 0xf39c12, 1);
      btnBg.strokeRoundedRect(-120, -35, 240, 70, 18);
    });

    btnZone.on('pointerdown', () => {
      window.gameSound.resume();
      window.gameSound.playClick();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => {
        this.scene.start('GameScene');
      });
    });

    this.tweens.add({
      targets: btnContainer,
      alpha: 1,
      y: { from: 380, to: 360 },
      duration: 600,
      delay: 900,
      ease: 'Back.easeOut'
    });

    // Pulsing glow on button
    this.tweens.add({
      targets: btnContainer,
      scale: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      delay: 1500,
      ease: 'Sine.easeInOut'
    });

    // Instructions
    const instructions = this.add.text(480, 450, 'Answer vocabulary questions to help your character jump across gaps!', {
      fontSize: '16px',
      fontFamily: fontFamily,
      color: '#ecf0f1',
      stroke: '#2c3e50',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: instructions,
      alpha: 0.8,
      duration: 600,
      delay: 1200
    });

    // Fade in camera
    this.cameras.main.fadeIn(500);
  }
}
