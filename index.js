const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#scoreText");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "black";
const snakeColor = "lightgreen";
const snakeBorder = "white";
const foodColor = "red";
const foodBorder = "white";
const unitSize = 25;

let running = false;
let timer = null;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
]

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart(){
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    nextTick();
}
function nextTick(){
    if(running){
        timer = setTimeout(() => {
            clearBorad();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 75);
    }
    else{
        displayGameOver();
    }
}
function clearBorad(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
}
function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.strokeStyle = foodBorder;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
    ctx.strokeRect(foodX, foodY, unitSize, unitSize);
}
function moveSnake(){
    let head = {x: snake[0].x + xVelocity, 
                y: snake[0].y + yVelocity};
    if(snake[0].x < 0){
        head = {x: gameWidth + xVelocity, 
                y: snake[0].y + yVelocity};
    }
    else if(snake[0].x > gameWidth){
        head = {x: (0 + xVelocity) - unitSize, 
                y: snake[0].y + yVelocity};
    }
    else if(snake[0].y < 0){
        head = {x: snake[0].x + xVelocity, 
                y: gameHeight + yVelocity};
    }
    else if(snake[0].y > gameHeight){
        head = {x: snake[0].x + xVelocity, 
                y: (0 + yVelocity) - unitSize};
    }
    snake.unshift(head);
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scoreText.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }
}
function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
}
function changeDirection(event){
    const keyPressed = event.keyCode;
    const left = 37;
    const right = 39;
    const up = 38;
    const down = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == left && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == up && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == right && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;      
        case(keyPressed == down && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;       
    }
}
function checkGameOver(){
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
}
function displayGameOver(){
    ctx.font = "50px Verdana";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);
    running = false; 
}
function resetGame(){
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0}
    ]            
    clearTimeout(timer);
    gameStart();
}