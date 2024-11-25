// Main sketch file
let stars = [];
let constellations = [];
let planets = [];
let shootingStars = [];
let userConstellation = [];
let showConstellations = true;
let isDrawing = false;
let scaleFactor = 1;
let minScale = 0.5;
let maxScale = 2;
let backgroundGraphics;

function setup() {
  createCanvas(windowWidth, windowHeight);
  backgroundGraphics = createGraphics(width, height);
  drawBackgroundGraphics();

  generateStars(300);
  generateConstellations(15);
  generatePlanets(3);

  // Set up UI elements
  select('#toggleConstellations').mousePressed(() => {
    showConstellations = !showConstellations;
  });

  select('#saveImage').mousePressed(saveCanvasImage);
}

function draw() {
  background(0);
  push();
  scale(scaleFactor);
  image(backgroundGraphics, 0, 0);
  drawStars();
  drawPlanets();
  if (showConstellations) {
    drawConstellations();
  }
  drawUserConstellation();
  updateShootingStars();
  drawShootingStars();
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  backgroundGraphics.resizeCanvas(width, height);
  drawBackgroundGraphics();
  generateStars(300);
  generateConstellations(15);
  generatePlanets(3);
}
