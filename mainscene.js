import Player from './classes/player.js';
import QuizManager from './QuizManager.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.playerLife = 100;
    this.gameStarted = false;
    this.quizManager = null;
    this.currentLevel = 1;
    this.isFirstLoad = true; // Nova variável para rastrear o primeiro carregamento
  }

  init(data) {
    if (data.level) {
      this.currentLevel = data.level;
    }
    // Preservar ou redefinir estados, se necessário
    if (data.gameStarted !== undefined) {
      this.gameStarted = data.gameStarted;
    }
    if (data.playerLife !== undefined) {
      this.playerLife = data.playerLife;
    }
  }

  preload() {
    // Assets da Fase 1
    this.load.image('tiles_fase1', './tiled/assets/entrada_castelo.png');
    this.load.image('porta_saida_tiles', './tiled/assets/porta_saida.png');
    this.load.tilemapTiledJSON('mapa_fase1', './tiled/map1.json');

    // Assets da Fase 2
    this.load.image('fase2_fundo_tiles', './tiled/assets/fase2_fundo.png');
    this.load.image('fase2_itens_tiles', './tiled/assets/fase2_itens.png');
    this.load.tilemapTiledJSON('mapa_fase2', './tiled/map2.json');

    // Assets da Fase 3
    this.load.image('fase3_chao_tiles', './tiled/assets/fase3_chao.png');
    this.load.image('fase3_fundo_tiles', './tiled/assets/fundo_fase3.png');
    this.load.tilemapTiledJSON('mapa_fase3', './tiled/map3.json');

    // Assets da Fase 4
    this.load.tilemapTiledJSON('mapa_fase4_boss', './tiled/map4_boss.json');

    // Assets do Jogador e UI
    this.load.spritesheet('idle', './img/idle.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('run', './img/run.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('jump', './img/jump.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('idleLeft', './img/idleLeft.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('runLeft', './img/runLeft.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('jumpLeft', './img/jumpLeft.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('overpunch', './img/overpunch.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('overpunchLeft', './img/overpunch.left.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('punch', './img/punch.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('punchLeft', './img/punch.left.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('cross', './img/cross.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('crossLeft', './img/cross.left.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('roll', './img/roll.png', { frameWidth: 256, frameHeight: 256 });
    this.load.spritesheet('rollLeft', './img/roll.left.png', { frameWidth: 256, frameHeight: 256 });
    this.load.image('devilsTower', './img/devilsTower.png');
  }

  create() {
    let map;
    const exitGroup = this.physics.add.staticGroup();

    this.player = new Player(this, 150, 450);
    this.player.setActive(false).setVisible(false).setDepth(10);

    console.log(`Criando nível ${this.currentLevel}`);

    if (this.currentLevel === 1) {
      map = this.make.tilemap({ key: 'mapa_fase1' });
      const tilesetEntrada = map.addTilesetImage('entrada_castelo', 'tiles_fase1');
      const tilesetPorta = map.addTilesetImage('saida', 'porta_saida_tiles');

      map.createLayer('paredes', tilesetEntrada, 0, 0);
      const groundLayer = map.createLayer('chao', tilesetEntrada, 0, 0);
      map.createLayer('porta', tilesetPorta, 0, 0);

      groundLayer.setCollisionByExclusion([-1]);
      this.physics.add.collider(this.player, groundLayer);

    } else if (this.currentLevel === 2) {
      map = this.make.tilemap({ key: 'mapa_fase2' });
      const tilesetFundo = map.addTilesetImage('fase2_fundo', 'fase2_fundo_tiles');
      const tilesetItens = map.addTilesetImage('fase2_ground', 'fase2_itens_tiles');
      const tilesetPorta = map.addTilesetImage('saida', 'porta_saida_tiles');

      map.createLayer('parede', tilesetFundo, 0, 0);
      const groundLayer = map.createLayer('chao', [tilesetFundo, tilesetItens, tilesetPorta], 0, 0);
      const mesasLayer = map.createLayer('mesas', [tilesetFundo, tilesetItens], 0, 0);
      map.createLayer('porta', tilesetPorta, 0, 0);

      mesasLayer.setCollisionByExclusion([-1]);
      this.physics.add.collider(this.player, mesasLayer);

      this.quizManager = new QuizManager(this);
      const quizTriggerGroup = this.physics.add.staticGroup();
      const quizTriggerLayer = map.getObjectLayer('fantasma');
      if (quizTriggerLayer) {
        quizTriggerLayer.objects.forEach(obj => {
          quizTriggerGroup.create(obj.x, obj.y, null).setOrigin(0, 0).setDisplaySize(obj.width, obj.height).refreshBody();
        });
        this.physics.add.overlap(this.player, quizTriggerGroup, this.triggerQuiz, null, this);
      }

    } else if (this.currentLevel === 3) {
      map = this.make.tilemap({ key: 'mapa_fase3' });
      const tilesetFundo = map.addTilesetImage('fundo_fase3', 'fase3_fundo_tiles');
      const tilesetChao = map.addTilesetImage('chao', 'fase3_chao_tiles');
      const tilesetPorta = map.addTilesetImage('saida', 'porta_saida_tiles');

      map.createLayer('parede', tilesetFundo, 0, 0);
      const groundLayer = map.createLayer('chao', [tilesetChao, tilesetPorta], 0, 0);
      map.createLayer('porta', tilesetPorta, 0, 0);

      groundLayer.setCollisionByExclusion([2]);
      this.physics.add.collider(this.player, groundLayer);

    } else if (this.currentLevel === 4) {
      map = this.make.tilemap({ key: 'mapa_fase4_boss' });
      const tilesetBoss = map.addTilesetImage('chao_boss', 'fase3_fundo_tiles');

      if (tilesetBoss) {
        map.createLayer('parede', tilesetBoss, 0, 0);
        const groundLayer4 = map.createLayer('chao', tilesetBoss, 0, 0);

        if (groundLayer4) {
          groundLayer4.setCollisionByExclusion([0]);
          this.physics.add.collider(this.player, groundLayer4);
        }
      } else {
        console.error("ERRO: O mapa 'mapa_fase4_boss' não tem um tileset chamado 'chao_boss' dentro dele. Verifique o nome no Tiled.");
      }

      console.log("Bem-vindo à fase do chefe!");
    }

    const exitLayer = map.getObjectLayer('saida');
    if (exitLayer) {
      exitLayer.objects.forEach(exitObject => {
        let exitSprite = exitGroup.create(exitObject.x, exitObject.y, 'porta_saida_tiles')
            .setOrigin(0, 1);
        exitSprite.body.setSize(exitSprite.width * 0.5, exitSprite.height * 0.8);
        exitSprite.body.setOffset(exitSprite.width * 0.25, exitSprite.height * 0.2);
      });
    }

    this.physics.world.bounds.width = map.widthInPixels;
    this.physics.world.bounds.height = map.heightInPixels;
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    this.physics.add.overlap(this.player, exitGroup, this.nextLevel, null, this);

    // --- Menus, HUD e Controles ---
    const hudDepth = 21;
    this.lifeBarMaxWidth = 400;
    this.lifeBarHeight = 32;
    this.lifeBarX = 20;
    this.lifeBarY = 20;
    this.lifeBarBgGfx = this.add.graphics().setVisible(false).setDepth(hudDepth);
    this.lifeBarBgGfx.fillStyle(0x222222, 1);
    this.lifeBarBgGfx.fillRect(this.lifeBarX - 2, this.lifeBarY - 2, this.lifeBarMaxWidth + 4, this.lifeBarHeight + 4);
    this.lifeBarBgGfx.lineStyle(4, 0xff0000, 1);
    this.lifeBarBgGfx.strokeRect(this.lifeBarX - 2, this.lifeBarY - 2, this.lifeBarMaxWidth + 4, this.lifeBarHeight + 4);
    this.lifeBarGfx = this.add.graphics().setVisible(false).setDepth(hudDepth);
    this.lifeText = this.add.text(
        this.lifeBarX + this.lifeBarMaxWidth / 2,
        this.lifeBarY + this.lifeBarHeight / 2,
        `${this.playerLife}`,
        { fontFamily: 'Pixel Emulator', fontSize: '22px', color: '#fff', align: 'center' }
    ).setOrigin(0.5).setVisible(false).setDepth(hudDepth);

    // Exibir menu inicial apenas no primeiro carregamento
    if (this.isFirstLoad) {
      this.hudBg = this.add.rectangle(512, 288, 1024, 576, 0x000000, 1).setDepth(20);
      this.logoImg = this.add.image(512, 250, 'devilsTower').setDisplaySize(220, 220).setDepth(hudDepth);
      this.startGameButton = this.add.rectangle(512, 410, 220, 56)
          .setStrokeStyle(4, 0xff0000)
          .setFillStyle(0x000000, 1)
          .setInteractive({ useHandCursor: true })
          .setDepth(hudDepth);
      this.startGameButtonText = this.add.text(512, 410, 'Iniciar Jogo', {
        fontFamily: 'Pixel Emulator', fontSize: '20px', fill: '#ff0000'
      }).setOrigin(0.5).setDepth(hudDepth);
      this.startPanel = this.add.rectangle(512, 288, 420, 260, 0x000000, 0.85).setVisible(false).setDepth(hudDepth);
      this.startText = this.add.text(512, 220,
          'Tower of Word\n\nControles:\n- Movimento: Setas ou W/A/D\n- Pular: Espaço ou W/Seta Cima\n- Ataque: J\n- Roll: Shift\n\nClique em "Iniciar" para jogar!',
          { fontFamily: 'Pixel Emulator', fontSize: '20px', fill: '#fff', align: 'center' }
      ).setOrigin(0.5).setVisible(false).setDepth(hudDepth);
      this.startButton = this.add.rectangle(512, 370, 160, 48)
          .setStrokeStyle(4, 0xff0000)
          .setFillStyle(0x000000, 1)
          .setInteractive({ useHandCursor: true }).setVisible(false).setDepth(hudDepth);
      this.startButtonText = this.add.text(512, 370, 'Iniciar', {
        fontFamily: 'Pixel Emulator', fontSize: '24px', fill: '#ff0000'
      }).setOrigin(0.5).setVisible(false).setDepth(hudDepth);

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
        this.isFirstLoad = false; // Marcar que o jogo já foi iniciado
        this.player.setActive(true).setVisible(true);
        this.lifeBarBgGfx.setVisible(true);
        this.lifeBarGfx.setVisible(true);
        this.lifeText.setVisible(true);
        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
      });
    } else {
      // Se não for o primeiro carregamento, iniciar o jogo diretamente
      this.gameStarted = true;
      this.player.setActive(true).setVisible(true);
      this.lifeBarBgGfx.setVisible(true);
      this.lifeBarGfx.setVisible(true);
      this.lifeText.setVisible(true);
      this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
    }

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

  nextLevel(player, exitZone) {
    console.log(`Saindo do nível ${this.currentLevel}`);
    exitZone.body.enable = false;
    this.currentLevel++;

    if (this.currentLevel > 4) {
      console.log('Fim de jogo!');
      this.currentLevel = 1;
      this.isFirstLoad = true; // Resetar para mostrar o menu inicial no fim do jogo
    }

    this.scene.restart({
      level: this.currentLevel,
      gameStarted: this.gameStarted,
      playerLife: this.playerLife
    });
  }

  triggerQuiz(player, quizZone) {
    quizZone.body.enable = false;
    if (this.quizManager) {
      this.quizManager.startQuiz();
    }
  }

  update() {
    if (!this.gameStarted || (this.quizManager && this.quizManager.isActive())) {
      return;
    }

    const keys = {
      left: this.cursors.left.isDown || this.keys.A.isDown,
      right: this.cursors.right.isDown || this.keys.D.isDown,
      jump: this.cursors.up.isDown || this.keys.W.isDown || this.cursors.space.isDown
    };
    this.player.update(keys);

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