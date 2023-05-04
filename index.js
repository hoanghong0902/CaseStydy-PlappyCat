let canvas = document.getElementById("meow");
let ctx = canvas.getContext('2d');

let music = new Audio("./music.mp3");
music.load=true;

var bgImage = new Image();
var catImage = new Image();
var pipeBotImage = new Image();
var pipeTopImage = new Image();
bgImage.src = "img/background.jpg";
catImage.src = "img/cat.png";
pipeBotImage.src = "img/pipeBot.png";
pipeTopImage.src = "img/pipeTop.png";

let game = "start";
let gameOver = false;

const bg = {
    cX: 0,
    cY: 0,
    cW: 1000,
    cH: 650,
    draw: function () {
        ctx.beginPath();
        ctx.drawImage(bgImage, this.cX, this.cY, this.cW, this.cH);
    }
}

 start = {
    draw: function () {
        ctx.beginPath();
        ctx.font = '70px Arial';
        ctx.fillStyle = "#FFFF00"
        ctx.shadowBlur = 10;
        ctx.fontWeight = 350;
        ctx.fillText("Start", 400, 300);
        ctx.strokeText("Start", 400, 300);
    }
}



function Pipe(cX, cY, space) {
    this.cX = cX;
    this.cY = cY;
    this.space = space;
    this.cW = 82;
    this.cH = 710;
    this.dX = -5;

    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(pipeTopImage, this.cX, this.cY, this.cW, this.cH);
        ctx.drawImage(pipeBotImage, this.cX, this.cY + this.cH + this.space, this.cW, this.cH);
    }
}

function random(min, max) {
    return Math.ceil(Math.random() * (max - min) + min);
}

let arrPipes = [];

function addArrPipes() {
    for (let i = 1; i < 4; i++) {
        let pipe = new Pipe(random(300, 400) * i, random(-660, -300), 300);
        arrPipes.push(pipe);
    }
}

addArrPipes();

function drawArrPipes() {
    for (let i = 0; i < arrPipes.length; i++) {
        arrPipes[i].draw();
    }
}

function updateArrPipes() {
    for (let i = 0; i < arrPipes.length; i++) {
        arrPipes[i].cX += arrPipes[i].dX;
    }
    if (arrPipes[0].cX <= -arrPipes[0].cW) {
        arrPipes.splice(0, 1);
        let pipe = new Pipe(arrPipes[arrPipes.length - 1].cX + random(300, 400), random(-660, -300), 300);
        arrPipes.push(pipe);
    }
}


function Cat(cX, cY) {
    this.cX = cX;
    this.cY = cY;
    this.cW = 80;
    this.cH = 80;
    this.speed = 0;
    this.a = 0.7;
    this.image = catImage;

    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(this.image, this.cX, this.cY, this.cW, this.cH);
    }
    this.update = function () {
        this.speed += this.a;
        this.cY += this.speed;
    }
}

let cat = new Cat(130, 300);
canvas.addEventListener("click", moveCat);
window.addEventListener("keydown", keyInput);
function keyInput(evt){
    console.log(evt.keyCode);
    switch (evt.keyCode) {
        case 32:
            moveCat();
            break;
        default:
            break;
    }
}

function moveCat() {
    music.play();

    if (game == "start") {
        game = "play";
    }
    if (game == "play") {
        cat.speed = -8;
        cat.image = catImage;
    }
    if (game == "end") {
        score.value = 0;
        arrPipes = [];
        addArrPipes();
        cat.speed = 0;
        cat.cY = 300;
        gameOver = false;
        game = "start"
    }
}


function Score(value, cX, cY) {
    this.value = value;
    this.cX = cX;
    this.cY = cY;
    this.draw = function () {
        ctx.beginPath();
        ctx.font = '70px Arial';
        ctx.fillStyle = "#FDEEF4"
        ctx.shadowBlur = 10;
        ctx.fontWeight = 900;
        ctx.fillText("Score : " + this.value, this.cX, this.cY);
        ctx.strokeText("Score : " + this.value, this.cX, this.cY);
    }
}

let score = new Score(0, canvas.width / 2 - 170, 200);

function draw() {
    bg.draw();
    drawArrPipes();
    if (game == "start") {
        start.draw();
    }
    if (game == "play") {
        score.draw();
    }
    if (game == "end") {
        ctx.beginPath();
        ctx.font = '50px Arial';
        ctx.fillStyle = "#FFFF00"
        ctx.shadowBlur = 10;
        //ctx.fontWeight = 900;
        ctx.fillText("Your score: " + score.value, 360, 200);
        ctx.strokeText("Your score: " + score.value, 360, 200);
        ctx.fillText("GAME OVER", 350, 250);
        ctx.strokeText("GAME OVER", 350, 250);
        ctx.fillStyle = "black"
        ctx.strokeText("PLAY AGAIN", 360, 400);
        ctx.fillText("PLAY AGAIN", 360, 400);
        ctx.strokeRect(360,355,300,50);

        ctx.font = '20px Arial';
        ctx.fillStyle = "black"
        ctx.strokeText("click here", 460, 350);
        ctx.fillText("click here", 460, 350);
    }

    cat.draw();
}

function update() {
    if (game == "play") {
        updateArrPipes();
        cat.update();
        if (cat.cY + cat.cH < 0) {
        cat.image = catImage;
        cat.speed = 0;
        cat.cY = 0;
        game = "end"
        gameOver = true;
        }

        if (cat.cY + cat.cH > 620) {
        cat.image = catImage;
        cat.speed = 0;
        cat.cY = 600;
        game = "end"
        gameOver = true;
        }
        
        console.log(arrPipes[0].cX, arrPipes[0].cY);
        //console.log(arrPipes[0].cY);
        console.log(cat.cX, cat.cY);
        console.log(cat.cW, cat.cH);
        //console.log((cat.cX + cat.cW));
        console.log(" ");
        if (((cat.cX + cat.cW) >= arrPipes[0].cX &&
                (cat.cX + cat.cW) <= (arrPipes[0].cX + arrPipes[0].cW) &&
                cat.cY >= arrPipes[0].cY &&
                cat.cY <= arrPipes[0].cY + arrPipes[0].cH
            ) ||
            ((cat.cX + cat.cW) >= arrPipes[0].cX &&
                (cat.cX + cat.cW) <= (arrPipes[0].cX + arrPipes[0].cW) &&
                (cat.cY + cat.cH) >= (arrPipes[0].cY + arrPipes[0].cH + arrPipes[0].space) &&
                (cat.cY + cat.cH) <= (arrPipes[0].cY + arrPipes[0].cH + arrPipes[0].space + arrPipes[0].cH)
            ) ||
            ((cat.cX + cat.cW) >= arrPipes[0].cX + 82 &&
                (cat.cX + cat.cW) <= (arrPipes[0].cX + arrPipes[0].cW + 82) &&
                cat.cY >= arrPipes[0].cY  &&
                cat.cY <= arrPipes[0].cY + arrPipes[0].cH 
            ) ||
            ((cat.cX + cat.cW) >= arrPipes[0].cX + 82 &&
                (cat.cX + cat.cW) <= (arrPipes[0].cX + arrPipes[0].cW + 82) &&
                (cat.cY + cat.cH) >= (arrPipes[0].cY + arrPipes[0].cH + arrPipes[0].space ) &&
                (cat.cY + cat.cH) <= (arrPipes[0].cY + arrPipes[0].cH + arrPipes[0].space + arrPipes[0].cH )
            )) {
            cat.image = catImage;
            cat.speed = 0;
            cat.cY = 600;
            game = "end"
            gameOver = true;
        }
        if (arrPipes[0].cX >= 130 && arrPipes[0].cX < 135) {
            score.value++;
            // console.log("score = " + score.value);
            // console.log(arrPipes[0].cX)
        }
    }
}
function animate() {
    setTimeout(animate, 1000 / 60);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
    update();
}

animate();