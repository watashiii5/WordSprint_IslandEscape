class SuccessScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SuccessScene' });
  }

  create(data) {
    const score = data.score || 0;
    const total = data.total || 5;

    // Background
    const bg = this.add.graphics();
    for (let i = 0; i < 540; i++) {
      const t = i / 540;
      const r = Math.floor(40 + t * 20);
      const g = Math.floor(180 + t * 40);
      const b = Math.floor(100 + t * 30);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      bg.fillRect(0, i, 960, 1);
    }

    // Title
    const title = this.add.text(480, 100, 'Island Escape Complete!', {
      fontSize: '42px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      y: 120,
      duration: 600,
      ease: 'Back.easeOut'
    });

    // Score box
    const box = this.add.graphics();
    box.fillStyle(0x000000, 0.6);
    box.fillRoundedRect(280, 180, 400, 200, 16);
    box.setAlpha(0);

    this.tweens.add({
      targets: box,
      alpha: 1,
      duration: 500,
      delay: 300
    });

    // Score text
    const scoreLabel = this.add.text(480, 230, 'Your Score', {
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#cccccc'
    }).setOrigin(0.5).setAlpha(0);

    const scoreValue = this.add.text(480, 290, `${score} / ${total}`, {
      fontSize: '56px',
      fontFamily: 'Arial, sans-serif',
      color: score === total ? '#2ecc71' : '#f39c12',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5).setAlpha(0);

    const message = this.add.text(480, 345, score === total ? 'Perfect! Great job!' : 'Nice work! Keep practicing!', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [scoreLabel, scoreValue, message],
      alpha: 1,
      duration: 400,
      delay: 600
    });

    // Stars
    if (score >= total * 0.8) {
      for (let i = 0; i < 3; i++) {
        const star = this.add.text(410 + i * 60, 390, '★', {
          fontSize: '36px',
          color: i < Math.ceil(score / total * 3) ? '#f1c40f' : '#555555'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
          targets: star,
          alpha: 1,
          scale: { from: 0, to: 1 },
          duration: 400,
          delay: 900 + i * 200,
          ease: 'Back.easeOut'
        });
      }
    }

    // Play Again button
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x27ae60, 1);
    btnBg.fillRoundedRect(380, 430, 200, 50, 10);
    btnBg.setAlpha(0);

    const btnText = this.add.text(480, 455, 'Play Again', {
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5).setAlpha(0);

    const btnZone = this.add.zone(480, 455, 200, 50).setInteractive({ useHandCursor: true });

    btnZone.on('pointerover', () => {
      btnBg.clear();
      btnBg.fillStyle(0x2ecc71, 1);
      btnBg.fillRoundedRect(380, 430, 200, 50, 10);
    });

    btnZone.on('pointerout', () => {
      btnBg.clear();
      btnBg.fillStyle(0x27ae60, 1);
      btnBg.fillRoundedRect(380, 430, 200, 50, 10);
    });

    btnZone.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.tweens.add({
      targets: [btnBg, btnText],
      alpha: 1,
      duration: 400,
      delay: 1200
    });
  }
}