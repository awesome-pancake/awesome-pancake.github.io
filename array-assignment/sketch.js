// Ideal Gas Simulation (World's Worst Sorting Algorithm)
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
let startSpeed = 5;

class Particle {
  // Methods and objects for particles
  constructor(_x, _y, _dx, _dy){
    this.x = _x;
    this.y = _y;
    this.dx = _dx;
    this.dy = _dy;
  }

  speed(){
    return sqrt(this.dx**2 + this.dy**2);
  }

  speedColour(){
    return color(90*this.speed(), 60, 255-30*this.speed());
  }
}

class Box {
  constructor(_x=0, _y=0, _w=500, _h=500, _l=500){
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.l = _l;
  }

  inBounds(_x, _y, space=0){
    // Determines if a given x and y coordinate is in the bounds of the box.
    return _x >= this.x + space && _y >= this.y + space && _x + space <= this.x + this.w && _y + space <= this.y + this.h;
  }

  // Add a method to draw the box
}

class Simulation extends Box {
  // Simulation methods and objects
  constructor(_x=0, _y=0, _w=500, _h=500, _l=500, _thickness=5, _handle=function(){}){
    super(_x, _y, _w, _h, _l);
    this.thickness = _thickness;

    this.state = {
      kineticEnergy: 0,
      pressure: 0,
      temperature: 0,
      number: 0,
      volume: 0, // Either keep this, or remove Box.volume()
    };

    // Implements a handler that modifies the state of each particle on each simulation tick
    if(typeof _handle === "function"){
      this.stateHandle = _handle;
    }
    else {
      throw new Error("stateHandle must be a function");
    }

    this.particleArray = [];
  }

  findTemp(){
    // Finds temperature of gas based on formula KE = 3kT/2
    this.state.temperature = this.state.kineticEnergy*2/3/K;
  }

  findPressure(){
    // Finds pressure based on formula PV = NkT
    this.state.pressure = K*this.state.number*this.state.temperature/this.state.volume;
  }

  update(){
    // Updates the state of each particle and draws them

    // Draw box
    strokeWeight(this.thickness);
    fill("black");
    rect(this.x, this.y, this.w, this.h);

    // Set state variables
    this.state.kineticEnergy = 0;
    this.state.number = this.particleArray.length;
    this.state.volume = this.l * this.w * this.h;

    strokeWeight(0);
    for(let p of this.particleArray){
      // Draw particle
      fill(p.speedColour());
      circle(p.x, p.y, DIAMETER);

      // Update state variables
      this.state.kineticEnergy += 0.5*MASS*p.speed()**2/this.state.number;
      this.stateHandle(p, this);

      // Edge detection
      if(p.x + DIAMETER/2 >= this.x + this.w || p.x - DIAMETER/2 <= this.x){
        p.dx *= -1;
      }
      if(p.y + DIAMETER/2 >= this.y + this.h || p.y - DIAMETER/2 <= this.y){
        p.dy *= -1;
      }

      // Update position
      p.x += p.dx;
      p.y += p.dy;
    }

    // Update state variables
    this.findTemp();
    this.findPressure();
  }
}

function transferHot(p, local){
  // Implements the functionality of maxwell's demon for the left box
  if(maxwell.inBounds(p.x, p.y, -DIAMETER/2) && p.speed()>=3){
    // Add particle to other box
    let newParticle = new Particle(p.x+maxwell.w+DIAMETER, p.y, p.dx, p.dy);
    bounds2.particleArray.push(newParticle);

    // Remove particle from current box
    let particleIndex = local.particleArray.indexOf(p);
    local.particleArray.splice(particleIndex, 1);
  }
}

function transferCold(p, local){
  // Implements the functionality of maxwell's demon for the right box
  if(maxwell.inBounds(p.x, p.y, -DIAMETER/2) && p.speed()<3){
    // Add particle to other box
    let newParticle = new Particle(p.x-maxwell.w-DIAMETER, p.y, p.dx, p.dy);
    bounds.particleArray.push(newParticle);

    // Remove particle from current box
    let particleIndex = local.particleArray.indexOf(p);
    local.particleArray.splice(particleIndex, 1);
  }
}

let bounds = new Simulation(50, 50, 600, 600, 600, 0, transferHot);
let bounds2 = new Simulation(700, 50, 600, 600, 600, 0, transferCold);
let maxwell = new Box(650, 275, 50, 125, 50);

function mouseWheel(event){
  // Changes the speed of the spawning gas
  if(event.delta <= 0){
    startSpeed *= startSpeed <= 10 ? 1.1 : 1;
  } 
  else {
    startSpeed /= startSpeed <= 1 ? 1 : 1.1;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(25);
}

function draw() {
  background(220);

  // Put all of this in a display state function
  fill("black");
  text(`PV = NkT`, 50, 700);
  text(`N=${bounds.state.number}`, 50, 740);
  text(`V=${round(bounds.state.volume*5.88*10**-5, 2)} μm^3`, 50, 770);
  text(`T=${round(bounds.state.temperature,2)} K`, 50, 800);
  text(`P=${round(bounds.state.pressure*2.511*10**6,2)} MPa`, 50, 830);

  text(`PV = NkT`, 700, 700);
  text(`N=${bounds2.state.number}`, 700, 740);
  text(`V=${round(bounds2.state.volume*5.88*10**-5, 2)} μm^3`, 700, 770);
  text(`T=${round(bounds2.state.temperature,2)} K`, 700, 800);
  text(`P=${round(bounds2.state.pressure*2.511*10**6,2)} MPa`, 700, 830);

  fill("grey");
  rect(maxwell.x, maxwell.y, maxwell.w, maxwell.h);

  if(mouseIsPressed && bounds.inBounds(mouseX, mouseY, DIAMETER)){
    bounds.particleArray.push(new Particle(mouseX, mouseY, random(-startSpeed, startSpeed), random(-startSpeed, startSpeed)));
  }
  if(mouseIsPressed && bounds2.inBounds(mouseX, mouseY, DIAMETER)){
    bounds2.particleArray.push(new Particle(mouseX, mouseY, random(-startSpeed, startSpeed), random(-startSpeed, startSpeed)));
  }

  bounds.update();
  bounds2.update();
}