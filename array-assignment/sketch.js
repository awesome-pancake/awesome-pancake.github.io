// Ideal Gas Simulation
// Emmett
// March 4, 2026
//
// Extra for Experts:
// - Learned about classes and methods

const DIAMETER = 10;

class Particle {
  constructor(_x, _y){
    this.x = _x;
    this.y = _y;
    this.dx = random(-5,5);
    this.dy = random(-5,5);
  }

  speed(){
    return sqrt(this.dx**2 + this.dy**2);
  }

  speedColour(){
    return color(30*this.speed(), 50, 255-30*this.speed());
  }
}

let particleArray = [];

let bounds = {
  x: 100,
  y: 100,
  w: 500,
  h: 500,
  thickness: 5
};

bounds.mousePresent = function() {
  return mouseX > bounds.x + DIAMETER && mouseY > bounds.y + DIAMETER && mouseX + DIAMETER < bounds.x + bounds.w && mouseY + DIAMETER < bounds.y + bounds.h;
};

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function update(){
  // Updates the state of each particle and draws them
  strokeWeight(0);
  for(let p of particleArray){
    // Draw particle
    fill(p.speedColour());
    circle(p.x, p.y, DIAMETER);

    // Edge detection
    if(p.x + DIAMETER/2 >= bounds.x + bounds.w || p.x - DIAMETER/2 <= bounds.x){
      p.dx *= -1;
    }
    if(p.y + DIAMETER/2 >= bounds.y + bounds.h || p.y - DIAMETER/2 <= bounds.y){
      p.dy *= -1;
    }

    // Update position
    p.x += p.dx;
    p.y += p.dy;
  }
}

function draw() {
  background(220);

  strokeWeight(bounds.thickness);
  fill("white");
  rect(bounds.x, bounds.y, bounds.w, bounds.h);

  if(mouseIsPressed && bounds.mousePresent()){
    particleArray.push(new Particle(mouseX, mouseY));
  }

  update();
}
