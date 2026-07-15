class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.GROUND_Y = 440;
    this.PLATFORM_WIDTH = 64;
    this.GAP_WIDTH = 200;
    this.WALK_SPEED = 150;
    this.QUESTION_PLATFORM_Y = 240;
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
    this.startWalking();
  }

  createBackground() {
    const worldWidth = this.totalQuestions * (this.PLATFORM_WIDTH + this.GAP_WIDTH) + this.WORLD_PADDING * 2;

    // Sky gradient
    const bg = this.add.graphics();
    for (let i = 0; i < 540; i++) {
      const t = i / 540;
      const r = Math.floor(135 + t * 40);
      const g = Math.floor(206 + t * 20);
      const b = Math.floor(235 - t * 30);
      bg.fillStyle(Phaser.Display.Color.GetColor(r, g, b), 1);
      bg.fillRect(0, i, worldWidth, 1);
    }

    // Clouds
    for (let i = 0; i < Math.ceil(worldWidth / 300); i++) {
      const cloud = this.add.image(i * 300 + Phaser.Math.Between(-50, 50), Phaser.Math.Between(40, 140), 'cloud');
      cloud.setAlpha(Phaser.Math.FloatBetween(0.4, 0.8));
      cloud.setScale(Phaser.Math.FloatBetween(0.6, 1.2));
      cloud.setScrollFactor(0.3);
    }

    // Distant mountains
    const mountains = this.add.graphics();
    mountains.fillStyle(0x6b8f71, 0.4);
    for (let x = 0; x < worldWidth; x += 200) {
      const h = Phaser.Math.Between(80, 160);
      mountains.fillTriangle(x, this.GROUND_Y, x + 100, this.GROUND_Y - h, x + 200, this.GROUND_Y);
    }
  }

  createWorld() {
    this.platforms = this.physics.add.staticGroup();
    this.gaps = [];

    const worldWidth = this.totalQuestions * (this.PLATFORM_WIDTH + this.GAP_WIDTH) + this.WORLD_PADDING * 2;

    for (let i = 0; i <= this.totalQuestions; i++) {
      const x = this.WORLD_PADDING + i * (this.PLATFORM_WIDTH + this.GAP_WIDTH);
      const plat = this.platforms.create(x, this.GROUND_Y, 'ground');
      plat.setScale(1, 1).refreshBody();

      if (i < this.totalQuestions) {
        this.gaps.push({
          x: x + this.PLATFORM_WIDTH / 2 + this.GAP_WIDTH / 2,
          questionIndex: i,
          triggered: false
        });
      }
    }

    // Water under gaps
    for (const gap of this.gaps) {
      for (let wx = gap.x - this.GAP_WIDTH / 2; wx < gap.x + this.GAP_WIDTH / 2; wx += 64) {
        this.add.image(wx, this.GROUND_Y + 24, 'water');
      }
    }

    // Decorations
    for (let i = 0; i < this.totalQuestions + 1; i++) {
      const x = this.WORLD_PADDING + i * (this.PLATFORM_WIDTH + this.GAP_WIDTH);
      if (Phaser.Math.Between(0, 1) === 0) {
        this.add.image(x + Phaser.Math.Between(-20, 20), this.GROUND_Y - 30, 'trunk');
        this.add.image(x + Phaser.Math.Between(-20, 20), this.GROUND_Y - 55, 'leaves');
      }
    }
  }

  createCharacter() {
    this.charContainer = this.add.container(this.WORLD_PADDING, this.GROUND_Y - 42);

    this.charHead = this.add.image(0, -18, 'charHead');
    this.charBody = this.add.image(0, 8, 'charBody');
    this.charContainer.add([this.charBody, this.charHead]);

    this.charContainer.setSize(28, 60);
    this.physics.world.enable(this.charContainer);
    this.charContainer.body.setAllowGravity(false);
    this.charContainer.body.setVelocityX(this.WALK_SPEED);
    this.charContainer.body.setCollideWorldBounds(false);

    this.isJumping = false;
    this.walkTween = null;
  }

  createUI() {
    // Score display
    this.scoreText = this.add.text(20, 20, `Score: 0 / ${this.totalQuestions}`, {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setScrollFactor(0).setDepth(100);

    // Question prompt
    this.promptBg = this.add.graphics().setScrollFactor(0).setDepth(90).setVisible(false);
    this.promptBg.fillStyle(0x000000, 0.75);
    this.promptBg.fillRoundedRect(0, 0, 700, 60, 12);

    this.promptText = this.add.text(480, 50, '', {
      fontSize: '22px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      wordWrap: { width: 660 },
      align: 'center'
    }).setScrollFactor(0).setDepth(91).setVisible(false).setOrigin(0.5);

    // Answer platforms
    this.answerPlatforms = [];
    this.answerTexts = [];

    for (let i = 0; i < 3; i++) {
      const x = 280 + i * 200;
      const plat = this.add.image(x, this.QUESTION_PLATFORM_Y, 'platform')
        .setScrollFactor(0)
        .setDepth(90)
        .setVisible(false)
        .setInteractive({ useHandCursor: true });

      plat.on('pointerdown', () => this.handleAnswer(i));
      plat.on('pointerover', () => {
        if (this.gameState === 'QUESTION') plat.setTint(0xcccccc);
      });
      plat.on('pointerout', () => {
        if (this.gameState === 'QUESTION') plat.clearTint();
      });

      const txt = this.add.text(x, this.QUESTION_PLATFORM_Y, '', {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }).setScrollFactor(0).setDepth(91).setVisible(false).setOrigin(0.5);

      this.answerPlatforms.push(plat);
      this.answerTexts.push(txt);
    }

    // Hint text
    this.hintText = this.add.text(480, 310, '', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffeb3b',
      stroke: '#000000',
      strokeThickness: 2,
      wordWrap: { width: 660 },
      align: 'center'
    }).setScrollFactor(0).setDepth(91).setVisible(false).setOrigin(0.5);

    // Arrow hint
    this.arrow = this.add.image(880, this.GROUND_Y - 60, 'arrow')
      .setScrollFactor(0)
      .setDepth(80)
      .setAlpha(0);

    this.tweens.add({
      targets: this.arrow,
      x: 900,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  setupCamera() {
    const worldWidth = this.totalQuestions * (this.PLATFORM_WIDTH + this.GAP_WIDTH) + this.WORLD_PADDING * 2;
    this.cameras.main.setBounds(0, 0, worldWidth, 540);
    this.cameras.main.startFollow(this.charContainer, true, 0.1, 0.1);
  }

  startWalking() {
    this.charContainer.body.setVelocityX(this.WALK_SPEED);
    this.walkTween = this.tweens.add({
      targets: this.charContainer,
      y: this.GROUND_Y - 44,
      duration: 200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  stopWalking() {
    this.charContainer.body.setVelocityX(0);
    if (this.walkTween) {
      this.walkTween.stop();
      this.charContainer.y = this.GROUND_Y - 42;
    }
  }

  update() {
    if (this.gameState !== 'RUNNING') return;

    for (const gap of this.gaps) {
      if (!gap.triggered && Math.abs(this.charContainer.x - gap.x) < 80) {
        gap.triggered = true;
        this.triggerQuestion(gap.questionIndex);
        break;
      }
    }
  }

  triggerQuestion(index) {
    this.currentQuestion = index;
    this.gameState = 'QUESTION';
    this.stopWalking();

    const q = this.questions[index];

    this.promptBg.setVisible(true);
    this.promptText.setText(`${index + 1}. ${q.prompt}`).setVisible(true);

    for (let i = 0; i < 3; i++) {
      this.answerPlatforms[i].setVisible(true).clearTint();
      this.answerTexts[i].setText(q.options[i]).setVisible(true);
    }

    this.hintText.setVisible(false);

    this.tweens.add({
      targets: [this.promptBg, this.promptText, ...this.answerPlatforms, ...this.answerTexts],
      alpha: { from: 0, to: 1 },
      duration: 300,
      ease: 'Power2'
    });
  }

  handleAnswer(index) {
    if (this.gameState !== 'QUESTION') return;

    const q = this.questions[this.currentQuestion];
    const isCorrect = index === q.correct;

    if (isCorrect) {
      this.score++;
      this.scoreText.setText(`Score: ${this.score} / ${this.totalQuestions}`);

      this.answerPlatforms[index].setTexture('platformGreen');
      this.answerPlatforms[index].setTint(0xffffff);

      this.gameState = 'CORRECT';

      this.time.delayedCall(500, () => {
        this.hideQuestionUI();
        this.performJump();
      });
    } else {
      this.answerPlatforms[index].setTexture('platformRed');
      this.answerPlatforms[index].setTint(0xffffff);
      this.answerTexts[index].setColor('#ff6666');

      this.hintText.setText(q.hint).setVisible(true);

      this.tweens.add({
        targets: this.charContainer,
        x: this.charContainer.x - 5,
        duration: 50,
        yoyo: true,
        repeat: 3
      });

      this.time.delayedCall(1200, () => {
        this.answerPlatforms[index].setTexture('platform');
        this.answerPlatforms[index].clearTint();
        this.answerTexts[index].setColor('#ffffff');
        this.hintText.setVisible(false);
      });
    }
  }

  hideQuestionUI() {
    this.promptBg.setVisible(false);
    this.promptText.setVisible(false);
    this.hintText.setVisible(false);

    for (let i = 0; i < 3; i++) {
      this.answerPlatforms[i].setVisible(false).setTexture('platform');
      this.answerTexts[i].setVisible(false).setColor('#ffffff');
    }
  }

  performJump() {
    this.isJumping = true;
    this.gameState = 'JUMPING';

    const startX = this.charContainer.x;
    const startY = this.charContainer.y;
    const jumpHeight = 180;
    const jumpDistance = this.GAP_WIDTH + 80;

    this.tweens.add({
      targets: this.charContainer,
      x: startX + jumpDistance,
      duration: 800,
      ease: 'Power1',
      onUpdate: () => {
        const progress = (this.charContainer.x - startX) / jumpDistance;
        const arc = -4 * jumpHeight * progress * (progress - 1);
        this.charContainer.y = startY + arc;
      },
      onComplete: () => {
        this.isJumping = false;
        this.charContainer.y = this.GROUND_Y - 42;

        if (this.currentQuestion >= this.totalQuestions - 1) {
          this.time.delayedCall(400, () => {
            this.scene.start('SuccessScene', {
              score: this.score,
              total: this.totalQuestions
            });
          });
        } else {
          this.gameState = 'RUNNING';
          this.startWalking();
          this.arrow.setAlpha(0.7);
        }
      }
    });
  }
}