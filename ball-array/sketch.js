
// TO DO: try making an ideal gas simulator

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  spawnBall();
}

function draw() {
  background(220);
  for(let ball of ballArray){
    circle(ball.x, ball.y, 2*ball.radius);

    if(ball.x >= width || ball.x <= 0){
      ball.dx *= -1;
    }
    if(ball.y >= height || ball.y <= 0){
      ball.dy *= -1;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
  }
}

function spawnBall(){
  let someBall = {
    x: random(width),
    y: random(height),
    dx: random(-5,5),
    dy: random(-5,5),
    radius: random(10,30)
  };
  ballArray.push(someBall);
}