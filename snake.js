// Création et configuration du canvas
const canvas = document.createElement("canvas");
canvas.id = "gameCanvas";
canvas.width = 400;
canvas.height = 400;
canvas.style.border = "1px solid black";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");

// Taille d'une case et initialisation du serpent
const box = 20;
let snake = [{ x: 9 * box, y: 10 * box }]; // Position initiale du serpent
let direction = null; // Direction initiale
let food = {
    x: Math.floor(Math.random() * 20) * box, // Position aléatoire de la nourriture
    y: Math.floor(Math.random() * 20) * box
};
let score = 0; // Score initial

// Positions des obstacles
const obstacles = [
    { x: 5 * box, y: 5 * box },
    { x: 10 * box, y: 10 * box },
    { x: 15 * box, y: 15 * box }
];

// Écoute des touches pour changer la direction
document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    // Empêche le serpent de revenir sur lui-même
    if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
    else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
}

// Ajout d'un dégradé de fond
function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#a8e063"); // Vert clair
    gradient.addColorStop(1, "#56ab2f"); // Vert foncé
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawGame() {
    // Efface le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // Dessine les obstacles
    ctx.fillStyle = "gray";
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x, obstacle.y, box, box);
    }

    // Dessine la nourriture
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Dessine le serpent
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "lightgreen";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "darkgreen";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Position actuelle de la tête
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Mise à jour de la position en fonction de la direction
    if (direction === "UP") snakeY -= box;
    if (direction === "DOWN") snakeY += box;
    if (direction === "LEFT") snakeX -= box;
    if (direction === "RIGHT") snakeX += box;

    // Permet au serpent de traverser les murs
    if (snakeX < 0) snakeX = canvas.width - box; // Mur gauche
    if (snakeX >= canvas.width) snakeX = 0; // Mur droit
    if (snakeY < 0) snakeY = canvas.height - box; // Mur haut
    if (snakeY >= canvas.height) snakeY = 0; // Mur bas

    // Vérifie si le serpent mange la nourriture
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box
        };
    } else {
        snake.pop();
    }

    // Ajoute une nouvelle tête
    const newHead = { x: snakeX, y: snakeY };

    // Vérifie les collisions (murs, serpent lui-même, obstacles)
    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake) ||
        collision(newHead, obstacles) // Collision avec les obstacles
    ) {
        clearInterval(game);
        alert("Game Over! Score: " + score);
    }

    snake.unshift(newHead);

    // Affiche le score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function collision(head, array) {
    // Vérifie si la tête entre en collision avec une partie du corps
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

// Lance le jeu avec un intervalle de 100ms
const game = setInterval(drawGame, 100);