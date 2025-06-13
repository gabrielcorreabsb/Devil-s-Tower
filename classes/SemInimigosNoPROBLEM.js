export default class SemInimigosNoPROBLEM {
    constructor(scene) {
        this.scene = scene;
        this.setupLevel(scene.currentLevel);
    }

    // Configura as regras com base no nível atual
    setupLevel(level) {
        console.log(`Configurando mecânicas para o nível ${level}`);

        if (level === 1) { // regra para a fase 1
            this.damageEventsAvailable = 5;
            this.requiredAttacks = Phaser.Math.Between(10, 25); // Sorteia o nº de ataques necessários
            this.currentAttacks = 0;
            console.log(`Para passar de fase, aperte J ${this.requiredAttacks} vezes.`);

        }
        if (level === 2) { // regra para a fase 2
            this.damageEventsAvailable = 3;
            this.requiredAttacks = Phaser.Math.Between(5, 20); // Sorteia o nº de ataques necessários
            this.currentAttacks = 0;
            console.log(`Para passar de fase, aperte J ${this.requiredAttacks} vezes.`);


        }
        if (level === 3) { // regra para a fase 3
            this.damageEventsAvailable = 1;
            this.requiredAttacks = Phaser.Math.Between(1, 15); // Sorteia o nº de ataques necessários
            this.currentAttacks = 0;
            console.log(`Para passar de fase, aperte J ${this.requiredAttacks} vezes.`);


        } else if (level === 4) {
            // Regras para a Fase do Chefe
            this.damageEventsAvailable = 2;
            this.requiredJumps = Phaser.Math.Between(5, 17);
            this.requiredAttacks = Phaser.Math.Between(5, 20);
            this.currentJumps = 0;
            this.currentAttacks = 0;
            console.log(`Para derrotar o chefe: Pule ${this.requiredJumps} vezes e ataque ${this.requiredAttacks} vezes.`);
        }
    }

    // Chamado quando o jogador toca em um gatilho de dano
    triggerDamage() {
        if (this.damageEventsAvailable <= 0) {
            console.log("Não há mais eventos de dano disponíveis neste nível.");
            return;
        }

        this.damageEventsAvailable--;

        let damagePercent = 0;
        if (this.scene.currentLevel <= 3) {
            // Dano de 0 a 20% nas fases normais
            damagePercent = Phaser.Math.FloatBetween(0, 0.20);
        } else {
            // 50% de chance de tomar 0 ou 50% de dano no chefe
            damagePercent = (Phaser.Math.Between(0, 1) === 0) ? 0 : 0.50;
        }

        const damageAmount = 100 * damagePercent;
        this.scene.playerLife -= damageAmount;
        if (this.scene.playerLife < 0) this.scene.playerLife = 0;

        console.log(`Dano recebido: ${damageAmount.toFixed(0)}%. Vida restante: ${this.scene.playerLife.toFixed(0)}`);

        // Adiciona um efeito visual de dano ao jogador
        this.scene.player.setTint(0xff0000);
        this.scene.time.delayedCall(200, () => {
            this.scene.player.clearTint();
        });
    }

    // Chamado toda vez que a tecla de ataque 'J' é pressionada
    recordAttack() {
        if (this.scene.currentLevel === 4) { // Lógica do Chefe
            this.currentAttacks++;
            console.log(`Ataques no chefe: ${this.currentAttacks} / ${this.requiredAttacks}`);
            this.checkBossWinCondition();
        } else { // Lógica das Fases Normais
            this.currentAttacks++;
            console.log(`Ataques contados: ${this.currentAttacks} / ${this.requiredAttacks}`);
            if (this.currentAttacks >= this.requiredAttacks) {
                console.log("Requisito de ataques cumprido!");
                // Usa um gatilho falso para passar de fase, já que não temos mais porta
                this.scene.nextLevel(null, {body: {enable: false}});
            }
        }
    }

    // Chamado toda vez que o jogador pula (apenas na fase do chefe)
    recordJump() {
        if (this.scene.currentLevel !== 4) return;

        this.currentJumps++;
        console.log(`Pulos no chefe: ${this.currentJumps} / ${this.requiredJumps}`);
        this.checkBossWinCondition();
    }

    // Verifica se o jogador cumpriu os requisitos para vencer o chefe
    checkBossWinCondition() {
        if (this.currentJumps >= this.requiredJumps && this.currentAttacks >= this.requiredAttacks) {
            console.log("Chefe derrotado!");
            this.scene.nextLevel(null, {body: {enable: false}}); // Passa para a tela de vitória
        }
    }
}
