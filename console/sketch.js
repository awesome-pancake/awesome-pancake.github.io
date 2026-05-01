
let con;

function preload(){
  font = loadFont("SpaceMono-Regular.ttf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);
  con = new Con(240, 25, 11);
}

function draw() {
  background(220);
  con.fillPerlin();
  con.display();
}

class Con {
  constructor(textColour, bkColour, fontSize){
    this.buffer = [];
    this.colour = textColour;
    this.back = bkColour;
    this.size = fontSize;
    this.brightness = "@%#*/|=:-,.`    ";
    this.xWidth = 1.75*width/this.size;
    this.yHeight = height/this.size;

    for(let j=0; j<this.yHeight; j++){
      this.buffer.push([]);
      for(let i=0; i<this.xWidth; i++){
        this.buffer[j].push(' ');
      }
    }
  }

  display(){
    textSize(this.size);
    fill(this.colour);
    background(this.back);

    for(let i=0; i<this.yHeight; i++){
      for(let j=0; j<this.xWidth; j++){
        text(this.buffer[i][j], j*this.size/1.75, i*this.size);
      }
    }
  }

  setch(character, x, y){
    this.buffer[y][x] = character;
  }

  fillPerlin(){
    for(let i=0; i<this.yHeight; i++){
      for(let j=0; j<this.xWidth; j++){
        const SCALE = 0.1;

        let index = round((this.brightness.length-1)*noise(SCALE*i,SCALE*j));
        let value = this.brightness[index];
        this.setch(value, j, i);
      }
    }
  }
}