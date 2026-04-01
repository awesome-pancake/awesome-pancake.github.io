// Grid Assignment
// Emmett Hoffman
// Date
//
// Extra for Experts:
// - Investigated 3D arrays
// - Used the quad function

const ROOT3 = 1.7321;
const SCALE = 0.005;

let PARAMETERS = {
  MAX_HEIGHT: 32,
  WATER_HEIGHT: 13,
  STONE_HEIGHT: 3,
  FREQUENCY: 0.05,
  Z_NOISE: 0,
  X_OFFSET: 0,
  Y_OFFSET: 0
};

// Used as an enum for the different block types.
const ID = {
  AIR: 0,
  GRASS: 1,
  WATER: 2,
  DIRT: 3,
  SAND: 4,
  STONE: 5
};

let new_grid;

class Renderer {
  constructor(x, y){
    // On-screen position
    // TODO: make this actually the on screen position
    this.xPos = x;
    this.yPos = y;

    // Define some parameters about the world
    this.klength = 64;
    this.kwidth = 64;
    this.kheight = PARAMETERS.MAX_HEIGHT;
    this.block_grid = [[]];

    // Builds the block grid
    for(let i=0; i<this.klength; i++){
      this.block_grid.push([]);

      for(let j=0; j<this.kwidth; j++){
        this.block_grid[i].push([]);

        // Sets the ground level of the world
        let groundLevel = floor(PARAMETERS.MAX_HEIGHT*noise(
          PARAMETERS.FREQUENCY*(i+this.xPos) + PARAMETERS.X_OFFSET, 
          PARAMETERS.FREQUENCY*(j+this.yPos) + PARAMETERS.Y_OFFSET, 
          PARAMETERS.FREQUENCY*PARAMETERS.Z_NOISE
        ));

        for(let k=0; k<this.kheight; k++){

          if(groundLevel === k && k > PARAMETERS.WATER_HEIGHT){ // Spawns grass
            this.block_grid[i][j].push(ID.GRASS);
          }
          else if(groundLevel < k && k <= PARAMETERS.WATER_HEIGHT){ // Spawns water
            this.block_grid[i][j].push(ID.WATER);
          }
          else if(groundLevel > k && groundLevel - PARAMETERS.STONE_HEIGHT < k){ // Spawns dirt
            this.block_grid[i][j].push(ID.DIRT);
          }
          else if(groundLevel - PARAMETERS.STONE_HEIGHT >= k){ // Spawns stone
            this.block_grid[i][j].push(ID.STONE);
          }
          else if(groundLevel === k && k <= PARAMETERS.WATER_HEIGHT){ // Spawns sand
            this.block_grid[i][j].push(ID.SAND);
          }
        }
      }
    }
  }

  draw_block(gridX, gridY, gridZ, type){
    // Draws a block of a certain type at a given coordinate

    // Isometric projection
    let x = sqrt(3)*(gridX + this.xPos - gridY - this.yPos)/2;
    let y = (gridX + this.xPos + this.yPos + gridY - 2*gridZ)/2;

    // Scale the stuff and put it in the right spot
    let scale = SCALE*width;
    x = scale*x + width/2;
    y = scale*y + scale*PARAMETERS.MAX_HEIGHT;

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
      topColor = color(10, 30, 220, gridZ < PARAMETERS.WATER_HEIGHT ? 0 : 60);
      sideColor = color(0, 0, 0, 0);
      break;
    case ID.DIRT: // Dirt colours
      topColor = color(5*gridZ, 5*gridZ, 50-5*gridZ, 255);
      sideColor = color(5*gridZ, 5*gridZ, 50-5*gridZ, 255);
      break;
    case ID.SAND: // Sand colours
      topColor = color(10*gridZ, 10*gridZ, 50, 255);
      sideColor = color(10*gridZ, 10*gridZ, 50, 255);
      break;
    case ID.STONE: // Stone colours
      topColor = color(7*gridZ, 7*gridZ, 7*gridZ, 255);
      sideColor = color(7*gridZ, 7*gridZ, 7*gridZ, 255);
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
        this.draw_block(i, j, topBlock-2, this.block_grid[i][j][topBlock-2]);
        this.draw_block(i, j, topBlock-1, this.block_grid[i][j][topBlock-1]);
        this.draw_block(i, j, topBlock, this.block_grid[i][j][topBlock]);

        // TODO: only draw a block under another block if it is exposed to air.
      }
    }
  }
}

function setup() {
  noStroke();
  createCanvas(windowWidth, windowHeight);
  background(220);

  new_grid = new Renderer(0, 0);
  new_grid.update();

  // Initialize the sliders
  frequencySlider = createSlider(0, 0.1, 0.05, 0.001);
  heightSlider = createSlider(0, 48, 32, 1);
  waterHeightSlider = createSlider(0, 32, 13, 1);
  stoneHeightSlider = createSlider(0, 10, 3, 1);
  zNoiseSlider = createSlider(0, 20, 0, 0.1);
  xOffsetSlider = createSlider(0, 5, 0, 0.01);
  yOffsetSlider = createSlider(0, 5, 0, 0.01);
  
  // Position the sliders
  frequencySlider.position(10, 10);
  heightSlider.position(10, 30);
  waterHeightSlider.position(10, 50);
  stoneHeightSlider.position(10, 70);
  zNoiseSlider.position(10, 90);
  xOffsetSlider.position(10, 110);
  yOffsetSlider.position(10, 130);
}

function draw(){
  if(mouseIsPressed){
    background(220);
    PARAMETERS.FREQUENCY = frequencySlider.value();
    PARAMETERS.MAX_HEIGHT = heightSlider.value();
    PARAMETERS.WATER_HEIGHT = waterHeightSlider.value();
    PARAMETERS.STONE_HEIGHT = stoneHeightSlider.value();
    PARAMETERS.Z_NOISE = zNoiseSlider.value();
    PARAMETERS.X_OFFSET = xOffsetSlider.value();
    PARAMETERS.Y_OFFSET = yOffsetSlider.value();
    new_grid = new Renderer(0, 0);
    new_grid.update();
  }
}