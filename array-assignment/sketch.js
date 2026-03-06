// Ideal Gas Simulation
// Emmett
// March 4, 2026
//
// Extra for Experts:
// - Learned about classes and methods
// - Also learned about object methods

const DIAMETER = 10; // Diameter of each particle in pixels
const MASS = 4; // Mass of each particle in AMU
const SCALE = 7.4130; // Picometers per pixel, each frame is 1 picosecond
const K = 1.308*10**-23; // Boltzmann constant in SI units
let kinetic = 0; // Average kinetic energy in AMU*(pixel/frame)^2

class Particle {
  constructor(_x, _y){
    this.x = _x;
    this.y = _y;
    this.dx = random(-1,1);
    this.dy = random(-1,1);
  }

  speed(){
    return sqrt(this.dx**2 + this.dy**2);
  }

  speedColour(){
    return color(100*this.speed(), 60, 255-30*this.speed());
  }
}

let particleArray = [];

let bounds = {
  x: 100,
  y: 100,
  w: 500,
  h: 500,
  l: 500,
  thickness: 5
};

bounds.inBounds = function(_x, _y, space=0) {
  return _x >= bounds.x + space && _y >= bounds.y + space && _x + space <= bounds.x + bounds.w && _y + space <= bounds.y + bounds.h;
};

function findTemp(){
  // Finds temperature of gas based on formula KE = 3kT/2
  return 2.206*10**-21*kinetic/K; // The constant in this formula comes from dimensional analysis
}

function findPressure(){
  // Finds pressure based on formula PV = NkT
  return K*findTemp()/(bounds.w*bounds.h*bounds.l*SCALE**3)/10**33;
}

function update(){
  // Updates the state of each particle and draws them

  kinetic = 0;
  strokeWeight(0);
  for(let p of particleArray){
    // Draw particle
    fill(p.speedColour());
    circle(p.x, p.y, DIAMETER);

    kinetic += 0.5*MASS*p.speed()**2/particleArray.length;

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

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(25);
}

function draw() {
  background(220);

  fill("black");
  text(`PV = NkT`, 100, 700);
  text(`N=${particleArray.length}`, 100, 740);
  text(`V=${round(bounds.w * bounds.h * bounds.l * SCALE**3, 2)} pm^3`, 100, 770);
  //text(`KE(avg)=${round(kinetic, 2)}`, 100, 800);
  text(`T=${round(findTemp(),2)}K`, 100, 800);
  text(`P=${round(findPressure(),2)}P`, 100, 830);

  strokeWeight(bounds.thickness);
  fill("white");
  rect(bounds.x, bounds.y, bounds.w, bounds.h);

  if(mouseIsPressed && bounds.inBounds(mouseX, mouseY, DIAMETER)){
    particleArray.push(new Particle(mouseX, mouseY));
  }

  update();
}
