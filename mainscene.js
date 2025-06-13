import Player from './classes/player.js';
// Importa a nova classe de QuizManager, se você ainda for usar o Quiz. Se não, pode remover.
import QuizManager from './QuizManager.js';
// Importa a nova classe de mecânicas de jogo
import SemInimigosNoPROBLEM from './classes/SemInimigosNoPROBLEM.js';

export default class MainScene extends Phaser.Scene { // código feito pelo Samuel e corrigido/alterado e incluído pelo Gabriel
    constructor() {
        super('MainScene');
        this.playerLife = 100;
        this.gameStarted = false;
        this.quizManager = null;
        this.mechanicsManager = null; // Para a nova classe
        this.currentLevel = 1;
        this.isFirstLoad = true; // Nova variável para rastrear o primeiro carregamento
    }

    init(data) {
        if (data.level) {
            this.currentLevel = data.level;
        }
        // Preservar ou redefinir estados, se necessário
        // CORREÇÃO: As duas linhas abaixo garantem que o estado do jogo seja corretamente
        // gerenciado entre os reinícios de cena.
        this.gameStarted = data.gameStarted || false;
        this.isFirstLoad = !this.gameStarted;

        if (data.playerLife !== undefined) {
            this.playerLife = data.playerLife;
        } else {
            this.playerLife = 100; // Garante que a vida reinicie se não for passada
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
        this.load.spritesheet('idle', './img/idle.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('run', './img/run.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('jump', './img/jump.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('idleLeft', './img/idleLeft.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('runLeft', './img/runLeft.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('jumpLeft', './img/jumpLeft.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('overpunch', './img/overpunch.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('overpunchLeft', './img/overpunch.left.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('punch', './img/punch.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('punchLeft', './img/punch.left.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('cross', './img/cross.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('crossLeft', './img/cross.left.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('roll', './img/roll.png', {frameWidth: 256, frameHeight: 256});
        this.load.spritesheet('rollLeft', './img/roll.left.png', {frameWidth: 256, frameHeight: 256});
        this.load.image('devilsTower', './img/devilsTower.png');
    }

    create() {
        let map;

        this.player = new Player(this, 150, 450);
        this.player.setActive(false).setVisible(false).setDepth(10);

        // Cria uma instância do novo gerenciador de mecânicas
        this.mechanicsManager = new SemInimigosNoPROBLEM(this);

        console.log(`Criando nível ${this.currentLevel}`);

        if (this.currentLevel === 1) { //Controla a parte 1 (Entrada)
            map = this.make.tilemap({key: 'mapa_fase1'});
            const tilesetEntrada = map.addTilesetImage('entrada_castelo', 'tiles_fase1');
            map.createLayer('paredes', tilesetEntrada, 0, 0);
            const groundLayer = map.createLayer('chao', tilesetEntrada, 0, 0);
            groundLayer.setCollisionByExclusion([-1]);
            this.physics.add.collider(this.player, groundLayer);

        } else if (this.currentLevel === 2) { //Controla a parte 2 (Biblioteca)
            map = this.make.tilemap({key: 'mapa_fase2'});
            const tilesetFundo = map.addTilesetImage('fase2_fundo', 'fase2_fundo_tiles');
            const tilesetItens = map.addTilesetImage('fase2_ground', 'fase2_itens_tiles');
            map.createLayer('parede', tilesetFundo, 0, 0);
            map.createLayer('chao', [tilesetFundo, tilesetItens], 0, 0);
            const mesasLayer = map.createLayer('mesas', [tilesetFundo, tilesetItens], 0, 0);
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

        } else if (this.currentLevel === 3) { //Controla a parte 3 (Penúltimo Andar antes de chegar no andar do Diabo)
            map = this.make.tilemap({key: 'mapa_fase3'});
            const tilesetFundo = map.addTilesetImage('fundo_fase3', 'fase3_fundo_tiles');
            const tilesetChao = map.addTilesetImage('chao', 'fase3_chao_tiles');
            map.createLayer('parede', tilesetFundo, 0, 0);
            const groundLayer = map.createLayer('chao', [tilesetChao], 0, 0);
            groundLayer.setCollisionByExclusion([2]);
            this.physics.add.collider(this.player, groundLayer);

        } else if (this.currentLevel === 4) { //Controla a parte 4 (Boss Fight ou era para ser)
            map = this.make.tilemap({key: 'mapa_fase4_boss'});
            const tilesetBoss = map.addTilesetImage('chao_boss', 'fase3_fundo_tiles');
            if (tilesetBoss) {
                map.createLayer('parede', tilesetBoss, 0, 0);
                const groundLayer4 = map.createLayer('chao', tilesetBoss, 0, 0);
                if (groundLayer4) {
                    groundLayer4.setCollisionByExclusion([2]);
                    this.physics.add.collider(this.player, groundLayer4);
                }
            } else {
                console.error("ERRO: O mapa 'mapa_fase4_boss' não tem um tileset chamado 'chao_boss' dentro dele. Verifique o nome no Tiled.");
            }
            console.log("Bem-vindo à fase do chefe!");
        }

        // LÓGICA PARA OS GATILHOS DE DANO
        const CHANCE_DE_DANO = 25; // 25% de chance de tomar dano a cada verificação
        const INTERVALO_VERIFICACAO = 3000; // Verifica a cada 3 segundos (3000 ms)

        // Cria um evento de tempo que se repete para sempre
        this.damageTimer = this.time.addEvent({
            delay: INTERVALO_VERIFICACAO,
            callback: this.attemptRandomDamage, // Função que será chamada a cada 3s
            callbackScope: this,
            loop: true
        });

        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

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
            {fontFamily: 'Pixel Emulator', fontSize: '22px', color: '#fff', align: 'center'}
        ).setOrigin(0.5).setVisible(false).setDepth(hudDepth);

        // Exibir menu inicial apenas no primeiro carregamento, até então não havia mudado a lógica e era carregado em todas as mudanças de mapa
        if (this.isFirstLoad) {
            const hudBg = this.add.rectangle(512, 288, 1024, 576, 0x000000, 1).setDepth(20);

            // --- TELA DE INTRODUÇÃO (NOVO) ---
            const storyTextContent = `Após roubar o Diabo, o cavaleiro Towerguy é lançado em uma torre amaldiçoada como punição. Para sobreviver e escapar do inferno, ele precisa subir. O problema? Todos os inimigos na torre são completamente invisíveis. Lute contra o que você não pode ver ou perca sua alma para sempre.`;

            const storyText = this.add.text(512, 260, storyTextContent, {
                fontFamily: 'Pixel Emulator', fontSize: '18px', fill: '#fff', align: 'center',
                wordWrap: {width: 800}
            }).setOrigin(0.5).setDepth(hudDepth);

            const continueButton = this.add.rectangle(512, 480, 220, 56).setStrokeStyle(4, 0xff0000).setFillStyle(0x000000, 1).setInteractive({useHandCursor: true}).setDepth(hudDepth);
            const continueButtonText = this.add.text(512, 480, 'Continuar', {
                fontFamily: 'Pixel Emulator',
                fontSize: '20px',
                fill: '#ff0000'
            }).setOrigin(0.5).setDepth(hudDepth);

            // --- ELEMENTOS DO MENU PRINCIPAL (INICIAM INVISÍVEIS) ---
            const logoImg = this.add.image(512, 250, 'devilsTower').setDisplaySize(220, 220).setDepth(hudDepth).setVisible(false);
            const startGameButton = this.add.rectangle(512, 410, 220, 56).setStrokeStyle(4, 0xff0000).setFillStyle(0x000000, 1).setInteractive({useHandCursor: true}).setDepth(hudDepth).setVisible(false);
            const startGameButtonText = this.add.text(512, 410, 'Iniciar Jogo', {
                fontFamily: 'Pixel Emulator',
                fontSize: '20px',
                fill: '#ff0000'
            }).setOrigin(0.5).setDepth(hudDepth).setVisible(false);
            const startPanel = this.add.rectangle(512, 288, 420, 260, 0x000000, 0.85).setVisible(false).setDepth(hudDepth);
            const startText = this.add.text(512, 220, 'Tower of Word\n\nControles:\n- Movimento: Setas ou W/A/D\n- Pular: Espaço ou W/Seta Cima\n- Ataque: J\n- Roll: Shift\n\nClique em "Iniciar" para jogar!', {
                fontFamily: 'Pixel Emulator',
                fontSize: '20px',
                fill: '#fff',
                align: 'center'
            }).setOrigin(0.5).setVisible(false).setDepth(hudDepth);
            const startButton = this.add.rectangle(512, 370, 160, 48).setStrokeStyle(4, 0xff0000).setFillStyle(0x000000, 1).setInteractive({useHandCursor: true}).setVisible(false).setDepth(hudDepth);
            const startButtonText = this.add.text(512, 370, 'Iniciar', {
                fontFamily: 'Pixel Emulator',
                fontSize: '24px',
                fill: '#ff0000'
            }).setOrigin(0.5).setVisible(false).setDepth(hudDepth);

            // LÓGICA DE TRANSIÇÃO ENTRE MENUS
            continueButton.on('pointerdown', () => {
                storyText.setVisible(false);
                continueButton.setVisible(false);
                continueButtonText.setVisible(false);

                logoImg.setVisible(true);
                startGameButton.setVisible(true);
                startGameButtonText.setVisible(true);
            });

            startGameButton.on('pointerdown', () => {
                logoImg.setVisible(false);
                startGameButton.setVisible(false);
                startGameButtonText.setVisible(false);
                startPanel.setVisible(true);
                startText.setVisible(true);
                startButton.setVisible(true);
                startButtonText.setVisible(true);
            });

            startButton.on('pointerdown', () => {
                startPanel.setVisible(false);
                startText.setVisible(false);
                startButton.setVisible(false);
                startButtonText.setVisible(false);
                hudBg.setVisible(false);
                this.gameStarted = true;
                this.isFirstLoad = false;
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

        // Liga os eventos de teclado às novas mecânicas
        this.input.keyboard.on('keydown-J', () => {
            if (!this.gameStarted || (this.quizManager && this.quizManager.isActive())) return;
            this.player.queueAttack();
            if (!this.player.isAttacking && !this.player.isRolling) {
                this.player.startAttack();
            }
            if (this.mechanicsManager) this.mechanicsManager.recordAttack();
        });
        this.input.keyboard.on('keydown-SHIFT', () => {
            if (!this.gameStarted) return;
            this.player.startRoll();
        });

        // Adiciona listener para o pulo
        const jumpListener = () => {
            if (!this.gameStarted || (this.quizManager && this.quizManager.isActive())) return;
            if (this.player.body.blocked.down || this.player.jump > 0) { // Garante que só registre pulos válidos
                if (this.mechanicsManager) this.mechanicsManager.recordJump();
            }
        }
        this.input.keyboard.on('keydown-W', jumpListener);
        this.input.keyboard.on('keydown-SPACE', jumpListener);
    }

    handleDamageCollision(player, triggerZone) {
        if (!triggerZone.isTriggered) {
            triggerZone.isTriggered = true;
            this.mechanicsManager.triggerDamage();
            // Torna o gatilho inativo para não acionar de novo
            triggerZone.body.enable = false;
        }
    }

    attemptRandomDamage() { // randomzia o dano
        // Não faz nada se o jogo ainda não começou, o jogador está morto ou o quiz está ativo
        if (!this.gameStarted || this.playerLife <= 0 || (this.quizManager && this.quizManager.isActive())) {
            return;
        }

        // Sorteia um número de 1 a 100
        const diceRoll = Phaser.Math.Between(1, 100);
        const CHANCE_DE_DANO = 25; // A mesma chance definida no create()

        console.log(`Verificando dano aleatório... Rolagem do dado: ${diceRoll}`); // quase igual um RPG - Se dado sortear menor ou igual a 25 ele tira o número do dado por dano

        // Se o número sorteado for menor ou igual à chance, o dano ocorre
        if (diceRoll <= CHANCE_DE_DANO) {
            console.log("Falhou no teste de sorte! Recebendo dano.");
            // Chama a mesma função de antes, mas agora por um motivo diferente
            this.mechanicsManager.triggerDamage();
        } else {
            console.log("Sorte! Nenhum dano desta vez.");
        }
    }

    nextLevel() {
        console.log(`Saindo do nível ${this.currentLevel}`);
        this.currentLevel++;

        if (this.currentLevel > 4) {

            this.gameWon();
            return; //
        }

        this.scene.restart({
            level: this.currentLevel,
            gameStarted: true,
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
        // Se a vida do jogador chegar a zero, inicie o processo de fim de jogo.
        if (this.playerLife <= 0) {
            // A verificação 'this.player.active' garante que gameOver() seja chamado apenas uma vez.
            if (this.player.active) {
                this.gameOver();
            }
            return; // Interrompe o loop de atualização aqui, pois o jogo acabou.
        }

        // Pausa a atualização do jogador se o jogo não começou ou se o quiz está ativo.
        if (!this.gameStarted || (this.quizManager && this.quizManager.isActive())) {
            // Mesmo com o jogo pausado, o jogador não deve se mover.
            this.player.setVelocityX(0);
            return;
        }

        // Lógica de controle do jogador
        const keys = {
            left: this.cursors.left.isDown || this.keys.A.isDown,
            right: this.cursors.right.isDown || this.keys.D.isDown,
            jump: this.cursors.up.isDown || this.keys.W.isDown || this.cursors.space.isDown
        };
        this.player.update(keys);

        // Atualização da barra de vida (HUD)
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

    // REMOVIDO: Segundo método update(), que foi mesclado com o primeiro.

    gameOver() {
        console.log("GAME OVER");
        this.player.setActive(false); // Desativa o jogador para impedir mais ações
        this.physics.pause();
        this.player.setTint(0xff0000);
        this.player.anims.stop();

        // Chama a função para mostrar a mensagem e passar um callback para reiniciar o jogo
        this.showEndGameMessage("GAME OVER", () => {
            this.scene.restart({level: 1, gameStarted: false, playerLife: 100});
        });
    }

    // NOVA FUNÇÃO PARA A TELA DE VITÓRIA
    gameWon() {
        console.log("Fim de jogo! O jogador venceu.");
        this.gameStarted = false; // Impede que o update do jogador continue rodando
        this.physics.pause();
        this.player.setActive(false);

        const screenCenterX = this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.height / 2;
        const hudDepth = 100;

        // Adiciona um fundo escurecido para focar na mensagem
        this.add.rectangle(screenCenterX, screenCenterY, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.85)
            .setDepth(hudDepth - 1);

        // --- CRIAÇÃO DO TEXTO DE VITÓRIA ---

        // 1. Título principal, com a fonte grande
        this.add.text(screenCenterX, screenCenterY - 240, 'VOCÊ VENCEU!', {
            fontFamily: 'Pixel Emulator',
            fontSize: '48px', // Fonte grande apenas para o título
            fill: '#00ff00',
            align: 'center'
        }).setOrigin(0.5).setDepth(hudDepth);

        // 2. Corpo do texto da história
        const corpoTexto = 'O último inimigo invisível se desfaz em pó. No topo da torre, não há um portal, mas sim o próprio Diabo, batendo palmas lentamente.\n\n"Você venceu", diz ele com um sorriso cruel. "Está livre."\n\nCom um gesto, Towerguy é transportado de volta ao mundo. Mas a provação deixou uma marca eterna. Seus olhos, forçados a enxergar o que não existe, agora veem o que os outros ignoram: a maldade, a ganância e os demônios que se agarram a cada alma.\n\nEle não escapou do inferno. Ele apenas aprendeu a vê-lo em todos os lugares.';

        this.add.text(screenCenterX, screenCenterY - 80, corpoTexto, {
            fontFamily: 'Pixel Emulator',
            fontSize: '18px', // Fonte menor e legível para parágrafos
            fill: '#ffffff', // Cor branca para diferenciar do título
            align: 'center',
            // A MÁGICA ACONTECE AQUI: Quebra de linha automática
            wordWrap: { width: 850, useAdvancedWrap: true }
        }).setOrigin(0.5).setDepth(hudDepth);

        // 3. Citação de Eclesiastes, com estilo diferente
        const citacao = '"Porque na muita sabedoria há muito enfado; e o que aumenta o conhecimento, aumenta a dor."\n- Eclesiastes 1:18';

        this.add.text(screenCenterX, screenCenterY + 140, citacao, {
            fontFamily: 'Pixel Emulator',
            fontSize: '16px',
            fill: '#cccccc', // Cinza claro, para dar um tom diferente
            align: 'center',
            fontStyle: 'italic', // Itálico para a citação
            wordWrap: { width: 800 }
        }).setOrigin(0.5).setDepth(hudDepth);


        // 4. Botão para reiniciar, posicionado mais para baixo
        const restartButton = this.add.rectangle(screenCenterX, screenCenterY + 240, 280, 56)
            .setStrokeStyle(4, 0x00ff00)
            .setFillStyle(0x000000, 1)
            .setInteractive({ useHandCursor: true })
            .setDepth(hudDepth);

        const restartButtonText = this.add.text(screenCenterX, screenCenterY + 240, 'Jogar Novamente', {
            fontFamily: 'Pixel Emulator',
            fontSize: '20px',
            fill: '#00ff00'
        }).setOrigin(0.5).setDepth(hudDepth);

        // Define a ação do botão
        restartButton.on('pointerdown', () => {
            this.scene.restart({ level: 1, gameStarted: false, playerLife: 100 });
        });
    }

    showEndGameMessage(message, callback) {
        const screenCenterX = this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.height / 2;
        const endText = this.add.text(screenCenterX, screenCenterY, message, {
            fontFamily: 'Pixel Emulator',
            fontSize: '48px',
            fill: '#ff0000',
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        // Aguarda 3 segundos (3000 ms) antes de executar a função de callback (reiniciar o jogo)
        this.time.delayedCall(3000, callback, [], this);
    }
}