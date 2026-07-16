window.addEventListener('load', () => {
  // Pass actual class references so Phaser can instantiate them correctly.
  // config.js stores string names; by the time window.load fires, all scene
  // classes are defined globally (loaded as plain <script> tags before this file).
  GAME_CONFIG.scene = [BootScene, TitleScene, LevelSelectScene, GameScene, SuccessScene];
  const game = new Phaser.Game(GAME_CONFIG);
});
