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
const SCALE = 0.005;

// Used as an enum for the different block types.
const ID = {
  AIR: 0,
  GRASS: 1,
  WATER: 2,
  DIRT: 3,
  SAND: 4
};

let new_grid;

class Renderer {
  constructor(x, y){
    this.xPos = x;
    this.yPos = y;

    this.klength = 64;
    this.kwidth = 64;
    this.kheight = MAX_HEIGHT;
    this.block_grid = [[]];

    for(let i=0; i<this.klength; i++){
      this.block_grid.push([]);

      for(let j=0; j<this.kwidth; j++){
        this.block_grid[i].push([]);
        let groundLevel = floor(MAX_HEIGHT*noise(0.05*(i+this.xPos), 0.05*(j+this.yPos))); // Sets the ground level for the world

        for(let k=0; k<this.kheight; k++){

          if(groundLevel === k && k > WATER_HEIGHT){ // Spawns grass
            this.block_grid[i][j].push(ID.GRASS);
          }

          if(groundLevel < k && k <= WATER_HEIGHT){ // Spawns water
            this.block_grid[i][j].push(ID.WATER);
          }

          if(groundLevel > k){ // Spawns dirt
            this.block_grid[i][j].push(ID.DIRT);
          }

          if(groundLevel === k && k <= WATER_HEIGHT){ // Spawns sand
            this.block_grid[i][j].push(ID.SAND);
          }
        }
      }
    }
  }

  draw_block(gridX, gridY, gridZ, type){ // Draws a block of a certain type at a given coordinate
    // Isometric projection
    let x = sqrt(3)*(gridX + this.xPos - gridY - this.yPos)/2;
    let y = (gridX + this.xPos + this.yPos + gridY - 2*gridZ)/2;

    // Scale the stuff
    let scale = SCALE*width;
    x = scale*x + width/2;
    y = scale*y + scale*MAX_HEIGHT;

    // Initialize the colours
    let topColor = color(255, 0);
    let sideColor = color(255, 0);

    // Selects the proper colours for each type of block
    // TODO: make colours cap at a certain height.
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
    default:
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

  async update(){
    for(let i=0; i<this.klength; i++){ // Loops through x values
      for(let j=0; j<this.kwidth; j++){ // Loops through y values

        // Sets the top level to look at
        let topBlock = this.block_grid[i][j].length - 1;
        
        if(i === this.klength-1){ // Draws the rightmost wall
          for(let k = 0; k < topBlock; k++){
            this.draw_block(i, j, k, this.block_grid[i][j][k]);
          }
        }
        else if(j === this.kwidth-1){ // Draws the leftmost wall
          for(let k = 0; k < topBlock; k++){
            this.draw_block(i, j, k, this.block_grid[i][j][k]);
          }
        }

        // Draws water
        if(this.block_grid[i][j][topBlock] === ID.WATER){
          this.draw_block(i, j, topBlock, this.block_grid[i][j][topBlock]);
        }

        // Descends to seafloor
        while(this.block_grid[i][j][topBlock] === ID.WATER){
          topBlock--;
        }
        
        // Draws the top three layers of ground
        this.draw_block(i, j, topBlock-2, this.block_grid[i][j][topBlock-1]);
        this.draw_block(i, j, topBlock-1, this.block_grid[i][j][topBlock-1]);
        this.draw_block(i, j, topBlock, this.block_grid[i][j][topBlock]);

        // TODO: only draw a block under another block if it is exposed to air.
      }
    }
  }
}

function setup() {
  noStroke();
  noLoop();
  createCanvas(windowWidth, windowHeight);
  background(220);
  new_grid = new Renderer(0, 0);
  new_grid.update();
}

function mousePressed(){
  console.log("Sigmatic!");
  background(220);
  new_grid.block_grid[10][10].push(ID.DIRT);
  new_grid.update();
}