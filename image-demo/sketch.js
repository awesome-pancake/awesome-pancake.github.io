
let churchImg;

function preload(){
  churchImg = loadImage("church.png");
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

function draw() {
  background(220);
  image(churchImg, mouseX, mouseY, 0.5*churchImg.width, 0.5*churchImg.height);
}
