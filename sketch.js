// Celestial Maps
// Developed by Chime

// Global variables
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
let bgGraphics;

function setup() {
  // Set up canvas
  createCanvas(windowWidth, windowHeight);

  // Create offscreen graphics for background to improve performance
  bgGraphics = createGraphics(width, height);
  drawBackground();

  // Generate initial celestial elements
  generateStars(300);
  generateConstellations(15);
  generatePlanets(3);

  // Set up UI elements
  let toggleBtn = select('#toggleConstellations');
  toggleBtn.mousePressed(() => {
    showConstellations = !showConstellations;
  });

  let saveBtn = select('#saveImage');
  saveBtn.mousePressed(saveCurrentCanvas);
}

function draw() {
  background(0);

  // Apply scaling for zooming
  push();
  scale(scaleFactor);

  // Draw the background
  image(bgGraphics, 0, 0);

  // Draw stars and planets
  drawStars();
  drawPlanets();

  // Draw constellations if toggled on
  if (showConstellations) {
    drawConstellations();
  }

  // Draw user-created constellation
  drawUserConstellation();

  // Update and draw shooting stars
  updateShootingStars();
  drawShootingStars();

  pop();
}

// Function to draw the gradient background
function drawBackground() {
  for (let y = 0; y < height; y++) {
    let n = map(y, 0, height, 0, 1);
    let newc = lerpColor(color(10, 20, 50), color(0, 0, 0), n);
    bgGraphics.stroke(newc);
    bgGraphics.line(0, y, width, y);
  }
}

// Function to generate stars
function generateStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    let star = {
      x: random(width),
      y: random(height),
      size: random(1, 3),
      baseBrightness: random(150, 255),
      brightness: 255,
      twinkleSpeed: random(0.01, 0.05)
    };
    stars.push(star);
  }
}

// Function to draw stars
function drawStars() {
  noStroke();
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    // Twinkling effect
    star.brightness = star.baseBrightness + sin(frameCount * star.twinkleSpeed) * 50;
    fill(star.brightness);
    ellipse(star.x, star.y, star.size);
  }
}

// Function to generate constellations
function generateConstellations(count) {
  constellations = [];
  for (let i = 0; i < count; i++) {
    let constellation = [];
    let numStars = floor(random(3, 6)); // Each constellation has 3-5 stars
    for (let j = 0; j < numStars; j++) {
      let star = random(stars);
      constellation.push(star);
    }
    constellations.push(constellation);
  }
}

// Function to draw constellations
function drawConstellations() {
  stroke(255, 150);
  strokeWeight(1);
  for (let i = 0; i < constellations.length; i++) {
    let constellation = constellations[i];
    for (let j = 0; j < constellation.length - 1; j++) {
      let star1 = constellation[j];
      let star2 = constellation[j + 1];
      line(star1.x, star1.y, star2.x, star2.y);
    }
  }
}

// Function to generate planets
function generatePlanets(count) {
  planets = [];
  for (let i = 0; i < count; i++) {
    let planet = {
      x: random(width),
      y: random(height / 2), // Upper half of the sky
      size: random(10, 30),
      color: color(random(100, 255), random(100, 255), random(100, 255))
    };
    planets.push(planet);
  }
}

// Function to draw planets
function drawPlanets() {
  noStroke();
  for (let i = 0; i < planets.length; i++) {
    let planet = planets[i];
    fill(planet.color);
    ellipse(planet.x, planet.y, planet.size);
    // Glow effect around the planet
    for (let j = 0; j < 10; j++) {
      let alpha = map(j, 0, 10, 50, 0);
      fill(red(planet.color), green(planet.color), blue(planet.color), alpha);
      ellipse(planet.x, planet.y, planet.size + j * 5);
    }
  }
}

// Shooting stars functions
function createShootingStar() {
  let shootingStar = {
    x: random(width),
    y: 0,
    length: random(100, 200),
    speed: random(5, 10),
    thickness: random(1, 3)
  };
  shootingStars.push(shootingStar);
}

function updateShootingStars() {
  // Occasionally create a new shooting star
  if (random(1) < 0.01) {
    createShootingStar();
  }
  // Update position of each shooting star
  for (let i = shootingStars.length - 1; i >= 0; i--) {
    let star = shootingStars[i];
    star.x -= star.speed;
    star.y += star.speed;
    if (star.x < 0 || star.y > height) {
      shootingStars.splice(i, 1);
    }
  }
}

function drawShootingStars() {
  stroke(255);
  for (let i = 0; i < shootingStars.length; i++) {
    let star = shootingStars[i];
    strokeWeight(star.thickness);
    line(star.x, star.y, star.x + star.length, star.y - star.length);
  }
}

// User interaction functions
function mouseWheel(event) {
  // Zoom in and out
  scaleFactor -= event.delta * 0.001;
  scaleFactor = constrain(scaleFactor, minScale, maxScale);
  return false; // Prevent default scrolling
}

function mousePressed() {
  if (mouseButton === LEFT) {
    isDrawing = true;
    let star = getStarUnderMouse();
    if (star) {
      userConstellation.push(star);
    }
  }
}

function mouseReleased() {
  isDrawing = false;
}

function getStarUnderMouse() {
  let mx = mouseX / scaleFactor;
  let my = mouseY / scaleFactor;
  for (let i = 0; i < stars.length; i++) {
    let star = stars[i];
    let d = dist(mx, my, star.x, star.y);
    if (d < 5) {
      return star;
    }
  }
  return null;
}

function drawUserConstellation() {
  stroke(0, 255, 0);
  strokeWeight(2);
  for (let i = 0; i < userConstellation.length - 1; i++) {
    let star1 = userConstellation[i];
    let star2 = userConstellation[i + 1];
    line(star1.x, star1.y, star2.x, star2.y);
  }
}

// Function to save the canvas as an image
function saveCurrentCanvas() {
  saveCanvas('celestial_map', 'png');
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  bgGraphics.resizeCanvas(width, height);
  drawBackground();
  // Regenerate celestial elements to fit new dimensions
  generateStars(300);
  generateConstellations(15);
  generatePlanets(3);
}
