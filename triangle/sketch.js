
let depth = 0;

let initialTriangle = [
  {x: 400, y: 55},
  {x: 25, y: 800},
  {x: 775, y: 800},
];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  sierpinski(initialTriangle, depth);
}

function mouseClicked(){
  depth++;
}

function sierpinski(points, depth){
  if(depth < 8){
    triangle(
      points[0].x, points[0].y, 
      points[1].x, points[1].y,
      points[2].x, points[2].y
    );
  } 
  else {
    return;
  }

  if(depth === 0){
    return;
  }

  sierpinski([points[0], midpoint(points[0], points[1]), midpoint(points[0], points[2])], depth-1);
  sierpinski([midpoint(points[0], points[1]), points[1], midpoint(points[1], points[2])], depth-1);
  sierpinski([midpoint(points[0], points[2]), midpoint(points[1], points[2]), points[2]], depth-1);
}

function midpoint(point1, point2){
  let midpointX = 0.5*(point1.x + point2.x);
  let midpointY = 0.5*(point1.y + point2.y);
  return {x: midpointX, y: midpointY};
}