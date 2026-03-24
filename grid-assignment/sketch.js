// Project Title
// Emmett Hoffman
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

const LENGTH = 64;
const WIDTH = 64;

let new_grid;
let grass_img;

class Chunk {
  constructor(){
    this.block_grid = [[]];

    for(let i=0; i<LENGTH; i++){
      this.block_grid.push([]);
      for(let j=0; j<WIDTH; j++){
        this.block_grid[i].push(floor(8*noise(0.1*i, 0.1*j)));
      }
    }
  }

  draw_blocks(){
    for(let i=0; i<LENGTH; i++){
      for(let j=0; j<WIDTH; j++){
        fill(color(25*this.block_grid[i][j], 255));
        rect(i*10, j*10, 10, 10);
      }
    }
  }

  draw_blocks_3D(){
    for(let i=0; i<LENGTH; i++){
      for(let j=0; j<WIDTH; j++){
        // Isometric projection
        // TODO: make this start drawing at the top
        let x = sqrt(3)*(i+j)/2;
        let y = (i-j-this.block_grid[i][j])/2;

        fill(color(0, 25*this.block_grid[i][j], 50, 255));
        rect(x*10, y*10+height/2, 10, 10);
      }
    }
  }
}

function preload(){
  // Load grass image, dirt background image
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  new_grid = new Chunk();
}

function draw() {
  background(220);
  new_grid.draw_blocks_3D();
  //console.log(new_grid.block_grid);
}
