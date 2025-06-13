import MainScene from './mainscene.js';

const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 576,
  backgroundColor: '#ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1500 },
    }
  },
  scene: [MainScene]
};

new Phaser.Game(config);
