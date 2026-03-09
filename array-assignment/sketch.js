// Ideal Gas Simulation
// Emmett
// March 4, 2026
//
// Extra for Experts:
// - Learned about classes and methods
// - Also learned about object methods

// This simulation uses a unit system based on SI:
// 1 px = 38.891 nm
// 1 frame = 1 ns
// 1 AMU = 6.022x10^-26 kg
const DIAMETER = 10; // Diameter of each particle in pixels
const MASS = 4; // Mass of each particle in AMU
const K = 0.1; // Boltzmann constant
let startSpeed = 1;

class Particle {
  constructor(_x, _y){
    this.x = _x;
    this.y = _y;
    this.dx = random(-startSpeed,startSpeed);
    this.dy = random(-startSpeed,startSpeed);
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

let state = {
  kineticEnergy: 0,
  pressure: 0,
  temperature: 0,
  number: 0,
  volume: 0,
};

bounds.inBounds = function(_x, _y, space=0) {
  return _x >= bounds.x + space && _y >= bounds.y + space && _x + space <= bounds.x + bounds.w && _y + space <= bounds.y + bounds.h;
};

function findTemp(){
  // Finds temperature of gas based on formula KE = 3kT/2
  state.temperature = state.kineticEnergy*2/3/K;
}

function findPressure(){
  // Finds pressure based on formula PV = NkT
  state.pressure = K*state.number*state.temperature/state.volume;
}

function update(){
  // Updates the state of each particle and draws them

  state.kineticEnergy = 0;
  state.number = particleArray.length;
  state.volume = bounds.l * bounds.w * bounds.h;

  strokeWeight(0);
  for(let p of particleArray){
    // Draw particle
    fill(p.speedColour());
    circle(p.x, p.y, DIAMETER);

    state.kineticEnergy += 0.5*MASS*p.speed()**2/particleArray.length;

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

  findTemp();
  findPressure();
}

/*function mouseWheel(event){
  // Changes the speed of the spawning gas
  // Make this better
  startSpeed += startSpeed >= 0.01 ? 0.01*event.delta : -0.01*event.delta;
  update();
}*/

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(25);
}

function draw() {
  background(220);

  fill("black");
  text(`PV = NkT`, 100, 700);
  text(`N=${state.number}`, 100, 740);
  text(`V=${round(state.volume*5.88*10**-5, 2)} μm^3`, 100, 770);
  //text(`KE(avg)=${round(state.kineticEnergy, 2)}`, 100, 800);
  text(`T=${round(state.temperature,2)} K`, 100, 800);
  text(`P=${round(state.pressure*2.511*10**6,2)} MPa`, 100, 830);

  strokeWeight(bounds.thickness);
  fill("white");
  rect(bounds.x, bounds.y, bounds.w, bounds.h);

  if(mouseIsPressed && bounds.inBounds(mouseX, mouseY, DIAMETER)){
    particleArray.push(new Particle(mouseX, mouseY));
  }

  update();
}
