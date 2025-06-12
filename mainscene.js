import Player from './classes/player.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.playerLife = 100;
    this.gameStarted = false;
  }

  preload() {
    // Sprites padrão
    this.load.spritesheet('idle', './img/idle.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('run', './img/run.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('jump', './img/jump.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('idleLeft', './img/idleLeft.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('runLeft', './img/runLeft.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('jumpLeft', './img/jumpLeft.png', { frameWidth: 256, frameHeight: 256 });

    // Sprites de combate
    this.load.spritesheet('overpunch', './img/overpunch.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('overpunchLeft', './img/overpunch.left.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('punch', './img/punch.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('punchLeft', './img/punch.left.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('cross', './img/cross.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('crossLeft', './img/cross.left.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('roll', './img/roll.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('rollLeft', './img/roll.left.png', { frameWidth: 256, frameHeight: 256 });

    // Imagem para a tela inicial
    this.load.image('devilsTower', './img/devilsTower.png');
  }

  create() {
    // --- HUD E BARRA DE VIDA ---
    this.hudBg = this.add.rectangle(512, 288, 1024, 576, 0x000000, 1).setDepth(-1);

    this.lifeBarMaxWidth = 400;
    this.lifeBarHeight = 32;
    this.lifeBarX = 20;
    this.lifeBarY = 20;

    this.lifeBarBgGfx = this.add.graphics().setVisible(false);
    this.lifeBarBgGfx.fillStyle(0x222222, 1);
    this.lifeBarBgGfx.fillRect(this.lifeBarX - 2, this.lifeBarY - 2, this.lifeBarMaxWidth + 4, this.lifeBarHeight + 4);
    this.lifeBarBgGfx.lineStyle(4, 0xff0000, 1);
    this.lifeBarBgGfx.strokeRect(this.lifeBarX - 2, this.lifeBarY - 2, this.lifeBarMaxWidth + 4, this.lifeBarHeight + 4);

    this.lifeBarGfx = this.add.graphics().setVisible(false);

    this.lifeText = this.add.text(
      this.lifeBarX + this.lifeBarMaxWidth / 2,
      this.lifeBarY + this.lifeBarHeight / 2,
      '100',
      {
        fontFamily: 'Pixel Emulator',
        fontSize: '22px',
        color: '#fff',
        align: 'center'
      }
    ).setOrigin(0.5).setVisible(false);

    // ----------- TELA 1: IMAGEM + INICIAR JOGO -----------
    this.logoImg = this.add.image(512, 250, 'devilsTower').setDisplaySize(220, 220);

    this.startGameButton = this.add.rectangle(512, 410, 220, 56)
      .setStrokeStyle(4, 0xff0000)
      .setFillStyle(0x000000, 1)
      .setInteractive({ useHandCursor: true });
    this.startGameButtonText = this.add.text(512, 410, 'Iniciar Jogo', {
      fontFamily: 'Pixel Emulator',
      fontSize: '20px',
      fill: '#ff0000'
    }).setOrigin(0.5);

    // ----------- TELA 2: CONTROLES -----------
    this.startPanel = this.add.rectangle(512, 288, 420, 260, 0x000000, 0.85).setVisible(false);
    this.startText = this.add.text(512, 220,
      'Tower of Word\n\nControles:\n- Movimento: Setas ou W/A/D\n- Pular: Espaço ou W/Seta Cima\n- Ataque: J\n- Roll: Shift\n\nClique em "Iniciar" para jogar!',
      {
        fontFamily: 'Pixel Emulator',
        fontSize: '20px',
        fill: '#fff',
        align: 'center'
      }
    ).setOrigin(0.5).setVisible(false);

    this.startButton = this.add.rectangle(512, 370, 160, 48)
      .setStrokeStyle(4, 0xff0000)
      .setFillStyle(0x000000, 1)
      .setInteractive({ useHandCursor: true }).setVisible(false);
    this.startButtonText = this.add.text(512, 370, 'Iniciar', {
      fontFamily: 'Pixel Emulator',
      fontSize: '24px',
      fill: '#ff0000'
    }).setOrigin(0.5).setVisible(false);

    this.startGameButton.on('pointerdown', () => {
      this.logoImg.setVisible(false);
      this.startGameButton.setVisible(false);
      this.startGameButtonText.setVisible(false);

      this.startPanel.setVisible(true);
      this.startText.setVisible(true);
      this.startButton.setVisible(true);
      this.startButtonText.setVisible(true);
    });

    this.startButton.on('pointerdown', () => {
      this.startPanel.setVisible(false);
      this.startText.setVisible(false);
      this.startButton.setVisible(false);
      this.startButtonText.setVisible(false);
      this.hudBg.setVisible(false);
      this.gameStarted = true;
      this.player.setActive(true).setVisible(true);

      this.lifeBarBgGfx.setVisible(true);
      this.lifeBarGfx.setVisible(true);
      this.lifeText.setVisible(true);
    });

    // --- PLAYER ---
    this.player = new Player(this, 100, 100);
    this.player.setActive(false).setVisible(false);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D');

    this.input.keyboard.on('keydown-J', () => {
      if (!this.gameStarted) return;
      this.player.queueAttack();
      if (!this.player.isAttacking && !this.player.isRolling) {
        this.player.startAttack();
      }
    });

    this.input.keyboard.on('keydown-SHIFT', () => {
      if (!this.gameStarted) return;
      this.player.startRoll();
    });

    this.jumptime = 0;
  }

  update() {
    if (!this.gameStarted) return;

    const keys = {
      left: this.cursors.left.isDown || this.keys.A.isDown,
      right: this.cursors.right.isDown || this.keys.D.isDown,
      jump: this.cursors.up.isDown || this.keys.W.isDown || this.cursors.space.isDown
    };

    this.player.update(keys);

    // Atualiza barra de vida pixel art
    this.lifeBarGfx.clear();
    const hpPercent = Phaser.Math.Clamp(this.playerLife / 100, 0, 1);
    for (let i = 0; i < this.lifeBarMaxWidth; i += 16) {
      const barWidth = Math.min(16, this.lifeBarMaxWidth - i);
      if (i < this.lifeBarMaxWidth * hpPercent) {
        this.lifeBarGfx.fillStyle(0xff0000, 1);
        this.lifeBarGfx.fillRect(this.lifeBarX + i, this.lifeBarY, barWidth, this.lifeBarHeight);
        this.lifeBarGfx.fillStyle(0xcc0000, 1);
        this.lifeBarGfx.fillRect(this.lifeBarX + i, this.lifeBarY, barWidth / 2, this.lifeBarHeight);
      }
    }
    this.lifeText.setText(Math.round(this.playerLife));
    this.lifeText.x = this.lifeBarX + (this.lifeBarMaxWidth / 2);
  }
}