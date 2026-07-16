class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create(data) {
    this.cameras.main.fadeIn(500);
    window.gameSound.playWrong();

    const fontFamily = '"Nunito", "Segoe UI", Arial, sans-serif';

    const bg = this.add.graphics();
    bg.fillStyle(0x000033, 1);
    bg.fillRect(0, 0, 960, 540);

    for (let i = 0; i < 50; i++) {
      const star = this.add.graphics();
      star.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.5, 1));
      const size = Phaser.Math.Between(1, 3);
      star.fillCircle(0, 0, size);
      const x = Phaser.Math.Between(0, 960);
      const y = Phaser.Math.Between(0, 350);
      star.setPosition(x, y);
      
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const ground = this.add.graphics();
    ground.fillStyle(0x1a1a2e, 1);
    ground.fillRect(0, 440, 960, 100);
    for (let x = 0; x < 960; x += 64) {
      this.add.image(x, 440, 'ground');
    }

    const char = this.add.sprite(480, 380, 'character');
    char.setScale(0.6);
    char.play('hurt');
    this.tweens.add({
      targets: char,
      y: char.y + 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const gameOverText = this.add.text(480, 120, 'GAME OVER', {
      fontSize: '64px',
      fontFamily: fontFamily,
      fontWeight: '900',
      color: '#ff0000',
      stroke: '#000000',
      strokeThickness: 8,
      shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 6, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: gameOverText,
      alpha: 1,
      scale: { from: 2, to: 1 },
      duration: 800,
      ease: 'Bounce.easeOut'
    });

    const box = this.add.graphics();
    box.fillStyle(0x000000, 0.7);
    box.fillRoundedRect(280, 180, 400, 140, 20);
    box.lineStyle(4, 0xff0000, 0.8);
    box.strokeRoundedRect(280, 180, 400, 140, 20);

    this.add.text(480, 210, `Level: ${data.level || 1}`, {
      fontSize: '28px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(480, 260, `Score: ${data.score || 0}`, {
      fontSize: '28px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#f1c40f'
    }).setOrigin(0.5);

    const createBtn = (y, text, callback) => {
      const container = this.add.container(480, y);
      const bg = this.add.graphics();
      bg.fillStyle(0x333333, 1);
      bg.fillRoundedRect(-120, -25, 240, 50, 12);
      bg.lineStyle(4, 0xffffff, 0.5);
      bg.strokeRoundedRect(-120, -25, 240, 50, 12);

      const txt = this.add.text(0, 0, text, {
        fontSize: '22px',
        fontFamily: fontFamily,
        fontWeight: 'bold',
        color: '#ffffff'
      }).setOrigin(0.5);

      container.add([bg, txt]);
      const zone = this.add.zone(0, 0, 240, 50).setInteractive({ useHandCursor: true });
      container.add(zone);

      zone.on('pointerover', () => {
        container.setScale(1.1);
        bg.clear();
        bg.fillStyle(0x555555, 1);
        bg.fillRoundedRect(-120, -25, 240, 50, 12);
        bg.lineStyle(4, 0xf1c40f, 1);
        bg.strokeRoundedRect(-120, -25, 240, 50, 12);
      });

      zone.on('pointerout', () => {
        container.setScale(1);
        bg.clear();
        bg.fillStyle(0x333333, 1);
        bg.fillRoundedRect(-120, -25, 240, 50, 12);
        bg.lineStyle(4, 0xffffff, 0.5);
        bg.strokeRoundedRect(-120, -25, 240, 50, 12);
      });

      zone.on('pointerdown', () => {
        window.gameSound.playClick();
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(400, callback);
      });
      
      return container;
    };

    createBtn(380, 'TRY AGAIN', () => {
      this.scene.start('GameScene', { level: data.level || 1, score: 0 });
    });

    createBtn(450, 'MAIN MENU', () => {
      this.scene.start('TitleScene');
    });
  }
}
