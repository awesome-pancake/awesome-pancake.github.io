// Grid Assignment
// Emmett Hoffman
// Date
//
// Extra for Experts:
// - 

const ROOT3 = 1.7321;

let new_grid;
let grass_img;

class Renderer {
  constructor(){
    this.klength = 64;
    this.kwidth = 64;
    this.block_grid = [[]];

    for(let i=0; i<this.klength; i++){
      this.block_grid.push([]);
      for(let j=0; j<this.kwidth; j++){
        this.block_grid[i].push(4+floor(16*noise(0.05*i, 0.05*j)));
      }
    }
  }

  draw_block(gridX,gridY,scale){
    // Isometric projection
    let x = sqrt(3)*(gridX-gridY)/2;
    let y = (gridX+gridY-2*this.block_grid[gridX][gridY])/2;

    x = scale*x + 1.5*scale*this.kwidth;
    y = scale*y + 0.5 * scale * this.kwidth;

    fill(color(5*this.block_grid[gridX][gridY], 5*this.block_grid[gridX][gridY], 50, 255));
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

    fill(color(0, 10*this.block_grid[gridX][gridY], 50, 255));
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
        this.draw_block(i, j, 10);
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