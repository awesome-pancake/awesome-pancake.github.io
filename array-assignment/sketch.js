// Ideal Gas Simulation
// Emmett
// March 4, 2026
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

class Particle {
  constructor(_x, _y){
    this.x = _x;
    this.y = _y;
    this.dx = 0;
    this.dy = 0;
  }
}

let particleArray = [];

let bounds = {
  x: 10,
  y: 10,
  w: 500,
  h: 500,
  thickness: 5
};

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function update(){
  fill("red");
  strokeWeight(1);
  for(let p of particleArray){
    circle(p.x, p.y, 10);
  }
}

function draw() {
  background(220);

  strokeWeight(bounds.thickness);
  fill("white");
  rect(bounds.x, bounds.y, bounds.w, bounds.h);

  if(mouseIsPressed){
    particleArray.push(new Particle(mouseX, mouseY));
  }

  update();
}
