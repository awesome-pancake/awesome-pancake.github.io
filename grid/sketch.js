
let grid = [
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false],
  [false, false, false, false, false, false, false, false]
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

function convertToHex(){
  let newGrid = "{";
  for(let i=0; i<grid.length; i++){
    let value = 0;
    for(let x=0; x<grid[i].length; x++){
      value += grid[i][x] ? 2**(7-x) : 0;
    }
    newGrid += "0x" + hex(value, 2) + ", ";
  }
  output = newGrid.slice(0, newGrid.length - 2);
  output += "}";
  return output;
}

function draw() {
  background(220);
  for(let i=0; i<grid.length; i++){
    for(let j=0; j<grid[0].length; j++){
      fill(grid[i][j] ? "black" : "white");
      rect(SCALE*j, SCALE*i, SCALE, SCALE);
    }
  }

  if(keyIsDown(UP_ARROW)){
    console.log(convertToHex());
  }
}
