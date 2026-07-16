class SuccessScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SuccessScene' });
  }

  create(data) {
    this.cameras.main.fadeIn(500);
    window.gameSound.playComplete();

    const score = data.score || 0;
    const total = data.total || 15;
    const fontFamily = '"Nunito", "Segoe UI", Arial, sans-serif';

    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0533, 0x1a0533, 0x000033, 0x000033, 1);
    bg.fillRect(0, 0, 960, 540);

    for (let i = 0; i < 50; i++) {
      const star = this.add.graphics();
      star.fillStyle(0xffffff, Phaser.Math.FloatBetween(0.5, 1));
      const size = Phaser.Math.Between(1, 3);
      star.fillCircle(0, 0, size);
      star.setPosition(Phaser.Math.Between(0, 960), Phaser.Math.Between(0, 350));
      
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const title = this.add.text(480, 80, 'VICTORY!', {
      fontSize: '64px',
      fontFamily: fontFamily,
      fontWeight: '900',
      color: '#f1c40f',
      stroke: '#000000',
      strokeThickness: 8,
      shadow: { offsetX: 4, offsetY: 4, color: '#000000', blur: 6, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      y: 100,
      scale: { from: 0.5, to: 1 },
      duration: 800,
      ease: 'Back.easeOut'
    });

    const char = this.add.sprite(480, 300, 'character');
    char.setScale(0.6);
    char.play('celebrate');
    this.tweens.add({
      targets: char,
      y: char.y + 10,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    const box = this.add.graphics();
    box.fillStyle(0x000000, 0.7);
    box.fillRoundedRect(280, 160, 400, 120, 20);
    box.lineStyle(4, 0xf1c40f, 0.8);
    box.strokeRoundedRect(280, 160, 400, 120, 20);

    this.add.text(480, 200, `Score: ${score} / ${total}`, {
      fontSize: '32px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    const messageText = score === total ? 'Perfect! You escaped the island!' : 'Nice work! Keep practicing!';
    const message = this.add.text(480, 250, messageText, {
      fontSize: '20px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#f1c40f'
    }).setOrigin(0.5);

    if (score >= total * 0.5) {
      const starCount = score === total ? 3 : (score >= total * 0.8 ? 2 : 1);
      for (let i = 0; i < 3; i++) {
        const star = this.add.text(410 + i * 60, 320, '\u2605', {
          fontSize: '42px',
          fontFamily: fontFamily,
          color: i < starCount ? '#f1c40f' : '#555555',
          stroke: '#000000',
          strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
          targets: star,
          alpha: 1,
          scale: { from: 0, to: 1 },
          angle: { from: -180, to: 0 },
          duration: 600,
          delay: 1000 + i * 200,
          ease: 'Back.easeOut'
        });
      }
    }

    const createBtn = (y, text, callback) => {
      const container = this.add.container(480, y);
      const bg = this.add.graphics();
      bg.fillStyle(0x27ae60, 1);
      bg.fillRoundedRect(-120, -25, 240, 50, 12);
      bg.lineStyle(4, 0x2ecc71, 1);
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
        bg.fillStyle(0x2ecc71, 1);
        bg.fillRoundedRect(-120, -25, 240, 50, 12);
        bg.lineStyle(4, 0xf1c40f, 1);
        bg.strokeRoundedRect(-120, -25, 240, 50, 12);
      });

      zone.on('pointerout', () => {
        container.setScale(1);
        bg.clear();
        bg.fillStyle(0x27ae60, 1);
        bg.fillRoundedRect(-120, -25, 240, 50, 12);
        bg.lineStyle(4, 0x2ecc71, 1);
        bg.strokeRoundedRect(-120, -25, 240, 50, 12);
      });

      zone.on('pointerdown', () => {
        window.gameSound.playClick();
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.time.delayedCall(400, callback);
      });
      
      return container;
    };

    createBtn(400, 'PLAY AGAIN', () => {
      this.scene.start('LevelSelectScene');
    });

    createBtn(470, 'MAIN MENU', () => {
      this.scene.start('TitleScene');
    });

    if (score === total) {
      this.time.delayedCall(600, () => {
        const confetti = this.add.particles(0, 0, 'particle', {
            x: { min: 0, max: 960 },
            y: -10,
            speed: { min: 100, max: 300 },
            angle: { min: 45, max: 135 },
            gravityY: 200,
            scale: { min: 0.5, max: 1.5 },
            lifespan: 4000,
            quantity: 4,
            tint: [ 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff ]
        });
        
        this.time.delayedCall(3000, () => confetti.stop());
      });
    }
  }
}
