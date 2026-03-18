
let grid = [
  [false, false, true, false],
  [true, false, true, false],
  [false, true, false, false],
  [false, true, false, true]
];

const SCALE = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function mousePressed(){
  let cellX = floor(mouseX / SCALE);
  let cellY = floor(mouseY / SCALE);

  grid[cellY][cellX] = !grid[cellY][cellX];
}

function draw() {
  background(220);
  for(let i=0; i<grid.length; i++){
    for(let j=0; j<grid[0].length; j++){
      fill(grid[i][j] ? "black" : "white");
      rect(SCALE*j, SCALE*i, SCALE, SCALE);
    }
  }
}
