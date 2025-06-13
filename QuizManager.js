// Easter Egg ativado ao interagir com o objeto do fantasma no Map2.

const questions = [
    {
        question: 'Qual o video-game mais vendido de todos os tempos?',
        answers: ['Nintendo Switch', 'Playstation 2', 'Playstation 4', 'Xbox 360'],
        correctAnswer: 'Playstation 2'
    },
    {
        question: 'Qual foi o game do ano em 2018?',
        answers: ['God of War', 'Celeste', 'Red Dead Redemption 2', 'Marvels Spider-Man'],
        correctAnswer: 'God of War'
    },
    {
        question: 'Qual foi o jogo mais vendido de todos os tempos?',
        answers: ['Grand Theft Auto V', 'GTA: San Andreas', 'Minecraft', 'Skyrim'],
        correctAnswer: 'Minecraft'
    }
];

export default class QuizManager {
    constructor(scene) {
        this.scene = scene;
        this.questions = questions;

        this.container = null;
        this.currentQuestionIndex = 0;
        this.correctAnswersCount = 0;

        this.createQuizInterface();
    }

    isActive() {
        return this.container && this.container.visible;
    }

    createQuizInterface() {
        const screenCenterX = this.scene.cameras.main.width / 2;
        const screenCenterY = this.scene.cameras.main.height / 2;

        this.container = this.scene.add.container(screenCenterX, screenCenterY).setDepth(30).setVisible(false);

        const panel = this.scene.add.rectangle(0, 0, 800, 400, 0x000000, 0.9).setStrokeStyle(4, 0xff0000);
        this.questionText = this.scene.add.text(0, -120, '', {
            fontFamily: 'Pixel Emulator', fontSize: '24px', fill: '#ffffff', align: 'center', wordWrap: { width: 780 }
        }).setOrigin(0.5);

        this.container.add([panel, this.questionText]);

        this.answerButtons = [];
        const positions = [ { x: -185, y: 20 }, { x: 185, y: 20 }, { x: -185, y: 100 }, { x: 185, y: 100 }];

        for (let i = 0; i < 4; i++) {
            const btnContainer = this.scene.add.container(positions[i].x, positions[i].y);
            const btnRect = this.scene.add.rectangle(0, 0, 350, 60, 0x333333).setStrokeStyle(2, 0xff0000).setInteractive({ useHandCursor: true });
            const btnText = this.scene.add.text(0, 0, '', { fontFamily: 'Pixel Emulator', fontSize: '18px', fill: '#ffffff' }).setOrigin(0.5);

            btnContainer.add([btnRect, btnText]);
            this.container.add(btnContainer);

            btnRect.on('pointerdown', () => this.handleAnswerClick(btnText.text));
            this.answerButtons.push(btnText);
        }
    }

    startQuiz() {
        if (this.isActive()) return;

        this.scene.physics.pause();
        if (this.scene.player) {
            this.scene.player.setActive(false);
        }

        this.currentQuestionIndex = 0;
        this.correctAnswersCount = 0;

        this.container.setVisible(true);
        this.displayQuestion();
    }

    endQuiz(success = false) {
        this.container.setVisible(false);
        this.scene.physics.resume();
        if (this.scene.player) {
            this.scene.player.setActive(true);
        }

        if (success) {
            this.scene.currentLevel = 4;
            this.scene.scene.restart({ level: 4 });
        }
    }
    displayQuestion() {
        const currentQ = this.questions[this.currentQuestionIndex];
        this.questionText.setText(currentQ.question);
        const shuffledAnswers = Phaser.Utils.Array.Shuffle([...currentQ.answers]);

        for (let i = 0; i < this.answerButtons.length; i++) {
            this.answerButtons[i].setText(shuffledAnswers[i]);
        }
    }

    handleAnswerClick(selectedAnswer) {
        const currentQ = this.questions[this.currentQuestionIndex];

        if (selectedAnswer === currentQ.correctAnswer) {
            this.correctAnswersCount++;
            this.currentQuestionIndex++;

            if (this.correctAnswersCount === this.questions.length) {
                this.endQuiz(true);
            } else {
                this.displayQuestion();
            }
        } else {
            this.endQuiz(false);
        }
    }
}