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
      fontSize: '22px',
      fontFamily: '"Nunito", Arial, sans-serif',
      color: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 3
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

    this.load.json('questions', 'data/questions.json');
    
    this.load.image('logo', 'assets/logo.png');
    this.load.image('beach_bg', 'assets/beach_bg.jpg');
    this.load.image('wooden_sign', 'assets/wooden_sign.jpg');
    this.load.image('stone_platform', 'assets/stone_platform.jpg');
  }

  create() {
    window.gameSound.init();
    this.generateTextures();
    this.generateParticles();
    this.generateCharacterSheet();
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

  generateCharacterSheet() {
    const fW = 128;
    const fH = 128;
    const numFrames = 8;

    for (let f = 0; f < numFrames; f++) {
      const ct = this.textures.createCanvas('char_' + f, fW, fH);
      const ctx = ct.context;
      this.drawCharacterFrame(ctx, fW, fH, f);
      ct.refresh();
    }
  }

  drawCharacterFrame(ctx, w, h, frame) {
    const cx = w / 2;
    const ground = h - 8;

    let bodyDy = 0;
    let ll = 0, rl = 0;
    let la = 0, ra = 0;

    if (frame < 4) {
      const a = (frame / 4) * Math.PI * 2;
      ll = Math.sin(a) * 22;
      rl = Math.sin(a + Math.PI) * 22;
      la = Math.sin(a + Math.PI) * 15;
      ra = Math.sin(a) * 15;
      bodyDy = Math.abs(Math.sin(a * 2)) * 2;
    } else if (frame === 5) {
      ll = 15; rl = -15; bodyDy = 5;
    } else if (frame === 6) {
      ll = 30; rl = -30; bodyDy = 15; la = -30; ra = -30;
    } else if (frame === 7) {
      ll = -10; rl = 10; bodyDy = 2;
    }

    const headR = 11;
    const bw = 18, bh = 22;
    const legL = 18;
    const armL = 16;

    const by = ground - legL - bh / 2 + bodyDy;
    const hy = by - bh / 2 - headR + 2;

    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, ground + 3, 12, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    this._drawLimb(ctx, cx - 4, by + bh / 2, 6, legL, ll, '#37474F', '#795548');
    this._drawLimb(ctx, cx + 4, by + bh / 2, 6, legL, rl, '#37474F', '#795548');

    ctx.fillStyle = '#2196F3';
    this._fillRoundRect(ctx, cx - bw / 2, by - bh / 2, bw, bh, 4);
    ctx.fill();
    ctx.fillStyle = '#1976D2';
    ctx.fillRect(cx - 1, by - bh / 2 + 3, 2, bh - 6);

    this._drawArm(ctx, cx - bw / 2, by - bh / 4, armL, la, '#2196F3', '#f5cba7');
    this._drawArm(ctx, cx + bw / 2, by - bh / 4, armL, ra, '#2196F3', '#f5cba7');

    ctx.fillStyle = '#f5cba7';
    ctx.beginPath();
    ctx.arc(cx, hy, headR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.arc(cx, hy - 2, headR + 1, Math.PI + 0.4, -0.4);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx - 4, hy - 1, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 4, hy - 1, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#212121';
    ctx.beginPath();
    ctx.arc(cx - 4, hy - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 4, hy - 1, 1.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#c62828';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (frame >= 5 && frame <= 6) {
      ctx.arc(cx, hy + 5, 2.5, 0, Math.PI * 2);
    } else {
      ctx.arc(cx, hy + 4, 3, 0.2, Math.PI - 0.2);
    }
    ctx.stroke();
  }

  _drawLimb(ctx, x, y, w, h, angle, c1, c2) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillStyle = c1;
    ctx.fillRect(-w / 2, 0, w, h * 0.7);
    ctx.fillStyle = c2;
    ctx.fillRect(-w / 2 - 0.5, h * 0.7, w + 1, h * 0.3);
    ctx.restore();
  }

  _drawArm(ctx, x, y, len, angle, c1, c2) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle * Math.PI / 180);
    ctx.fillStyle = c1;
    ctx.fillRect(-2, 0, 4, len * 0.55);
    ctx.fillStyle = c2;
    ctx.fillRect(-2, len * 0.55, 4, len * 0.45);
    ctx.restore();
  }

  _fillRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  createAnimations() {
    this.anims.create({
      key: 'walk',
      frames: [
        { key: 'char_0' },
        { key: 'char_1' },
        { key: 'char_2' },
        { key: 'char_3' }
      ],
      frameRate: 8,
      repeat: -1
    });

    this.anims.create({
      key: 'idle',
      frames: [{ key: 'char_4' }],
      frameRate: 1
    });

    this.anims.create({
      key: 'jump',
      frames: [
        { key: 'char_5' },
        { key: 'char_6' },
        { key: 'char_7' }
      ],
      frameRate: 10,
      repeat: 0
    });
  }
}
