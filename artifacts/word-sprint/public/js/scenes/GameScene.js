class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.GROUND_Y = 440;
    this.PLATFORM_WIDTH = 64;
    this.GAP_WIDTH = 200;
    this.WALK_SPEED = 150;
    this.QUESTION_PLATFORM_Y = 220;
    this.WORLD_PADDING = 200;
  }

  create() {
    this.score = 0;
    this.currentQuestion = 0;
    this.gameState = 'RUNNING';
    this.questions = this.cache.json.get('questions');
    this.totalQuestions = this.questions.length;

    this.createBackground();
    this.createWorld();
    this.createCharacter();
    this.createUI();
    this.setupCamera();
    this.cameras.main.fadeIn(400);
    this.startWalking();
  }

  createBackground() {
    const worldWidth = this.totalQuestions * (this.PLATFORM_WIDTH + this.GAP_WIDTH) + this.WORLD_PADDING * 2;

    const bgImg = this.add.image(0, 0, 'beach_bg').setOrigin(0, 0);
    bgImg.setDisplaySize(worldWidth, 540);
    bgImg.setScrollFactor(0.1);

    const bg = this.add.graphics();
    for (let i = 0; i < 540; i++) {
      const t = i / 540;
      const r = Math.floor(255 - t * 40);
      const g = Math.floor(180 + t * 30);
      const b = Math.floor(140 + t * 80);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 0.4);
      bg.fillRect(0, i, worldWidth, 1);
    }

    const sun = this.add.circle(800, 150, 60, 0xffeaa7);
    sun.setScrollFactor(0.05);
    this.tweens.add({
      targets: sun,
      scale: 1.1,
      alpha: 0.8,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    for (let i = 0; i < Math.ceil(worldWidth / 250); i++) {
      const cloud = this.add.image(i * 250 + Phaser.Math.Between(-50, 50), Phaser.Math.Between(40, 160), 'cloud');
      cloud.setAlpha(Phaser.Math.FloatBetween(0.6, 0.9));
      cloud.setScale(Phaser.Math.FloatBetween(0.7, 1.3));
      cloud.setScrollFactor(0.2);

      this.tweens.add({
        targets: cloud,
        y: cloud.y + Phaser.Math.Between(-10, 10),
        duration: Phaser.Math.Between(3000, 5000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });
    }

    const mtKey = 'mountains_' + worldWidth;
    if (!this.textures.exists(mtKey)) {
      const mountains = this.add.graphics();
      mountains.fillStyle(0x34495e, 0.5);
      for (let x = 0; x < worldWidth * 0.8; x += 150) {
        const h = Phaser.Math.Between(100, 200);
        mountains.fillTriangle(x, this.GROUND_Y + 50, x + 100, this.GROUND_Y - h, x + 250, this.GROUND_Y + 50);
      }
      mountains.generateTexture(mtKey, worldWidth * 0.8, 540);
      mountains.destroy();
    }

    this.add.image(0, 0, mtKey).setOrigin(0, 0).setScrollFactor(0.4);
  }

  createWorld() {
    this.platforms = this.physics.add.staticGroup();
    this.gaps = [];

    const worldWidth = this.totalQuestions * (this.PLATFORM_WIDTH + this.GAP_WIDTH) + this.WORLD_PADDING * 2;

    for (let i = 0; i <= this.totalQuestions; i++) {
      const x = this.WORLD_PADDING + i * (this.PLATFORM_WIDTH + this.GAP_WIDTH);
      const plat = this.platforms.create(x, this.GROUND_Y, 'ground').setDepth(10);
      plat.setScale(1, 1).refreshBody();
      
      this.tweens.add({
        targets: plat,
        y: plat.y + 4,
        duration: 1500 + i * 100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
      });

      if (i < this.totalQuestions) {
        this.gaps.push({
          x: x + this.PLATFORM_WIDTH / 2 + this.GAP_WIDTH / 2,
          questionIndex: i,
          triggered: false
        });
      }
    }

    for (const gap of this.gaps) {
      for (let wx = gap.x - this.GAP_WIDTH / 2; wx < gap.x + this.GAP_WIDTH / 2; wx += 64) {
        const w = this.add.image(wx, this.GROUND_Y + 28, 'water').setDepth(2);
        this.tweens.add({
          targets: w,
          y: w.y + 6,
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }

    for (let i = 0; i < this.totalQuestions + 1; i++) {
      const x = this.WORLD_PADDING + i * (this.PLATFORM_WIDTH + this.GAP_WIDTH);
      if (Phaser.Math.Between(0, 1) === 0) {
        const treeX = x + Phaser.Math.Between(-15, 15);
        this.add.image(treeX, this.GROUND_Y - 30, 'trunk').setDepth(12);
        const leaves = this.add.image(treeX, this.GROUND_Y - 55, 'leaves').setDepth(12);
        
        this.tweens.add({
          targets: leaves,
          angle: Phaser.Math.Between(-3, 3),
          duration: Phaser.Math.Between(2000, 3000),
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    }
  }

  createCharacter() {
    this.charContainer = this.add.container(this.WORLD_PADDING, this.GROUND_Y - 48).setDepth(15);

    this.charShadow = this.add.ellipse(0, 34, 24, 8, 0x000000, 0.3);

    this.charSprite = this.add.sprite(0, 0, 'character', 4);
    this.charSprite.setScale(0.35);

    this.charContainer.add([this.charShadow, this.charSprite]);

    this.charContainer.setSize(30, 48);
    this.physics.world.enable(this.charContainer);
    this.charContainer.body.setAllowGravity(false);
    this.charContainer.body.setCollideWorldBounds(false);

    this.isJumping = false;
    this.walkTween = null;
    
    this.dustEmitter = this.add.particles(0, 0, 'particle', {
        x: { onEmit: () => this.charContainer.x, onUpdate: () => this.charContainer.x },
        y: { onEmit: () => this.charContainer.y + 30, onUpdate: () => this.charContainer.y + 30 },
        speed: { min: 10, max: 30 },
        angle: { min: 160, max: 200 },
        scale: { start: 1, end: 0 },
        alpha: { start: 0.5, end: 0 },
        lifespan: 400,
        frequency: 100,
        blendMode: 'NORMAL'
    }).setDepth(14);
    this.dustEmitter.stop();
  }

  createUI() {
    const fontFamily = '"Nunito", "Segoe UI", Arial, sans-serif';

    this.scoreText = this.add.text(20, 20, `Score: 0 / ${this.totalQuestions}`, {
      fontSize: '26px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 5,
      shadow: { offsetX: 0, offsetY: 4, color: '#000000', blur: 4, stroke: false, fill: true }
    }).setScrollFactor(0).setDepth(100);

    this.promptSign = this.add.image(480, 70, 'wooden_sign')
      .setDisplaySize(720, 110)
      .setScrollFactor(0)
      .setDepth(90)
      .setVisible(false);

    this.promptText = this.add.text(480, 70, '', {
      fontSize: '28px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#ffffff',
      stroke: '#2c3e50',
      strokeThickness: 4,
      wordWrap: { width: 660 },
      align: 'center'
    }).setScrollFactor(0).setDepth(91).setVisible(false).setOrigin(0.5);

    this.answerPlatforms = [];
    this.answerTexts = [];

    for (let i = 0; i < 3; i++) {
      const x = 280 + i * 200;
      const platContainer = this.add.container(x, this.QUESTION_PLATFORM_Y)
        .setScrollFactor(0).setDepth(90).setVisible(false);
      
      const plat = this.add.image(0, 0, 'platform');
      
      const txt = this.add.text(0, 0, '', {
        fontSize: '22px',
        fontFamily: fontFamily,
        fontWeight: 'bold',
        color: '#ffffff',
        stroke: '#2c3e50',
        strokeThickness: 4
      }).setOrigin(0.5);

      platContainer.add([plat, txt]);

      this.answerPlatforms.push({ container: platContainer, image: plat });
      this.answerTexts.push(txt);
    }

    this.input.on('pointerdown', (pointer) => {
      if (this.gameState !== 'QUESTION') return;
      for (let i = 0; i < 3; i++) {
        const container = this.answerPlatforms[i].container;
        if (!container.visible) continue;
        const bounds = container.getBounds();
        if (pointer.x >= bounds.left && pointer.x <= bounds.right &&
            pointer.y >= bounds.top && pointer.y <= bounds.bottom) {
          this.handleAnswer(i);
          break;
        }
      }
    });

    this.input.on('pointermove', (pointer) => {
      if (this.gameState !== 'QUESTION') return;
      for (let i = 0; i < 3; i++) {
        const container = this.answerPlatforms[i].container;
        const plat = this.answerPlatforms[i].image;
        if (!container.visible) continue;
        const bounds = container.getBounds();
        const over = pointer.x >= bounds.left && pointer.x <= bounds.right &&
                     pointer.y >= bounds.top && pointer.y <= bounds.bottom;
        if (over && !this._hoveredBtn) {
          this._hoveredBtn = i;
          this.tweens.add({ targets: container, scale: 1.1, duration: 150, ease: 'Back.easeOut' });
          plat.setTint(0xe0e0e0);
        } else if (!over && this._hoveredBtn === i) {
          this._hoveredBtn = null;
          this.tweens.add({ targets: container, scale: 1, duration: 150, ease: 'Power1' });
          plat.clearTint();
        }
      }
    });

    this._hoveredBtn = null;

    this.hintText = this.add.text(480, 310, '', {
      fontSize: '20px',
      fontFamily: fontFamily,
      fontWeight: 'bold',
      color: '#ffeb3b',
      stroke: '#c0392b',
      strokeThickness: 4,
      shadow: { offsetX: 0, offsetY: 2, color: '#000000', blur: 2, fill: true },
      wordWrap: { width: 660 },
      align: 'center'
    }).setScrollFactor(0).setDepth(91).setVisible(false).setOrigin(0.5);

    this.arrow = this.add.image(900, this.GROUND_Y - 80, 'arrow')
      .setScrollFactor(0)
      .setDepth(80)
      .setAlpha(0);

    this.tweens.add({
      targets: this.arrow,
      x: 920,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
    
    this.sparkleEmitter = this.add.particles(0, 0, 'sparkle', {
        speed: { min: 50, max: 150 },
        angle: { min: 0, max: 360 },
        scale: { start: 1, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 800,
        tint: 0x2ecc71,
        blendMode: 'ADD'
    }).setDepth(50);
    this.sparkleEmitter.stop();
  }

  setupCamera() {
    const worldWidth = this.totalQuestions * (this.PLATFORM_WIDTH + this.GAP_WIDTH) + this.WORLD_PADDING * 2;
    this.cameras.main.setBounds(0, 0, worldWidth, 540);
    this.cameras.main.startFollow(this.charContainer, true, 0.08, 0.08);
  }

  startWalking() {
    this.charContainer.body.setVelocityX(this.WALK_SPEED);
    this.dustEmitter.start();
    this.charSprite.play('walk');
    
    this.walkTween = this.tweens.add({
      targets: this.charContainer,
      y: this.GROUND_Y - 52,
      duration: 150,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  stopWalking() {
    this.charContainer.body.setVelocityX(0);
    this.dustEmitter.stop();
    this.charSprite.stop();
    this.charSprite.setFrame(4);
    if (this.walkTween) {
      this.walkTween.stop();
      this.charContainer.y = this.GROUND_Y - 48;
    }
  }

  update() {
    if (this.gameState !== 'RUNNING') return;

    for (const gap of this.gaps) {
      if (!gap.triggered && Math.abs(this.charContainer.x - gap.x) < 90) {
        gap.triggered = true;
        this.triggerQuestion(gap.questionIndex);
        break;
      }
    }
  }

  triggerQuestion(index) {
    this.currentQuestion = index;
    this.gameState = 'QUESTION';
    this._hoveredBtn = null;
    this.stopWalking();
    this.charSprite.play('idle');

    const q = this.questions[index];

    this.promptSign.setVisible(true).setAlpha(0);
    this.promptText.setText(`${index + 1}. ${q.prompt}`).setVisible(true);

    for (let i = 0; i < 3; i++) {
      this.tweens.killTweensOf(this.answerPlatforms[i].container);
      const plat = this.answerPlatforms[i];
      plat.container.setVisible(true).setAlpha(1).setScale(1).setY(this.QUESTION_PLATFORM_Y + 50);
      plat.image.setTexture('platform').clearTint();
      this.answerTexts[i].setText(q.options[i]).setVisible(true).setColor('#ffffff');
    }

    this.hintText.setVisible(false);
    this.arrow.setAlpha(0);

    this.promptText.scaleX = 0;
    this.promptText.scaleY = 0;
    this.tweens.add({
      targets: [this.promptSign],
      alpha: 1,
      duration: 300,
      ease: 'Power2'
    });
    this.tweens.add({
      targets: [this.promptText],
      scale: 1,
      duration: 400,
      delay: 100,
      ease: 'Back.easeOut'
    });

    for (let i = 0; i < 3; i++) {
        this.tweens.add({
            targets: this.answerPlatforms[i].container,
            y: this.QUESTION_PLATFORM_Y,
            alpha: 1,
            duration: 400,
            delay: 200 + i * 100,
            ease: 'Back.easeOut'
        });
    }
  }

  handleAnswer(index) {
    if (this.gameState !== 'QUESTION') return;

    const q = this.questions[this.currentQuestion];
    const isCorrect = index === q.correct;
    const plat = this.answerPlatforms[index];

    if (isCorrect) {
      this.score++;
      window.gameSound.playCorrect();
      
      this.scoreText.setText(`Score: ${this.score} / ${this.totalQuestions}`);
      this.tweens.add({
          targets: this.scoreText,
          scale: 1.5,
          yoyo: true,
          duration: 200,
          ease: 'Power2'
      });

      plat.image.setTexture('platformGreen');
      plat.image.setTint(0xffffff);
      plat.container.setScale(1.1);

      this.gameState = 'CORRECT';
      
      this.sparkleEmitter.emitParticleAt(plat.container.x, plat.container.y, 30);

      this.time.delayedCall(700, () => {
        this.hideQuestionUI();
        this.performJump();
      });
    } else {
      window.gameSound.playWrong();
      plat.image.setTexture('platformRed');
      plat.image.setTint(0xffffff);
      this.answerTexts[index].setColor('#ffdddd');

      this.hintText.setText(q.hint).setVisible(true);
      this.hintText.scale = 0;
      this.tweens.add({ targets: this.hintText, scale: 1, duration: 300, ease: 'Back.easeOut' });

      this.cameras.main.shake(300, 0.005);
      this.tweens.add({
        targets: this.charContainer,
        x: this.charContainer.x - 8,
        duration: 50,
        yoyo: true,
        repeat: 3
      });

      const qIdx = this.currentQuestion;
      this.time.delayedCall(1500, () => {
        if (this.currentQuestion === qIdx && this.gameState === 'QUESTION') {
          plat.image.setTexture('platform');
          plat.image.clearTint();
          this.answerTexts[index].setColor('#ffffff');
          this.hintText.setVisible(false);
          plat.container.setScale(1);
        }
      });
    }
  }

  hideQuestionUI() {
    this.tweens.add({
        targets: [this.promptSign, this.promptText, this.hintText],
        alpha: 0,
        duration: 200,
        ease: 'Power2',
        onComplete: () => {
            this.promptSign.setVisible(false);
            this.promptText.setVisible(false);
            this.hintText.setVisible(false);
        }
    });

    for (let i = 0; i < 3; i++) {
        this.tweens.killTweensOf(this.answerPlatforms[i].container);
        this.tweens.add({
            targets: this.answerPlatforms[i].container,
            alpha: 0,
            scale: 1,
            y: this.QUESTION_PLATFORM_Y - 20,
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                this.answerPlatforms[i].container.setVisible(false);
                this.answerPlatforms[i].container.setScale(1);
                this.answerPlatforms[i].container.setAlpha(0);
            }
        });
    }

    this.time.delayedCall(300, () => {
        for (let i = 0; i < 3; i++) {
            this.answerPlatforms[i].container.setVisible(false);
            this.answerPlatforms[i].container.setAlpha(0);
            this.answerPlatforms[i].container.setScale(1);
        }
        this.promptSign.setVisible(false);
        this.promptText.setVisible(false);
        this.hintText.setVisible(false);
    });
  }

  performJump() {
    this.isJumping = true;
    this.gameState = 'JUMPING';
    this.charSprite.play('jump');
    window.gameSound.playJump();

    const startX = this.charContainer.x;
    const startY = this.charContainer.y;
    const jumpHeight = 160;
    const jumpDistance = this.GAP_WIDTH + 75;

    this.tweens.add({
        targets: this.charContainer,
        angle: 15,
        duration: 400,
        yoyo: true,
        ease: 'Sine.easeInOut'
    });
    
    this.tweens.add({
        targets: this.charShadow,
        scale: 0.3,
        alpha: 0.1,
        duration: 400,
        yoyo: true,
        ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: this.charContainer,
      x: startX + jumpDistance,
      duration: 800,
      ease: 'Linear',
      onUpdate: () => {
        const progress = (this.charContainer.x - startX) / jumpDistance;
        const arc = -4 * jumpHeight * progress * (progress - 1);
        this.charContainer.y = startY + arc;
      },
      onComplete: () => {
        this.isJumping = false;
        this.charContainer.y = this.GROUND_Y - 48;
        this.charContainer.angle = 0;
        window.gameSound.playLand();

        this.dustEmitter.emitParticleAt(this.charContainer.x, this.charContainer.y + 30, 10);

        if (this.currentQuestion >= this.totalQuestions - 1) {
          this.time.delayedCall(500, () => {
            this.scene.start('SuccessScene', {
              score: this.score,
              total: this.totalQuestions
            });
          });
        } else {
          this.gameState = 'RUNNING';
          this.startWalking();
          this.arrow.setAlpha(0.8);
        }
      }
    });
  }
}
