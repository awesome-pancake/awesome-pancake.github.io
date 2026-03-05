
let tileArray = [];
const THESIZE = 50;
let prevCount = 0;

function spawnTile(x, y, tileSize){
  tileArray.push({
    x: x,
    y: y,
    size: tileSize,
    sign: random() >= 0.5
  });
}

function drawTile(tile){
  if(tile.sign){
    line(tile.x - tile.size/2, tile.y + tile.size/2, tile.x + tile.size/2, tile.y - tile.size/2);
  } 
  else {
    line(tile.x - tile.size/2, tile.y - tile.size/2, tile.x + tile.size/2, tile.y + tile.size/2);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  for(let x=THESIZE/2; x<width; x+=THESIZE){
    for(let y=THESIZE/2; y<height; y+=THESIZE){
      spawnTile(x, y, THESIZE);
    }
  }
}

function draw() {
  background("white");
  if(millis() - prevCount >= 500){
    prevCount = millis();
    tileArray = [];
    for(let x=0; x<width; x+=THESIZE){
      for(let y=0; y<height; y+=THESIZE){
        spawnTile(x, y, THESIZE);
      }
    }
  }
  for(let tile of tileArray){
    drawTile(tile);
  }
}
