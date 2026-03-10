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

class Simulation {
  // Simulation methods and objects
  constructor(_x=0, _y=0, _w=500, _h=500, _l=500, _thickness=5){
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
    this.l = _l;
    this.thickness = _thickness;

    this.state = {
      kineticEnergy: 0,
      pressure: 0,
      temperature: 0,
      number: 0,
      volume: 0, // Either keep this, or remove Box.volume()
    };

    this.particleArray = [];
  }

  inBounds(_x, _y, space=0){
    // Determines if a given x and y coordinate is in the bounds of the simulation.
    return _x >= this.x + space && _y >= this.y + space && _x + space <= this.x + this.w && _y + space <= this.y + this.h;
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

    this.state.kineticEnergy = 0;
    this.state.number = this.particleArray.length;
    this.state.volume = this.l * this.w * this.h;

    strokeWeight(0);
    for(let p of this.particleArray){
      // Draw particle
      fill(p.speedColour());
      circle(p.x, p.y, DIAMETER);

      this.state.kineticEnergy += 0.5*MASS*p.speed()**2/this.state.number;

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

    this.findTemp();
    this.findPressure();
  }
}

let bounds = new Simulation(100, 100, 500, 500, 500, 5);
let bounds2 = new Simulation(700, 100, 800, 800, 400, 5);

function mouseWheel(event){
  // Changes the speed of the spawning gas
  // Make this better like instantly
  if(event.delta >= 0){
    startSpeed *= 1.1;
  } 
  else {
    startSpeed /= startSpeed <= 1 ? 1 : 1.1;
  }
  update();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(25);
}

function draw() {
  background(220);

  fill("black");
  text(`PV = NkT`, 100, 700);
  text(`N=${bounds.state.number}`, 100, 740);
  text(`V=${round(bounds.state.volume*5.88*10**-5, 2)} μm^3`, 100, 770);
  //text(`KE(avg)=${round(state.kineticEnergy, 2)}`, 100, 800);
  text(`T=${round(bounds.state.temperature,2)} K`, 100, 800);
  text(`P=${round(bounds.state.pressure*2.511*10**6,2)} MPa`, 100, 830);

  strokeWeight(bounds.thickness);
  //fill("white");
  rect(bounds.x, bounds.y, bounds.w, bounds.h);
  rect(bounds2.x, bounds2.y, bounds2.w, bounds2.h);

  if(mouseIsPressed && bounds.inBounds(mouseX, mouseY, DIAMETER)){
    bounds.particleArray.push(new Particle(mouseX, mouseY));
  }
  if(mouseIsPressed && bounds2.inBounds(mouseX, mouseY, DIAMETER)){
    bounds2.particleArray.push(new Particle(mouseX, mouseY));
  }

  bounds.update();
  bounds2.update();
}
