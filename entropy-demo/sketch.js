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
// 1 mass unit = 1 AMU = 6.022x10^-26 kg
const DIAMETER = 10; // Diameter of each particle in pixels
const MASS = 4; // Mass of each particle in AMU
const K = 0.1; // Boltzmann constant
let startSpeed = 5;

let totalWidth = 0;
let totalHeight = 0;

let leftBox;
let rightBox;
let maxwell;

function setup() {
  createCanvas(windowWidth, windowHeight);
  totalWidth = windowWidth;
  totalHeight = windowHeight;

  leftBox = new Simulation(0.1, 0.1, 0.3, 0.5, transferHot);
  rightBox = new Simulation(0.5, 0.1, 0.3, 0.5, transferCold);
  maxwell = new Box(0.4, 0.5, 0.1, 0.1); // Named after Maxwell's demon: https://en.wikipedia.org/wiki/Maxwell%27s_demon
}

class Particle {
  // Methods and objects for particles
  constructor(_x, _y, _dx, _dy){
    this.xPos = _x;
    this.yPos = _y;
    this.xSpeed = _dx;
    this.ySpeed = _dy;
  }

  speed(){
    // Returns the speed of the particle
    return sqrt(this.xSpeed**2 + this.ySpeed**2);
  }

  speedColour(){
    // Returns a colour that changes based on the speed of the particle
    return color(
      90*this.speed(), 
      60, 
      255-30*this.speed()
    );
  }
}

class Box {
  constructor(_x=0, _y=0, _w, _h){
    // Some values for a box
    this.xPos = Math.round(_x * width);
    this.yPos = Math.round(_y * height);

    this.xPer = _w;
    this.yPer = _h;

    this.height = Math.round(_h * height);
    this.width = Math.round(_w * width);
  }

  inBounds(_x, _y, space=0){
    // Determines if a given x and y coordinate is in the leftBox of the box.
    return _x >= this.xPos+ space && _y >= this.yPos + space && _x + space <= this.xPos + this.width && _y + space <= this.yPos + this.height;
  }

  draw(){
    // Draws the box
    strokeWeight(0);
    fill("black");
    rect(this.xPos, this.yPos, this.width, this.height);
  }
}

class Simulation extends Box {
  constructor(_x=0, _y=0, _w=0.3, _h=0.3, _handle=function(){}){
    // Creates a new simulation object
    super(_x, _y, _w, _h); // Creates background box

    // Implements a handler that modifies the state of each particle on each simulation tick
    if(typeof _handle === "function"){
      this.stateHandle = _handle;
    }
    else {
      throw new Error("stateHandle must be a function");
    }

    this.particleArray = [];
  }

  update(){
    // Updates the state of each particle and draws them

    // Draw box background
    this.draw();

    strokeWeight(0);
    for(let p of this.particleArray){
      // Draw particle
      fill(p.speedColour());
      circle(p.xPos, p.yPos, DIAMETER);

      // Update state variables
      //this.state.kineticEnergy += 0.5*MASS*p.speed()**2/this.state.number;
      this.stateHandle(p, this);

      // Edge detection
      if(p.xPos + DIAMETER/2 >= this.xPos + this.width || p.xPos - DIAMETER/2 <= this.xPos){
        p.xSpeed *= -1;
      }
      if(p.yPos + DIAMETER/2 >= this.yPos + this.height || p.yPos - DIAMETER/2 <= this.yPos){
        p.ySpeed *= -1;
      }

      // Update position
      p.xPos += p.xSpeed;
      p.yPos += p.ySpeed;
    }
  }
}

function transferHot(p, local){
  // Implements the functionality of maxwell's demon for the left box
  if(maxwell.inBounds(p.xPos, p.yPos, -DIAMETER/2) && p.speed()>=3){
    // Add particle to other box
    let newParticle = new Particle(p.xPos+maxwell.width+DIAMETER, p.yPos, p.xSpeed, p.ySpeed);
    rightBox.particleArray.push(newParticle);

    // Remove particle from current box
    let particleIndex = local.particleArray.indexOf(p);
    local.particleArray.splice(particleIndex, 1);
  }
}

function transferCold(p, local){
  // Implements the functionality of maxwell's demon for the right box
  if(maxwell.inBounds(p.xPos, p.yPos, -DIAMETER/2) && p.speed()<3){
    // Add particle to other box
    let newParticle = new Particle(p.xPos-maxwell.width-DIAMETER, p.yPos, p.xSpeed, p.ySpeed);
    leftBox.particleArray.push(newParticle);

    // Remove particle from current box
    let particleIndex = local.particleArray.indexOf(p);
    local.particleArray.splice(particleIndex, 1);
  }
}

function mouseWheel(event){
  // Changes the speed of the spawning gas
  if(event.delta <= 0){
    startSpeed *= startSpeed <= 8 ? 1.1 : 1;
  } 
  else {
    startSpeed /= startSpeed <= 1 ? 1 : 1.1;
  }
}

// Objects for both simulations, as well as the box separating them.

function draw() {
  background(255);

  // Places down new particles in each box
  if(mouseIsPressed && leftBox.inBounds(mouseX, mouseY, DIAMETER)){
    leftBox.particleArray.push(new Particle(mouseX, mouseY, random(-startSpeed, startSpeed), random(-startSpeed, startSpeed)));
  }
  if(mouseIsPressed && rightBox.inBounds(mouseX, mouseY, DIAMETER)){
    rightBox.particleArray.push(new Particle(mouseX, mouseY, random(-startSpeed, startSpeed), random(-startSpeed, startSpeed)));
  }

  // Draws each box and updates their states
  leftBox.update();
  rightBox.update();
  maxwell.draw();
}