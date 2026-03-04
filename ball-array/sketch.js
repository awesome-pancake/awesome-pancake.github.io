
// TO DO: try making an ideal gas simulator

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0);
  if(mouseIsPressed){
    spawnBall();
  }
  for(let ball of ballArray){
    let color = hube(sqrt(ball.dx**2 + ball.dy**2));
    console.log(color);
    fill(color[0], color[1], color[2]);
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

function hube(_v){
  return [30*_v, 40+5*_v, 255-15*_v];
}

function spawnBall(){
  let someBall = {
    x: mouseX,
    y: mouseY,
    dx: random(-7,7),
    dy: random(-7,7),
    radius: 10
  };
  ballArray.push(someBall);
}