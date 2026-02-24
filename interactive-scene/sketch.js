// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

// Parameters for the gridlines
let zoom=10;
let lineSpacingX;
let lineSpacingY;

// Variables relating to the user enterred function
let func = "1x^3 + 5x^2 -8";
let eqInput;
let plotButton;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Creates the input bar
  eqInput = createInput();
  eqInput.position(10, 10);
  
  // Creates the plot button
  plotButton = createButton("Plot");
  plotButton.position(10, 40);
  plotButton.mousePressed(buttonHandle);
  
  update();
}

function update(){
  // Called every time the screen is updated
  lineSpacingX = (width/2-20)/zoom;
  lineSpacingY = (height/2-20)/zoom;
  
  background(250);
  drawGraph();
  plotPoints();
}

function buttonHandle(){
  // Handles button presses
  func = eqInput.value();
  update();
}

function windowResized() {
  // Resizes canvas based on window dimensions
  resizeCanvas(windowWidth, windowHeight);
  update();
}

function mouseWheel(){
  // Control the zoom of the graph
  if(event.delta > 0 && zoom <= 60){
    zoom *= 1.1;
  } else if (event.delta < 0 && zoom >= 1.5){
    zoom /= (zoom !== 1) ? 1.1 : 1;
  }
  update();
}

function drawGraph(){
  // Draw grid lines
  let lastDrawn = 0;
  
  stroke("lightgrey");
  strokeWeight(1);
  for(let x=0; x<=width/2; x+=1){ // Draw vertical lines
    if((x-lastDrawn)*lineSpacingX>=(width/2-20)/15){
      line(x*lineSpacingX + width/2, 10, x*lineSpacingX + width/2, height-10);
      line(-x*lineSpacingX + width/2, 10, -x*lineSpacingX + width/2, height-10);

      // Add numbers to the axis
      text(x.toString(), x*lineSpacingX + width/2 + 5, height/2+15);
      text((-x).toString(), -x*lineSpacingX + width/2 + 5, height/2+15);
      
      lastDrawn = x;
    }
  }
  
  lastDrawn = 0;
  for(let y=0; y<=height/2; y+=1){ // Draw horizontal lines
    if((y-lastDrawn)*lineSpacingY>=(height/2-20)/15){
      line(10, y*lineSpacingY + height/2, width-10, y*lineSpacingY + height/2);
      line(10, -y*lineSpacingY + height/2, width-10, -y*lineSpacingY + height/2);

      // Add numbers to the axis
      text(y.toString(), width/2+5, -y*lineSpacingY + height/2 + 15);
      text((-y).toString(), width/2+5, y*lineSpacingY + height/2 + 15);
      lastDrawn = y;
    }
  }
  
  // Plot axes
  stroke("black");
  strokeWeight(2);
  line(10, height/2, width-10, height/2);
  line(width/2, 10, width/2, height-10);
}

function plotPoints(){
  // Plot points of the graph
  // Rewrite this soon
  let y;
  let nextY;
  let dx = 0.1;
  
  // Plot function 2
  stroke(210,80,80);
  strokeWeight(3);
  for(let x=-zoom; x<=zoom; x+=dx){
    y = evaluateFunc(x);
    nextY = evaluateFunc(x+dx);
    
    if(math.abs(nextY - y) >= 40){
      stroke("grey");
      strokeWeight(1);
    } else {
      stroke(210,80,80);
      strokeWeight(3);
    }
    
    line(x*lineSpacingX + width/2, -y*lineSpacingY + height/2,
      (x+dx)*lineSpacingX + width/2, -nextY*lineSpacingY + height/2);
  }
}

function evaluateFunc(x){
  // Uses math.js to evaluate a user-enterred function at a point.
  let newFunc = "";
  for (let character of func){
    newFunc += (character === "x") ? "(" + x.toString() + ")" : character;
  }
  return math.evaluate(newFunc);
}