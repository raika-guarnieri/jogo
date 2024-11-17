// Variáveis do jogo
let spaceship;
let obstacles = [];
let score = 0;
let gameOver = false;

// Sons
let collisionSound;
let pointSound;

// Função de configuração inicial
function setup() {
    createCanvas(windowWidth, windowHeight);
    spaceship = new Spaceship();
    collisionSound = loadSound('https://www.soundjay.com/button/beep-07.wav');
    pointSound = loadSound('https://www.soundjay.com/button/beep-09.wav');
}

// Função de desenho do jogo
function draw() {
    background(0);  // Fundo preto

    if (gameOver) {
        textSize(50);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        text("Game Over", width / 2, height / 2);
        textSize(30);
        text("Pontuação: " + score, width / 2, height / 2 + 50);
        return;
    }

    // Desenhar a nave
    spaceship.update();
    spaceship.show();

    // Gerar obstáculos
    if (frameCount % 60 === 0) {
        obstacles.push(new Obstacle());
    }

    // Desenhar obstáculos
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].show();

        // Verificar colisão
        if (spaceship.hits(obstacles[i])) {
            collisionSound.play();
            gameOver = true;
        }

        // Remover obstáculos fora da tela
        if (obstacles[i].offscreen()) {
            obstacles.splice(i, 1);
            score++;
            pointSound.play();
        }
    }

    // Exibir placar
    textSize(32);
    fill(255);
    text("Pontuação: " + score, 30, 50);
}

// Classe da nave
class Spaceship {
    constructor() {
        this.x = width / 2;
        this.y = height - 50;
        this.width = 50;
        this.height = 30;
    }

    update() {
        // Controle de movimento com as teclas de seta
        if (keyIsDown(LEFT_ARROW) && this.x > 0) {
            this.x -= 5;
        }
        if (keyIsDown(RIGHT_ARROW) && this.x < width - this.width) {
            this.x += 5;
        }
    }

    show() {
        fill(0, 255, 0);  // Cor verde
        noStroke();
        triangle(this.x, this.y, this.x + this.width / 2, this.y - this.height, this.x + this.width, this.y);
    }

    hits(obstacle) {
        // Verificar colisão com o obstáculo
        if (
            this.x < obstacle.x + obstacle.width &&
            this.x + this.width > obstacle.x &&
            this.y < obstacle.y + obstacle.height &&
            this.y + this.height > obstacle.y
        ) {
            return true;
        }
        return false;
    }
}

// Classe dos obstáculos
class Obstacle {
    constructor() {
        this.x = random(width);
        this.y = -20;
        this.width = random(30, 60);
        this.height = random(20, 50);
        this.speed = random(4, 7);
    }

    update() {
        this.y += this.speed;
    }

    show() {
        fill(255, 0, 0);  // Cor vermelha
        noStroke();
        rect(this.x, this.y, this.width, this.height);
    }

    offscreen() {
        return this.y > height;
    }
}
