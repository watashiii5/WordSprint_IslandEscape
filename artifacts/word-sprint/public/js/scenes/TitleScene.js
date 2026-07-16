class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    const fontFamily = '"Press Start 2P", monospace';

    const bg = this.add.graphics();
    for (let i = 0; i < 540; i++) {
      const t = i / 540;
      const r = Math.floor(135 - t * 30);
      const g = Math.floor(206 + t * 20);
      const b = Math.floor(235 + t * 10);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      bg.fillRect(0, i, 960, 1);
    }

    const sun = this.add.graphics();
    sun.fillStyle(0xffeaa7, 1);
    sun.fillRect(720, 90, 60, 60);
    sun.fillStyle(0xf1c40f, 1);
    sun.fillRect(725, 95, 50, 50);
    this.tweens.add({
      targets: sun,
      scale: 1.1,
      alpha: 0.8,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    for (let i = 0; i < 4; i++) {
      const cloud = this.add.graphics();
      cloud.fillStyle(0xffffff, 0.8);
      cloud.fillRect(100 + i * 230, 60 + Phaser.Math.Between(-20, 40), 60, 20);
      cloud.fillRect(110 + i * 230, 50 + Phaser.Math.Between(-20, 40), 40, 15);
      this.tweens.add({
        targets: cloud,
        x: cloud.x + Phaser.Math.Between(20, 40),
        duration: Phaser.Math.Between(4000, 7000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const mountains = this.add.graphics();
    mountains.fillStyle(0x34495e, 1);
    for (let x = 0; x < 960; x += 150) {
      const h = Phaser.Math.Between(80, 160);
      mountains.fillTriangle(x, 440, x + 100, 440 - h, x + 250, 440);
    }

    for (let x = 0; x < 960; x += 64) {
      this.add.image(x, 440, 'ground');
    }
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

    const char = this.add.sprite(120, 372, 'character');
    char.setScale(0.4);
    char.play('walk');
    this.tweens.add({
      targets: char,
      x: 960,
      duration: 6000,
      repeat: -1,
      onRepeat: () => { char.x = -60; }
    });

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

    const subtitle = this.add.text(480, 270, 'Jump across the island by answering vocabulary questions!', {
      fontSize: '14px',
      fontFamily: fontFamily,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: subtitle,
      alpha: 1,
      duration: 600,
      delay: 600
    });

    const btnContainer = this.add.container(480, 360).setAlpha(0);

    const btnBg = this.add.graphics();
    btnBg.fillStyle(0xe67e22, 1);
    btnBg.fillRect(-120, -35, 240, 70);
    btnBg.lineStyle(4, 0xf39c12, 1);
    btnBg.strokeRect(-120, -35, 240, 70);

    const btnText = this.add.text(0, 0, 'START GAME', {
      fontSize: '20px',
      fontFamily: fontFamily,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    btnContainer.add([btnBg, btnText]);

    const btnZone = this.add.zone(0, 0, 240, 70).setInteractive({ useHandCursor: true });
    btnContainer.add(btnZone);

    btnZone.on('pointerover', () => {
      this.tweens.add({ targets: btnContainer, scale: 1.1, duration: 150, ease: 'Back.easeOut' });
      btnBg.clear();
      btnBg.fillStyle(0xf39c12, 1);
      btnBg.fillRect(-120, -35, 240, 70);
      btnBg.lineStyle(4, 0xe67e22, 1);
      btnBg.strokeRect(-120, -35, 240, 70);
    });

    btnZone.on('pointerout', () => {
      this.tweens.add({ targets: btnContainer, scale: 1, duration: 150, ease: 'Power1' });
      btnBg.clear();
      btnBg.fillStyle(0xe67e22, 1);
      btnBg.fillRect(-120, -35, 240, 70);
      btnBg.lineStyle(4, 0xf39c12, 1);
      btnBg.strokeRect(-120, -35, 240, 70);
    });

    btnZone.on('pointerdown', () => {
      window.gameSound.resume();
      window.gameSound.playClick();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => {
        this.scene.start('LevelSelectScene');
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

    this.tweens.add({
      targets: btnContainer,
      scale: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1,
      delay: 1500,
      ease: 'Sine.easeInOut'
    });

    const instructions = this.add.text(480, 450, '3 levels of increasing challenge — can you escape the island?', {
      fontSize: '12px',
      fontFamily: fontFamily,
      color: '#ecf0f1',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: instructions,
      alpha: 0.8,
      duration: 600,
      delay: 1200
    });

    this.cameras.main.fadeIn(500);
  }
}
