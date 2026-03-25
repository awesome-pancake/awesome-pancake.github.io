// Grid Assignment
// Emmett Hoffman
// Date
//
// Extra for Experts:
// - Investigated 3D grids
// - Used the quad function

const ROOT3 = 1.7321;
const MAX_HEIGHT = 32;
const WATER_HEIGHT = MAX_HEIGHT/2-3;

const ID = {
  AIR: 0,
  GRASS: 1,
  WATER: 2,
  DIRT: 3,
  SAND: 4
};

let new_grid;
let grass_img;

class Renderer {
  constructor(){
    this.klength = 64;
    this.kwidth = 64;
    this.kheight = MAX_HEIGHT;
    this.block_grid = [[]];

    for(let i=0; i<this.klength; i++){
      this.block_grid.push([]);

      for(let j=0; j<this.kwidth; j++){
        this.block_grid[i].push([]);

        for(let k=0; k<this.kheight; k++){

          let groundLevel = floor(MAX_HEIGHT*noise(0.05*i, 0.05*j));

          if(groundLevel >= k && k >= WATER_HEIGHT){ // Spawns grass
            this.block_grid[i][j].push(ID.GRASS);
          }

          if(groundLevel < k && k < WATER_HEIGHT){ // Spawns water
            this.block_grid[i][j].push(ID.WATER);
          }

          if(groundLevel >= k && k < WATER_HEIGHT){ // Spawns dirt
            this.block_grid[i][j].push(ID.DIRT);
          }

          if(groundLevel === k && k < WATER_HEIGHT){ // Spawns sand
            this.block_grid[i][j].push(ID.SAND);
          }
        }
      }
    }
  }

  draw_block(gridX, gridY, gridZ, type, scale){ // Draws a block of a certain type at a given coordinate
    // Isometric projection
    let x = sqrt(3)*(gridX-gridY)/2;
    let y = (gridX+gridY-2*gridZ)/2;

    // Place the thing in the middle of the screen
    x = scale*x + 1.5*scale*this.kwidth;
    y = scale*y + 0.5 * scale * this.kwidth;

    // Initialize the colours
    let topColor = color(255, 0);
    let sideColor = color(255, 0);

    // Selects the proper colours for each type of block
    switch(type){
    case ID.GRASS: // Grass colours
      topColor = color(0, 10*gridZ, 50, 255);
      sideColor = color(5*gridZ, 5*gridZ, 50, 255);
      break;
    case ID.WATER: // Water colours
      topColor = color(10, 30, 220, gridZ < WATER_HEIGHT ? 0 : 63);
      sideColor = color(0, 0, 0, 0);
      break;
    case ID.DIRT: // Dirt colours
      topColor = color(5*gridZ, 5*gridZ, 50, 255);
      sideColor = color(5*gridZ, 5*gridZ, 50, 255);
      break;
    case ID.SAND: // Sand colours
      topColor = color(10*gridZ, 10*gridZ, 50, 255);
      sideColor = color(10*gridZ, 10*gridZ, 50, 255);
      break;
    }

    fill(sideColor);
    quad( // Right face
      x, y,
      x + scale * ROOT3 / 2, y - scale / 2,
      x + scale * ROOT3 / 2, y + scale / 2,
      x, y + scale
    );

    quad( // Left face
      x, y,
      x - scale * ROOT3 / 2, y - scale / 2,
      x - scale * ROOT3 / 2, y + scale / 2,
      x, y + scale
    );

    fill(topColor);
    quad( // Top face
      x, y,
      x + scale * ROOT3 / 2, y - scale / 2,
      x, y - scale,
      x - scale * ROOT3 / 2, y - scale / 2
    );
  }

  draw_blocks_3D(){
    for(let i=0; i<this.klength; i++){
      for(let j=0; j<this.kwidth; j++){
        for(let k=0; k<this.kheight; k++){
          this.draw_block(i, j, k, this.block_grid[i][j][k], 10);
        }
      }
    }
  }
}

function preload(){
  // Load grass image, dirt background image
}

function setup() {
  noStroke();
  canvas = createCanvas(windowWidth, windowHeight);
  new_grid = new Renderer();
  new_grid.draw_blocks_3D();
}

function draw() {
}