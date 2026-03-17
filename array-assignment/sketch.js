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
  constructor(_x=0, _y=0, _w=500, _h=500, _l=500, _colour="black"){
    // Some values for a box
    this.xPos = _x;
    this.yPos = _y;
    this.width = _w;
    this.height = _h;
    this.length = _l;
    this.colour = _colour;
  }

  inBounds(_x, _y, space=0){
    // Determines if a given x and y coordinate is in the leftBox of the box.
    return _x >= this.xPos+ space && _y >= this.yPos + space && _x + space <= this.xPos + this.width && _y + space <= this.yPos + this.height;
  }

  draw(){
    // Draws the box
    strokeWeight(this.thickness);
    fill(this.colour);
    rect(this.xPos, this.yPos, this.width, this.height);
  }
}

class Simulation extends Box {
  constructor(_colour, _x=0, _y=0, _w=500, _h=500, _l=500, _thickness=5, _handle=function(){}){
    // Creates a new simulation object
    super(_x, _y, _w, _h, _l, _colour); // Creates background box
    this.thickness = _thickness;

    // Object holding state variables for the gas
    this.state = {
      kineticEnergy: 0,
      pressure: 0,
      temperature: 0,
      number: 0,
      volume: 0,
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

    // Draw box background
    this.draw();

    // Set state variables
    this.state.kineticEnergy = 0;
    this.state.number = this.particleArray.length;
    this.state.volume = this.length * this.width * this.height;

    strokeWeight(0);
    for(let p of this.particleArray){
      // Draw particle
      fill(p.speedColour());
      circle(p.xPos, p.yPos, DIAMETER);

      // Update state variables
      this.state.kineticEnergy += 0.5*MASS*p.speed()**2/this.state.number;
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

    // Update state variables
    this.findTemp();
    this.findPressure();
  }

  displayState(){
    // Displays the emergent states of the gas in a given simulation
    fill("black");
    text(`PV = NkT`, this.xPos, this.height + this.yPos + 50);                                            // Formula
    text(`N=${this.state.number}`, this.xPos, this.height + this.yPos + 90);                              // Number of molecules
    text(`V=${round(this.state.volume*5.88*10**-5, 2)} μm^3`, this.xPos, this.height + this.yPos + 120);  // Volume
    text(`T=${round(this.state.temperature,2)} K`, this.xPos, this.height + this.yPos + 150);             // Temperature
    text(`P=${round(this.state.pressure*2.511*10**6,2)} MPa`, this.xPos, this.height + this.yPos + 180);  // Pressure
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

// Objects for both simulations, as well as the box separating them.
let leftBox = new Simulation("black", 50, 50, 600, 600, 600, 0, transferHot);
let rightBox = new Simulation("black", 700, 50, 600, 600, 600, 0, transferCold);
let maxwell = new Box(650, 275, 50, 125, 50, "grey"); // Named after Maxwell's demon: https://en.wikipedia.org/wiki/Maxwell%27s_demon

function mouseWheel(event){
  // Changes the speed of the spawning gas
  if(event.delta <= 0){
    startSpeed *= startSpeed <= 8 ? 1.1 : 1;
  } 
  else {
    startSpeed /= startSpeed <= 1 ? 1 : 1.1;
  }
}

function windowResized(){
  // Resizes the window
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(25);
}

function draw() {
  background(255);

  // Little piece of text that is displayed at the bottom
  fill("grey");
  text("Scroll to change incoming gas temperature!", 50, 900);

  // Places down new particles in each box
  if(mouseIsPressed && leftBox.inBounds(mouseX, mouseY, DIAMETER)){
    leftBox.particleArray.push(new Particle(mouseX, mouseY, random(-startSpeed, startSpeed), random(-startSpeed, startSpeed)));
  }
  if(mouseIsPressed && rightBox.inBounds(mouseX, mouseY, DIAMETER)){
    rightBox.particleArray.push(new Particle(mouseX, mouseY, random(-startSpeed, startSpeed), random(-startSpeed, startSpeed)));
  }

  // Displays the emergent states of each box
  leftBox.displayState();
  rightBox.displayState();

  // Draws each box and updates their states
  leftBox.update();
  rightBox.update();
  maxwell.draw();
}