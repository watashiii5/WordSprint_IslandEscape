const GAME_CONFIG = {
  type: Phaser.CANVAS,
  width: 960,
  height: 540,
  parent: 'game-container',
  backgroundColor: '#87CEEB',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 980 },
      debug: false
    }
  },
  scene: ['BootScene', 'TitleScene', 'GameScene', 'SuccessScene']
};