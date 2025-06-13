export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) { // código feito pelo Samuel
    super(scene, x, y, 'idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setScale(1);

    // Ajuste do corpo de colisão para reduzir a área de transparência
    // Exemplo: se seu sprite tem 256x256, mas o personagem ocupa 64x128 centralizado:
    this.body.setSize(64, 128).setOffset(96, 128);
    // Ajuste os valores acima conforme necessário para encaixar melhor no seu personagem

    this.jump = 2;
    this.speed = 600;
    this.jumpForce = 600;
    this.lastDirection = 'right';
    this.jumpPressed = false;

    this.isAttacking = false;
    this.isRolling = false;

    // Controle de combo
    this.comboStep = 0;
    this.comboQueued = false;

    // Animações padrão e de combate (cria só se não existir)
    if (!scene.anims.exists('idle')) {
      scene.anims.create({
        key: 'idle',
        frames: scene.anims.generateFrameNumbers('idle', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
      });
    }
    if (!scene.anims.exists('run')) {
      scene.anims.create({
        key: 'run',
        frames: scene.anims.generateFrameNumbers('run', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
    }
    if (!scene.anims.exists('jump')) {
      scene.anims.create({
        key: 'jump',
        frames: scene.anims.generateFrameNumbers('jump', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: 0
      });
    }
    if (!scene.anims.exists('idleLeft')) {
      scene.anims.create({
        key: 'idleLeft',
        frames: scene.anims.generateFrameNumbers('idleLeft', { start: 0, end: 3 }),
        frameRate: 4,
        repeat: -1
      });
    }
    if (!scene.anims.exists('runLeft')) {
      scene.anims.create({
        key: 'runLeft',
        frames: scene.anims.generateFrameNumbers('runLeft', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: -1
      });
    }
    if (!scene.anims.exists('jumpLeft')) {
      scene.anims.create({
        key: 'jumpLeft',
        frames: scene.anims.generateFrameNumbers('jumpLeft', { start: 0, end: 5 }),
        frameRate: 6,
        repeat: 0
      });
    }
    if (!scene.anims.exists('roll')) {
      scene.anims.create({
        key: 'roll',
        frames: scene.anims.generateFrameNumbers('roll', { start: 0, end: 6 }),
        frameRate: 12,
        repeat: 0
      });
    }
    if (!scene.anims.exists('rollLeft')) {
      scene.anims.create({
        key: 'rollLeft',
        frames: scene.anims.generateFrameNumbers('rollLeft', { start: 0, end: 6 }),
        frameRate: 12,
        repeat: 0
      });
    }
    if (!scene.anims.exists('punch')) {
      scene.anims.create({
        key: 'punch',
        frames: scene.anims.generateFrameNumbers('punch', { start: 0, end: 7 }),
        frameRate: 14,
        repeat: 0
      });
    }
    if (!scene.anims.exists('punchLeft')) {
      scene.anims.create({
        key: 'punchLeft',
        frames: scene.anims.generateFrameNumbers('punchLeft', { start: 0, end: 7 }),
        frameRate: 14,
        repeat: 0
      });
    }
    if (!scene.anims.exists('overpunch')) {
      scene.anims.create({
        key: 'overpunch',
        frames: scene.anims.generateFrameNumbers('overpunch', { start: 0, end: 15 }),
        frameRate: 16,
        repeat: 0
      });
    }
    if (!scene.anims.exists('overpunchLeft')) {
      scene.anims.create({
        key: 'overpunchLeft',
        frames: scene.anims.generateFrameNumbers('overpunchLeft', { start: 0, end: 15 }),
        frameRate: 16,
        repeat: 0
      });
    }
    if (!scene.anims.exists('cross')) {
      scene.anims.create({
        key: 'cross',
        frames: scene.anims.generateFrameNumbers('cross', { start: 0, end: 5 }),
        frameRate: 12,
        repeat: 0
      });
    }
    if (!scene.anims.exists('crossLeft')) {
      scene.anims.create({
        key: 'crossLeft',
        frames: scene.anims.generateFrameNumbers('crossLeft', { start: 0, end: 5 }),
        frameRate: 12,
        repeat: 0
      });
    }

    this.play('idle');
  }

  queueAttack() {
    if (this.isRolling) return;
    this.comboQueued = true;
  }

  startAttack() {
  if (this.isAttacking || this.isRolling) return;

  // Cancela o timer anterior, se existir
  if (this.comboResetTimer) {
    this.comboResetTimer.remove(false);
  }

  // Define o tempo máximo entre ataques do combo (em ms)
  const comboTimeout = 600;

  // Inicia um novo timer para resetar o combo se demorar demais
  this.comboResetTimer = this.scene.time.delayedCall(comboTimeout, () => {
    this.comboStep = 0;
  });

  // Punch 1
  if (this.comboStep === 0) {
    this.comboStep = 1;
    this.isAttacking = true;
    this.play(this.lastDirection === 'right' ? 'punch' : 'punchLeft', true);
    this.scene.time.delayedCall(350, () => {
      this.isAttacking = false;
    });
  }
  // Punch 2
  else if (this.comboStep === 1) {
    this.comboStep = 2;
    this.isAttacking = true;
    this.play(this.lastDirection === 'right' ? 'punch' : 'punchLeft', true);
    this.scene.time.delayedCall(350, () => {
      this.isAttacking = false;
    });
  }
  // Cross
  else if (this.comboStep === 2) {
    this.comboStep = 3;
    this.isAttacking = true;
    this.play(this.lastDirection === 'right' ? 'cross' : 'crossLeft', true);
    this.scene.time.delayedCall(450, () => {
      this.isAttacking = false;
    });
  }
  // Overpunch
  else if (this.comboStep === 3) {
    this.comboStep = 0;
    this.isAttacking = true;
    this.play(this.lastDirection === 'right' ? 'overpunch' : 'overpunchLeft', true);
    this.scene.time.delayedCall(600, () => {
      this.isAttacking = false;
    });
  }
}

  startRoll() {
    if (this.isRolling || this.isAttacking) return;
    this.isRolling = true;
    this.play(this.lastDirection === 'right' ? 'roll' : 'rollLeft', true);

    const rollSpeed = 500;
    this.setVelocityX(this.lastDirection === 'right' ? rollSpeed : -rollSpeed);

    this.body.checkCollision.none = true;
    this.scene.time.delayedCall(400, () => {
      this.body.checkCollision.none = false;
      this.isRolling = false;
    });
  }

  update(keys) {
    if (this.isAttacking || this.isRolling) return;

    // Reset de pulo ao tocar o chão
    if (this.body.blocked.down) {
      this.jump = 2;
    }

    // Pulo duplo com impulso lateral
    if (keys.jump && this.jump > 0 && !this.jumpPressed) {
      this.setVelocityY(-this.jumpForce);
      if (keys.right) {
        this.setVelocityX(this.speed * 0.8);
        this.lastDirection = 'right';
      } else if (keys.left) {
        this.setVelocityX(-this.speed * 0.8);
        this.lastDirection = 'left';
      }
      this.jump--;
      this.jumpPressed = true;
    }
    if (!keys.jump) this.jumpPressed = false;

    // Movimentação lateral SEMPRE (inclusive no ar)
    if (keys.right) {
      this.setVelocityX(this.speed);
      this.lastDirection = 'right';
    } else if (keys.left) {
      this.setVelocityX(-this.speed);
      this.lastDirection = 'left';
    } else {
      this.setVelocityX(0);
    }

    // Controle de animação
    if (!this.body.blocked.down) {
      this.play(this.lastDirection === 'right' ? 'jump' : 'jumpLeft', true);
    } else if (keys.right) {
      this.play('run', true);
    } else if (keys.left) {
      this.play('runLeft', true);
    } else {
      this.play(this.lastDirection === 'right' ? 'idle' : 'idleLeft', true);
    }
  }
}