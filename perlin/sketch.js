

const SCALE = 100;
const DT = 0.1;
let time = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  fill("black");

  let x = SCALE*noise(time);
  let y = SCALE*noise(0, time);

  circle(x+width/2, y+height/2, 50);
  time += DT;
}
