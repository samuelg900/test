
var canvas = document.getElementById("gameboard");
var c = canvas.getContext("2d");
var lastLocation = [0, 0];

//TODO: //---------vvvvvv
//commenting this out makes things look better but clicking stops working
if(window.innerWidth * 0.8 < 375)
    canvas.width = 375; // set a minimum width for the canvas
else
    canvas.width = window.innerWidth * 0.8; 

canvas.height = canvas.width / 1.5; // 1.5 is the aspect ratio

//-----------^^^^^^

var paddleWidth = 0.025 * canvas.width; //2.5% of the canvas width
var paddleHeight = 0.2 * canvas.height; //20% of the canvas height

//TODO later - if game has started and web refresh is clicked, make sure we pause to confirm refersh 

class GameClass{
    constructor(currentScene, gameMode, pickingPaddle, isGameRunning){
        this.currentScene = currentScene;
        this.gameMode = gameMode;
        this.pickingPaddle = pickingPaddle;
        this.isGameRunning = isGameRunning;
    }

    reset() {
        this.currentScene = 0;
        this.gameMode = 0;
        this.pickingPaddle = false;
        this.isGameRunning = false;
    }
}

const Game = new GameClass(0, 0, false, false);

//make into a class?
const Player = {
    controllingPaddle: 1, // controlling left paddle is default
    paddleColor: "white",
    score: 0
};


const m_x = canvas.width/2 - canvas.width/5;
const m_h = canvas.height * 0.15;

const spc = (canvas.height - (4 * m_h)) / (4 + 1); // +1 for the gaps above and below the items

const menuItems = [
    { start_x: m_x, start_y: spc + (0 * (m_h + spc)), width: canvas.width/2.5, height: m_h, text: 'Classic'},
    { start_x: m_x, start_y: spc + (1 * (m_h + spc)), width: canvas.width/2.5, height: m_h, text: 'Power Up'},
    { start_x: m_x, start_y: spc + (2 * (m_h + spc)), width: canvas.width/2.5, height: m_h, text: 'How To Play'},
    { start_x: m_x, start_y: spc + (3 * (m_h + spc)), width: canvas.width/2.5, height: m_h, text: 'Settings'}
    ];

function updateMenuItems(){

        const menu_x = canvas.width/2 - canvas.width/5;
        const menu_h = canvas.height * 0.15;
        const spacing = (canvas.height - (4 * menu_h)) / (4 + 1); // +1 for the gaps above and below the items

        menuItems.forEach((item, index) => {
            item.start_x = menu_x;
            item.start_y = spacing + (index * (menu_h + spacing));
            item.width = canvas.width / 2.5;
            item.height = menu_h;
        });
    }

function drawMenuItem(x, y, width, height, text) {

    c.fillStyle = '#00a3cc';
    c.fillRect(x, y, width, height);
    c.fillStyle = 'white';
    c.font = (0.06 * canvas.height).toString() + "px Arial";
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    c.fillText(text, x + width / 2, y + height / 2);
}


function drawPickaPaddle(){
    setBackground();
    drawLine();

    let buffer = 4;
    c.fillStyle = '#81c8df';    
    c.fillRect(buffer, buffer, (canvas.width/2) - buffer*2, canvas.height - buffer*2);

    c.fillStyle = '#ec7979';    
    c.fillRect((canvas.width/2) + buffer, buffer, (canvas.width/2) - buffer*2, canvas.height - buffer*2);

    c.fillStyle = 'white';
    c.font = (0.06 * canvas.height).toString() + "px Arial";
    c.textAlign = 'center';
    c.textBaseline = 'middle';

    c.fillText("Pick Paddle on Left", canvas.width * 0.25, canvas.height / 2);
    c.fillText("Pick Paddle on Right", canvas.width * 0.75, canvas.height / 2);
    
    drawBackButtom();
    Game.pickingPaddle = true;
    canvas.style.cursor = "pointer";
}



function drawMenu(){

    updateMenuItems(); //just in case there was resizing
    setBackground();
    
    menuItems.forEach(item => {
        drawMenuItem(item.start_x, item.start_y, item.width, item.height, item.text);
    });

}

drawMenu();

function drawBackButtom(){
    c.fillStyle = '#00a3cc';    
    c.fillRect(0.02 * canvas.width, 0.02 * canvas.width, 0.06 * canvas.width, 0.06 * canvas.width);
    c.fillStyle = 'white';
    c.font = (0.06 * canvas.height).toString() + "px Arial";
    c.textAlign = 'center';
    c.textBaseline = 'middle';
    c.fillText("<", 0.02 * canvas.width + (0.06 * canvas.width)/2, 0.02 * canvas.width + (0.07 * canvas.width)/2);
}

function isMenuItemClicked(x, y, rect) {
    return x >= rect.start_x && x <= rect.start_x + rect.width && y >= rect.start_y && y <= rect.start_y + rect.height;
}

function isBackButtonPressed(x, y) {
    const rect ={start_x: 0.02 * canvas.width, start_y: 0.02 * canvas.width, width: 0.06 * canvas.width, height: 0.06 * canvas.width};
    return x >= rect.start_x && x <= rect.start_x + rect.width && y >= rect.start_y && y <= rect.start_y + rect.height;

}


function drawHowToPlay(){
    
    setBackground();
    drawBackButtom();

    //how to play text
    c.fillStyle = 'white';
    c.textAlign = 'left';
    c.textBaseline = 'middle';

    const text = [
    "• Select either 'Classic' or 'Power Up' game mode.",
    "• Pick which side you'd like to play on.",
    "• Move your paddle by clicking and going up and",
    "  down on the board.", 
    "• Score by making the ball go past the paddle on",
    "  the opposite side.",  
    "• First to reach 7 on Classic mode or 100 on Power",
    "  Up mode wins." ];

    // c.fillRect(canvas.width / 6, 0.1 * canvas.height, canvas.width - (canvas.width / 6), 0.8 * canvas.height);
    // c.fillText(text, canvas.width / 4, 0.2 * canvas.height, canvas.width/2);


    let x = canvas.width * 0.15; // Starting x-coordinate
    let y = 0.2 * canvas.height; // Starting y-coordinate
    const lineHeight = (0.12 * canvas.height); // Adjust as needed based on font size

    
    c.font = (0.05 * canvas.height).toString() + "px Arial";

    for (let i = 0; i < text.length; i++) {
        c.fillText(text[i], x, y);
        if(i == 2 || i == 4 || i == 6)
            y += lineHeight - (0.07 * canvas.height);
        else
            y += lineHeight;
    }
}


function drawSettings(){
    
    setBackground();
    drawBackButtom();

    //settings text
    c.fillStyle = 'white';
    c.textAlign = 'left';
    c.textBaseline = 'middle';

    const settingsText = "Settings will be implemented in a future update.";
    c.font = (0.05 * canvas.height).toString() + "px Arial";
    c.fillText(settingsText, canvas.width * 0.15, canvas.height / 2);
}


canvas.addEventListener('click', (event) => {
    
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;
    
    // console.log("mouseX: " + mouseX + "  mouseY: "+ mouseY);
    
    // console.log("mouseX: " + mouseX + "  mouseY: "+ mouseY);

    if(!Game.isGameRunning && (isBackButtonPressed(mouseX, mouseY))){
        Game.reset();
        canvas.style.cursor = "default";
        drawMenu();
    }
    else if(Game.pickingPaddle){
        // console.log("mouseX: " + mouseX + "  mouseY: "+ mouseY)
        if(mouseX <= canvas.width / 2){
            canvas.style.cursor = "default";
            Player.controllingPaddle = 1;
            Game.pickingPaddle = false;
            Game.isGameRunning = true;
            Game.currentScene = 4;
            animate();
        }
        else{
            canvas.style.cursor = "default";
            Player.controllingPaddle = 2;
            Game.pickingPaddle = false;
            Game.isGameRunning = true;
            Game.currentScene = 4;
            animate();
        }
    }else{

        if(!Game.isGameRunning){

            for (let i = 0; i < 4; i++) {
                const item = menuItems[i];
                
                if (isMenuItemClicked(mouseX, mouseY, item)) {
                    
                    switch(item.text){

                        case "Classic": 
                        console.log(item.text);
                        Game.gameMode = 1;
                        Game.currentScene = 1;
                        drawPickaPaddle();
                        break;
                        case "Power Up": 
                        console.log(item.text);
                        Game.gameMode = 2;
                        Game.currentScene = 1;
                        drawPickaPaddle();
                        break;
                        case "How To Play":
                        console.log(item.text); 
                        Game.currentScene = 2;
                        drawHowToPlay();
                        break;
                        case "Settings": 
                        Game.currentScene = 3;
                        console.log(item.text);
                        drawSettings();
                        break;

                    }
                }
            }
        }
    }

});


//paddle class
function Paddles(x, y) {
    this.x = x;
    this.y = y;

    this.draw = function () {
        c.fillRect(this.x, this.y, paddleWidth, paddleHeight);
    }

    this.updatePaddleLocation = function (xx, yy) {
        this.x = xx;
        this.y = yy;
    }

    this.location = function () {
        return [this.x, this.y];
    }
}

function Ball(x, y, radius, dx, dy) {
    this.ballx = x;
    this.bally = y;
    this.ballradius = radius;
    this.dx = dx;
    this.dy = dy;

    this.draw = function () {

        c.beginPath();
        c.arc(this.ballx, this.bally, this.ballradius, 0, Math.PI * 2, false);
        c.strokeStyle = "white";
        c.fill();
        c.stroke();
        c.closePath();

        this.update();
    }

    this.update = function () {

        //if the ball hits the top or bottom of the canvas
        if (this.bally + this.ballradius > canvas.height || this.bally - this.ballradius < 0) {
            this.dy = -this.dy;
            // this.ballx += this.dx;
            this.bally += this.dy;
            return;
        }

        let paddlex = paddle1.location()[0];
        let paddley = paddle1.location()[1];

        //paddle 1 collision detection
        if(ball.ballx < canvas.width/2){
            //top
            // if (paddley <= this.bally + this.ballradius && paddley > this.bally
            //     && paddlex + paddleWidth >= this.ballx - this.ballradius) {
            //     this.dy = -this.dy;
                
            // }//right
            // else 
            if (paddlex + paddleWidth >= this.ballx - this.ballradius && paddlex + paddleWidth < this.ballx
                && paddley < this.bally && paddley + paddleHeight > this.bally) {
                this.dx = -this.dx;
            }//bottom
            // else if (paddley + paddleHeight >= this.bally - this.ballradius && paddley + paddleHeight < this.bally
            //     && paddlex + paddleWidth >= this.ballx - this.ballradius) {
            //     this.dy = -this.dy;
            // }
        }
        //paddle 2 collision detection
        else{

            paddlex = paddle2.location()[0];
            paddley = paddle2.location()[1];

            //  //top
            //  if (paddley <= this.bally + this.ballradius && paddley > this.bally
            //     && paddlex <= this.ballx + this.ballradius){// && paddlex + paddleWidth > this.ballx) {
            //     this.dy = -this.dy;
                
            // }//left
            // else 
            if (paddlex <= this.ballx + this.ballradius && paddlex > this.ballx
                && paddley < this.bally && paddley + paddleHeight > this.bally) {
                this.dx = -this.dx;
            }//bottom
            // else if (paddley + paddleHeight >= this.bally - this.ballradius && paddley + paddleHeight < this.bally
            //     && paddlex <= this.ballx + this.ballradius){// && paddlex + paddleWidth > this.ballx) {
            //     this.dy = -this.dy;
            // }

        }

        //update the ball's position
        this.ballx += this.dx;
        this.bally += this.dy;

    }
}


var isDragging = false;

canvas.addEventListener('mousedown', (event) => {
    if(Game.isGameRunning){
        isDragging = true;
        lastLocation = [event.offsetX, event.offsetY];
    }
});


canvas.addEventListener('mousemove', (event) => {
    if(Game.isGameRunning){
    if (isDragging) {
        const currentX = event.offsetX;
        const currentY = event.offsetY;

        if(Player.controllingPaddle == 1){
            //moving up
            if (lastLocation[1] > currentY) {
                if (paddle1.location()[1] > 0)
                    paddle1.updatePaddleLocation(paddle1.location()[0], paddle1.location()[1] + (currentY - lastLocation[1]));
            }

            //moving down
            if (lastLocation[1] < currentY) {
                if (paddle1.location()[1] + paddleHeight < canvas.height)
                    paddle1.updatePaddleLocation(paddle1.location()[0], paddle1.location()[1] - (lastLocation[1] - currentY));
            }
        }
        else if(Player.controllingPaddle == 2){
            
            //moving up
            if (lastLocation[1] > currentY) {
                if (paddle2.location()[1] > 0)
                    paddle2.updatePaddleLocation(paddle2.location()[0], paddle2.location()[1] + (currentY - lastLocation[1]));
            }

            //moving down
            if (lastLocation[1] < currentY) {
                if (paddle2.location()[1] + paddleHeight < canvas.height)
                    paddle2.updatePaddleLocation(paddle2.location()[0], paddle2.location()[1] - (lastLocation[1] - currentY));
            }
        }

        //update the most current location
        lastLocation = [currentX, currentY];
    }
}
});

canvas.addEventListener('mouseup', () => {
    if(Game.isGameRunning)
        isDragging = false;
});

const paddle1 = new Paddles(0.02 * canvas.width, (canvas.height) / 2 - (paddleHeight / 2));
const paddle2 = new Paddles(0.98 * canvas.width - paddleWidth, (canvas.height) / 2 - (paddleHeight / 2));

//ball starts at the middle of the board
var xball = canvas.width / 2;
var yball = canvas.height / 2;
var radius = 50;
var dx = 3.2;//-2.5; //will be random
var dy = -3.5; //will be random
var ball = new Ball(xball, yball, paddleWidth/2, dx, dy);
// var ball = new Ball(xball, yball, radius, dx, dy);

function drawLine(){

    c.strokeStyle = "white";
    c.setLineDash([canvas.width / 90, 10]);
    c.beginPath();
    c.moveTo(canvas.width / 2, 0);
    c.lineTo(canvas.width / 2, canvas.height);
    c.stroke();
}

//sets background and paddles
function setBackground() {
    
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "white";

}

//set onclick listerner for when mouse moves out of the canvas
//if the the mouse is unclicked and dragging is true, set dragging to false
var ballInPlay=true;

var p1_score=0;
var p2_score=0;

var ballCounter=0;


var countdown = 3;
var timer;

// Function to draw the countdown on the canvas
function drawTimer() {
  c.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  
  setBackground();
  paddle1.draw();
  paddle2.draw();
  drawLine();
  drawScore();


  // Set font and style for the countdown
  c.font = (0.2 * canvas.height).toString() + "px Arial";
  c.fillStyle = 'white';
  c.textAlign = 'center';
  c.textBaseline = 'middle';

  // Draw the countdown number in the center of the canvas
  c.fillText(countdown, canvas.width / 2, canvas.height / 2);
}

var boolCount= false;

function startCountdown() {
           
    timer = setInterval(() => {
        // countdown--;
        // console.log("countdown: " + countdown);
        drawTimer();
    
        if(countdown-- <= 0){
            clearInterval(timer);
            boolCount=false; // reset the boolCount to false so animate can run again
            ballInPlay = true;
            countdown = 3;
             ball = new Ball(xball, yball, paddleWidth/2,  Math.floor(Math.random() * 5) + 2,  Math.floor(Math.random() * 5) + 1);
             ball = new Ball(xball, yball, paddleWidth/2, dx, dy);
             requestAnimationFrame(animate); // Start the animation after countdown is done
            // c.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
            // c.fillText('Go!', canvas.width / 2, canvas.height / 2); // Show "Go!" 
        }

    }, 1000);

}
// if(!ballInPlay && countdown == 3) { // Start countdown only if ball is not in play and countdown is reset to 3
// startCountdown();
// }

function drawScore() {
    c.font = (0.1 * canvas.height).toString() + "px Arial";
    c.textAlign="center";
    c.fillText(p1_score, canvas.width/2 - (0.15 * canvas.width/2), 0.15 * canvas.height);
    c.fillText(p2_score, canvas.width/2 + (0.15 * canvas.width/2), 0.15 * canvas.height);
}

function animate() {

    if(boolCount)
        return;

    //clears the canvas -- could be removed since background is drawn anyways?
    c.clearRect(0, 0, canvas.width, canvas.height);

    //draws the backgroud, paddles and ball
    setBackground();
    paddle1.draw();
    paddle2.draw();
    drawLine();
    drawScore();

    //if ball is within the canvas +/- 10, draw it - needed?
    if(ballInPlay){
        if (ball.ballx > -10 && ball.ballx < canvas.width + 10)
            ball.draw();

        if(ball.ballx < -5){
            ballInPlay=false;
            c.fillText(++p2_score, canvas.width/2 - (0.15 * canvas.width/2), 0.15 * canvas.height);
        
        }else if(ball.ballx > canvas.width + 5){
            ballInPlay=false;
            c.fillText(++p1_score, canvas.width/2 + (0.15 * canvas.width/2), 0.15 * canvas.height); 
        }

        //paddle 2 is controlled by AI - player controls paddle 1
        if(Player.controllingPaddle == 1){
            if(ball.ballx > canvas.width / 2){
                //AI for paddle 2 - simple follow the ball logic
                var movement = (ball.dy < 0) ? ball.dy * -1 : ball.dy;
                //check if ball.y location is above the middle of paddle2, if so (move paddle up)
                if(ball.bally < ((paddle2.location()[1]) + paddleHeight/2)){
                    if(paddle2.location()[1] > 0) //make sure it doesn't go past the top of the canvas
                        paddle2.updatePaddleLocation(paddle2.location()[0], paddle2.location()[1] - (movement));
                }else{
                    if(paddle2.location()[1] + paddleHeight < canvas.height) //make sure it doesn't go past the bottom of the canvas
                        paddle2.updatePaddleLocation(paddle2.location()[0], paddle2.location()[1] + (movement));
                }
            }
        }
        //paddle 1 is controlled by AI - player controls paddle 2
        else if(Player.controllingPaddle == 2){
            if(ball.ballx < canvas.width / 2){
            
                //AI for paddle 1 - simple follow the ball logic
                var movement = (ball.dy < 0) ? ball.dy * -1 : ball.dy;
                //check if ball.y location is above the middle of paddle1, if so (move paddle up)
                if(ball.bally < ((paddle1.location()[1]) + paddleHeight/2)){
                    if(paddle1.location()[1] > 0) //make sure it doesn't go past the top of the canvas
                        paddle1.updatePaddleLocation(paddle1.location()[0], paddle1.location()[1] - (movement));
                }else{
                    if(paddle1.location()[1] + paddleHeight < canvas.height) //make sure it doesn't go past the bottom of the canvas
                        paddle1.updatePaddleLocation(paddle1.location()[0], paddle1.location()[1] + (movement));
                }

            }

        }

    }else{
        // ballInPlay = true;
        // ball = new Ball(xball, yball, paddleWidth/2,  Math.floor(Math.random() * 5) + 2,  Math.floor(Math.random() * 5) + 1);
        //      ball = new Ball(xball, yball, paddleWidth/2, dx, dy);
        //     //  requestAnimationFrame(animate);
        boolCount = true;
        startCountdown();
    }

    requestAnimationFrame(animate); //move to end of this function later? might be better for performance?
}


// animate();

window.addEventListener("resize", function () {

   //TODO: check if game is running, if not, then just return
   //Do this for other listeners as well 

    if(Game.isGameRunning){
        let p1resizeW = (paddle1.location()[0] * 100) / canvas.width;
        let p1resizeH = (paddle1.location()[1] * 100) / canvas.height;
        let p2resizeW = (paddle2.location()[0] * 100) / canvas.width;
        let p2resizeH = (paddle2.location()[1] * 100) / canvas.height;
        
        if(window.innerWidth * 0.8 < 375)
            canvas.width = 375; // set a minimum width for the canvas if too small
        else
            canvas.width = window.innerWidth * 0.8;

        canvas.height = canvas.width / 1.5;

        paddleWidth = 0.025 * canvas.width; //2.5% of the canvas width
        paddleHeight = 0.2 * canvas.height; //20% of the canvas height

        //upadtes the paddle height location based on canvas resizing 
        paddle1.updatePaddleLocation((p1resizeW/100) * canvas.width, (p1resizeH/100) * canvas.height);
        paddle2.updatePaddleLocation((p2resizeW/100) * canvas.width, (p2resizeH/100) * canvas.height);
    }
    
    // console.log("-------------------------");
    // console.log("canvas.width: " + canvas.width);
    // console.log("paddle2.x: " + paddle2.x);
    // console.log("paddleWidth: " + paddleWidth);
    
    //TODO: check what menu scene is on and resize accordingly
    switch(Game.currentScene){
        case 0: //menu
            drawMenu();
            break;
        case 1: //pick a paddle
            drawPickaPaddle();
            break;
        case 2: //how to play
            drawHowToPlay();
            break;
        case 3: //settings
            drawSettings();
            break;
        default: //case 4 - in game
            // setBackground();
            break;
    }

    
    // drawMenu();


});
