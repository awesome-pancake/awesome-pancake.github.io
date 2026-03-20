// Project Title
// Emmett Hoffman
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Using an object as a kind of enum
const BlockTypes = {
  AIR: 0,
  GRASS: 1,
  DIRT: 2
};

class Block {
  Block(type){
    this.id = type;
  }
}

class BlockGroup {
  BlockGroup(){
    this.blocks = [];
    for(let x=0; x<10; x++){
      this.blocks.push([]);
      for(let y=0; y<10; y++){
        this.blocks[x].push([]);
        for(let y=0; y<10; y++){
          this.blocks[x][y].push(new Block(BlockTypes.AIR));
        }
      }
    }
  }

  add_block(block, x, y, z){
    this.blocks[x][y][z] = push(block);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
}
