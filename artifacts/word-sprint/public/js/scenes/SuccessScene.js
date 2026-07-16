class SuccessScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SuccessScene' });
  }

  create(data) {
    const score = data.score || 0;
    const total = data.total || 15;
    const fontFamily = '"Nunito", "Segoe UI", Arial, sans-serif';

    this.cameras.main.fadeIn(400);
    window.gameSound.playComplete();

    // Premium Background (Radial Gradient look via multiple circles)
    const bg = this.add.graphics();
    bg.fillStyle(0x1a2a6c, 1);
    bg.fillRect(0, 0, 960, 540);
    
    // Glow in center
    const glow = this.add.graphics();
    glow.fillStyle(0xb21f1f, 0.4);
    glow.fillCircle(480, 270, 400);
    const glow2 = this.add.graphics();
    glow2.fillStyle(0xfdbb2d, 0.3);
    glow2.fillCircle(480, 270, 200);

    // Title
    const title = this.add.text(480, 100, 'Island Escape Complete!', {
      fontSize: '48px',
      fontFamily: fontFamily,
      fontWeight: '900',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6,
      shadow: { offsetX: 0, offsetY: 4, color: '#000000', blur: 6, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      y: 110,
      scale: { from: 0.5, to: 1 },
      duration: 800,
      ease: 'Back.easeOut'
    });

    // Score box (glassmorphism feel)
    const box = this.add.graphics();
    box.fillStyle(0x000000, 0.5);
    box.fillRoundedRect(280, 160, 400, 230, 24);
    box.lineStyle(4, 0xffffff, 0.2);
    box.strokeRoundedRect(280, 160, 400, 230, 24);
    box.setAlpha(0);

    this.tweens.add({
      targets: box,
      alpha: 1,
      y: { from: 20, to: 0 },
      duration: 600,
      delay: 300,
      ease: 'Power2'
    });

    // Score text
    const scoreLabel = this.add.text(480, 210, 'Your Score', {
      fontSize: '28px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#e0e0e0'
    }).setOrigin(0.5).setAlpha(0);

    const scoreColor = score === total ? '#2ecc71' : (score > total / 2 ? '#f1c40f' : '#e74c3c');
    
    const scoreValue = this.add.text(480, 275, `${score} / ${total}`, {
      fontSize: '64px',
      fontFamily: fontFamily,
      fontWeight: '900',
      color: scoreColor,
      stroke: '#000000',
      strokeThickness: 5,
      shadow: { offsetX: 0, offsetY: 3, color: '#000000', blur: 4, fill: true }
    }).setOrigin(0.5).setAlpha(0).setScale(0.5);

    const messageText = score === total ? 'Perfect! You escaped the island!' : 'Nice work! Keep practicing!';
    const message = this.add.text(480, 340, messageText, {
      fontSize: '24px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [scoreLabel, message],
      alpha: 1,
      duration: 400,
      delay: 700
    });
    
    this.tweens.add({
      targets: scoreValue,
      alpha: 1,
      scale: 1,
      duration: 600,
      delay: 700,
      ease: 'Back.easeOut'
    });

    // Stars
    if (score >= total * 0.5) {
      const starCount = score === total ? 3 : (score >= total * 0.8 ? 2 : 1);
      for (let i = 0; i < 3; i++) {
        const star = this.add.text(410 + i * 60, 390, '★', {
          fontSize: '42px',
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
          delay: 1100 + i * 200,
          ease: 'Back.easeOut'
        });
      }
    }

    // Play Again button
    const btnContainer = this.add.container(480, 460).setAlpha(0);
    
    const btnBg = this.add.graphics();
    btnBg.fillStyle(0x27ae60, 1);
    btnBg.fillRoundedRect(-110, -30, 220, 60, 16);
    btnBg.lineStyle(3, 0x2ecc71, 1);
    btnBg.strokeRoundedRect(-110, -30, 220, 60, 16);
    
    const btnText = this.add.text(0, 0, 'Play Again', {
      fontSize: '26px',
      fontFamily: fontFamily,
      fontWeight: '900',
      color: '#ffffff',
      shadow: { offsetX: 0, offsetY: 2, color: '#000000', blur: 2, fill: true }
    }).setOrigin(0.5);
    
    btnContainer.add([btnBg, btnText]);
    
    const btnZone = this.add.zone(0, 0, 220, 60).setInteractive({ useHandCursor: true });
    btnContainer.add(btnZone);

    btnZone.on('pointerover', () => {
      this.tweens.add({ targets: btnContainer, scale: 1.1, duration: 150, ease: 'Back.easeOut' });
      btnBg.clear();
      btnBg.fillStyle(0x2ecc71, 1);
      btnBg.fillRoundedRect(-110, -30, 220, 60, 16);
      btnBg.lineStyle(3, 0x27ae60, 1);
      btnBg.strokeRoundedRect(-110, -30, 220, 60, 16);
    });

    btnZone.on('pointerout', () => {
      this.tweens.add({ targets: btnContainer, scale: 1, duration: 150, ease: 'Power1' });
      btnBg.clear();
      btnBg.fillStyle(0x27ae60, 1);
      btnBg.fillRoundedRect(-110, -30, 220, 60, 16);
      btnBg.lineStyle(3, 0x2ecc71, 1);
      btnBg.strokeRoundedRect(-110, -30, 220, 60, 16);
    });

    btnZone.on('pointerdown', () => {
      window.gameSound.playClick();
      this.scene.start('LevelSelectScene');
    });

    this.tweens.add({
      targets: btnContainer,
      alpha: 1,
      y: { from: 480, to: 460 },
      duration: 600,
      delay: 1500,
      ease: 'Back.easeOut'
    });

    // Confetti particles
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