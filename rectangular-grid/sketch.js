

const CELL_SIZE = 10;
let grid = [];
let rows;
let cols;
let running = false;

function setup() {
  createCanvas(windowWidth, windowHeight);

  rows = floor(height/CELL_SIZE) + 2;
  cols = floor(width/CELL_SIZE) + 2;

  create_random_grid();
}

function draw() {
  noStroke();
  background(220);
  draw_grid();
  if(running){
    grid = update_grid();
  }
}

function mousePressed(){
  cellX = floor(mouseX/CELL_SIZE)+1;
  cellY = floor(mouseY/CELL_SIZE)+1;

  grid[cellX][cellY] = grid[cellX][cellY] === 1 ? 0 : 1;
}

function keyPressed(){
  if(key === "r"){
    running = !running;
  }
}

function create_random_grid(){
  for(let i=0; i<cols; i++){
    grid.push([]);
    for(let j=0; j<rows; j++){
      grid[i].push(0);
    }
  }

  console.log(grid);
}

function draw_grid(){
  for(let i=1; i<cols-1; i++){
    for(let j=1; j<rows-1; j++){
      fill(grid[i][j] === 1 ? "black" : "white");
      rect(CELL_SIZE*(i-1), CELL_SIZE*(j-1), CELL_SIZE, CELL_SIZE);
    }
  }
}

function update_grid(){
  let new_grid = structuredClone(grid);

  for(let i=1; i<cols-1; i++){
    for(let j=1; j<rows-1; j++){
      if(count_neighbours(i, j, grid) >= 4){
        new_grid[i][j] = 0;
      }
      else if(count_neighbours(i, j, grid) < 2){
        new_grid[i][j] = 0;
      } 
      else if (count_neighbours(i, j, grid) === 3){
        new_grid[i][j] = 1;
      }
    }
  }

  return new_grid;
}

function count_neighbours(x, y, reference){
  return reference[x-1][y-1] +
    reference[x-1][y] +
    reference[x-1][y+1] +
    reference[x][y-1] +
    reference[x][y+1] +
    reference[x+1][y-1] +
    reference[x+1][y] +
    reference[x+1][y+1];
}