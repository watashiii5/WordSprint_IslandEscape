class LevelSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'LevelSelectScene' });
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

    const sun = this.add.circle(750, 120, 50, 0xffeaa7);
    this.tweens.add({
      targets: sun, scale: 1.1, alpha: 0.8, duration: 2000,
      yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
    });

    for (let i = 0; i < 4; i++) {
      const cloud = this.add.image(100 + i * 230, 60 + Phaser.Math.Between(-20, 40), 'cloud');
      cloud.setAlpha(Phaser.Math.FloatBetween(0.6, 0.9));
      cloud.setScale(Phaser.Math.FloatBetween(0.8, 1.4));
      this.tweens.add({
        targets: cloud, x: cloud.x + Phaser.Math.Between(20, 40),
        duration: Phaser.Math.Between(4000, 7000),
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    }

    for (let x = 0; x < 960; x += 64) {
      this.add.image(x, 440, 'ground');
    }
    for (let x = 0; x < 960; x += 64) {
      const w = this.add.image(x, 468, 'water');
      this.tweens.add({
        targets: w, y: w.y + 5, duration: 1200,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
      });
    }

    const title = this.add.text(480, 70, 'Select Level', {
      fontSize: '36px', fontFamily: fontFamily,
      color: '#ffffff', stroke: '#000000', strokeThickness: 6,
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({ targets: title, alpha: 1, y: 80, duration: 600, ease: 'Back.easeOut' });

    const levels = [
      { name: 'Beach Basics', color: 0x3498db, icon: '1', desc: 'Easy' },
      { name: 'Tropical Challenge', color: 0xe67e22, icon: '2', desc: 'Medium' },
      { name: 'Island Master', color: 0xe74c3c, icon: '3', desc: 'Hard' }
    ];

    levels.forEach((level, i) => {
      const y = 180 + i * 110;
      const container = this.add.container(480, y + 40).setAlpha(0);

      const cardBg = this.add.graphics();
      cardBg.fillStyle(level.color, 1);
      cardBg.fillRect(-200, -40, 400, 80);
      cardBg.lineStyle(4, 0xffffff, 0.3);
      cardBg.strokeRect(-200, -40, 400, 80);

      const numText = this.add.text(-170, 0, level.icon, {
        fontSize: '32px', fontFamily: fontFamily,
        color: '#ffffff', stroke: '#000000', strokeThickness: 3
      }).setOrigin(0, 0.5);

      const nameText = this.add.text(-130, -10, level.name, {
        fontSize: '16px', fontFamily: fontFamily,
        color: '#ffffff', stroke: '#000000', strokeThickness: 3
      }).setOrigin(0, 0.5);

      const descText = this.add.text(-130, 14, level.desc, {
        fontSize: '12px', fontFamily: fontFamily, color: '#ffffff', alpha: 0.8
      }).setOrigin(0, 0.5);

      const arrow = this.add.text(170, 0, '▶', {
        fontSize: '24px', fontFamily: fontFamily, color: '#ffffff'
      }).setOrigin(0.5);

      container.add([cardBg, numText, nameText, descText, arrow]);

      const zone = this.add.zone(0, 0, 400, 80).setInteractive({ useHandCursor: true });
      container.add(zone);

      zone.on('pointerover', () => {
        this.tweens.add({ targets: container, scale: 1.05, duration: 150, ease: 'Back.easeOut' });
        cardBg.clear();
        cardBg.fillStyle(level.color, 1);
        cardBg.fillRect(-200, -40, 400, 80);
        cardBg.lineStyle(4, 0xffffff, 0.8);
        cardBg.strokeRect(-200, -40, 400, 80);
      });

      zone.on('pointerout', () => {
        this.tweens.add({ targets: container, scale: 1, duration: 150, ease: 'Power1' });
        cardBg.clear();
        cardBg.fillStyle(level.color, 1);
        cardBg.fillRect(-200, -40, 400, 80);
        cardBg.lineStyle(4, 0xffffff, 0.3);
        cardBg.strokeRect(-200, -40, 400, 80);
      });

      zone.on('pointerdown', () => {
        window.gameSound.playClick();
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(400, () => {
          this.scene.start('GameScene', { level: i + 1, score: 0 });
        });
      });

      this.tweens.add({
        targets: container, alpha: 1, y: y,
        duration: 500, delay: 300 + i * 150,
        ease: 'Back.easeOut'
      });
    });

    const backBtn = this.add.text(480, 500, '< BACK', {
      fontSize: '16px', fontFamily: fontFamily,
      color: '#ecf0f1', stroke: '#000000', strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0).setInteractive({ useHandCursor: true });

    backBtn.on('pointerover', () => backBtn.setColor('#f1c40f'));
    backBtn.on('pointerout', () => backBtn.setColor('#ecf0f1'));
    backBtn.on('pointerdown', () => {
      window.gameSound.playClick();
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.time.delayedCall(400, () => {
        this.scene.start('TitleScene');
      });
    });

    this.tweens.add({ targets: backBtn, alpha: 0.8, duration: 600, delay: 1000 });

    this.cameras.main.fadeIn(500);
  }
}
