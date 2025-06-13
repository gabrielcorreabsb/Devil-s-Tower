# Devil's Tower

<div align="center">

![Logo do Jogo Devil's Tower](https://github.com/gabrielcorreabsb/Devil-s-Tower/blob/main/img/devilsTower.png?raw=true)

###  Jogável no Navegador! [Jogue Agora!](https://gabrielcorrea.tech/projetos/game-projeto/)

</div>

## Sobre o Projeto

**Devil's Tower** é um protótipo de jogo de plataforma 2D com progressão de níveis, desenvolvido como um projeto acadêmico para a disciplina de Programação de Games. Inspirado em clássicos como *Castlevania*, o jogo apresenta um personagem com um sistema de combate em combo, movimentação fluida e múltiplos estágios, cada um com seus próprios desafios e design.

O projeto foi construído do zero, utilizando a engine de jogos **Phaser 3** e o **Tiled Map Editor** para o design dos níveis, demonstrando a integração entre ferramentas de desenvolvimento de jogos e programação em JavaScript.

---

## Funcionalidades Implementadas

* **Sistema de Níveis Múltiplos:** O jogo possui uma estrutura para gerenciar 4 fases distintas (Entrada, Biblioteca, Masmorra e Chefe), com um sistema de transição que permite ao jogador progredir ao alcançar a saída de cada nível.
* **Personagem Principal Complexo (`Player.js`):**
    * Movimentação fluida com pulo duplo.
    * Sistema de combate com combos de 4 ataques.
    * Habilidade de rolamento (dodge) com invencibilidade temporária.
    * Animações detalhadas para cada ação (parado, correr, pular, atacar, rolar).
* **Easter Egg com Quiz (`QuizManager.js`):**
    * Um quiz secreto é ativado ao interagir com um objeto específico na Fase 2.
    * Se o jogador responder corretamente a 3 perguntas sobre desenvolvimento de jogos, ele é transportado diretamente para a fase final do chefe.
* **Design de Mapas com Tiled:**
    * As fases foram desenhadas usando o Tiled Map Editor.
    * O código carrega dinamicamente as camadas de tiles e de objetos para construir o cenário e as zonas de gatilho (saídas e quiz).
* **Interface de Usuário (HUD):**
    * Menus iniciais para introdução e instruções.
    * Uma HUD em jogo que exibe a barra de vida do jogador.

---

## Tecnologias Utilizadas

* **Engine de Jogo:** [Phaser 3](https://phaser.io/)
* **Linguagem:** JavaScript (ES6 Modules)
* **Editor de Mapas:** [Tiled Map Editor](https://www.mapeditor.org/)
* **Servidor Local:** (Ex: Live Server do VS Code)

---

## Como Executar o Projeto

Para rodar este projeto, você precisará de um servidor local para servir os arquivos estáticos, devido às políticas de segurança dos navegadores (CORS) ao carregar arquivos locais.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/seu-repositorio.git](https://github.com/seu-usuario/seu-repositorio.git)
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd seu-repositorio
    ```
3.  **Inicie um servidor local:**
    * Se você usa o **Visual Studio Code**, instale a extensão [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) e clique em "Go Live" no canto inferior direito.
    * Alternativamente, você pode usar o Python:
        ```bash
        # Para Python 3
        python -m http.server
        ```
4.  Abra seu navegador e acesse o endereço fornecido pelo servidor (geralmente `http://127.0.0.1:5500` ou `http://localhost:8000`).

---

## Créditos

Este projeto foi desenvolvido como parte do curso de Análise e Desenvolvimento de Sistemas (ADS 2025) da Uniceplac.

* **Samuel:** Programação principal (JavaScript, HTML), implementação da classe do Jogador e mecânicas de combate.
* **Gabriel:** Design dos mapas (Tiled), revisão, edição e integração do código da cena principal (`MainScene.js`).
