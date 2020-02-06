let boids = [];
let bW = 600;
let bH = 600;
let bD = 600;
let Haltdebug = false;



let sub_division_view = false;
let perception_mask = false;
let boid_range_shape = 'Sphere';
let boidUpdates = 0;
let planeArray = [];

function setup() {
  createCanvas(bW, bH, WEBGL).parent('canvasposition');
  frameRate(60);
  fpsElement = createElement("H1", "Waiting..");

  sub_division_depth_ = createSlider(1, 5, 3, 1).parent('controlposition');

  boid_range_shape_ = createSelect();
  boid_range_shape_.option('Sphere')
  boid_range_shape_.option('Box')

  boid_range_shape_.changed(boid_range_shape_Changed)
  sub_division_view_ = createCheckbox("Show subdivision", false).parent('controlposition');
  sub_division_view_.changed(subdivisionCheck)
  show_player_perception = createCheckbox("Show boids perception", false).parent('controlposition');
  show_player_perception.changed(perceptionViewCheck);
  h1 = createElement("P", "Number of boid updates p/s:");
  boidUpdates_ = createElement("H1", "Waiting..");

  for (let i = 0; i < 5; i++) {
    //boids.push(new Boid());
  }
  boids.push(new Boid(true));
  noStroke();

  planeArray.push(new Plane(createVector(0, 0, 0), createVector(600, 0, 600), createVector(0, 0, 600), createVector(0, 0, 0), createVector(600, 0, 600)));
  planeArray.push(new Plane(createVector(600, 0, 600), createVector(600, 600, 600), createVector(600, 0, 0), createVector(600, 0, 0), createVector(600, 600, 600)));
  planeArray.push(new Plane(createVector(600, 600, 0), createVector(0, 600, 600), createVector(600, 600, 600), createVector(0, 600, 600), createVector(600, 600, 0)));
  planeArray.push(new Plane(createVector(0, 600, 600), createVector(0, 0, 0), createVector(0, 600, 0), createVector(0, 600, 600), createVector(600, 0, 600)));
  planeArray.push(new Plane(createVector(600, 600, 600), createVector(0, 0, 600), createVector(600, 0, 600), createVector(0, 0, 600), createVector(600, 0, 600)));
  planeArray.push(new Plane(createVector(600, 0, 0), createVector(0, 600, 0), createVector(600, 600, 0), createVector(0, 600, 0), createVector(600, 0, 0)));

}

function draw() {
  background("#282828");
  orbitControl();
  translate(bW - bW, bH - bH / 2, -bD * 1.5);
  rotateX(HALF_PI);
  rotateZ((PI / 4) + .02);
  for (let p of planeArray) {
    p.debugminmax();
  }
  boundary = new Box(bW / 2, bH / 2, bD / 2, bW / 2, bH / 2, bD / 2, true)
  boundary.show()
  ot = new Octree(boundary, 4, 0);

  fpsElement.html(int(frameRate()));
  boidUpdates_.html(round(boidUpdates / 1000) + "k");
  boidUpdates = 0;

  let sub_division_depth = sub_division_depth_.value();

  for (let b of boids) {
    let point = new Point(b.pos.x, b.pos.y, b.pos.z, b);
    ot.insert(point)
  }
  if (sub_division_view) {

    drawSub(ot, sub_division_depth)
  }
  for (let i = 0; i < boids.length; i++) {
    if (!Haltdebug) {
      boids[i].edges();
      
      boids[i].update();
    }
    boids[i].flock(boids, ot);
    boids[i].show();
  }
}

function boid_range_shape_Changed() {
  boid_range_shape = boid_range_shape_.value()
}

function perceptionViewCheck() {
  if (this.checked()) {
    perception_mask = true;
  } else {
    perception_mask = false;
  }
}

function subdivisionCheck() {
  if (this.checked()) {
    sub_division_view = true;
  } else {
    sub_division_view = false;
  }
}

function generatePointCloud() {
  let viewDensity = 75
  let Array = []
  let goldenRatio = (1 + sqrt(5)) / 2;
  let angleIncrement = PI * 2 * goldenRatio;
  for (let i = 0; i < viewDensity; i++) {
    let t = i / viewDensity;
    let inclination = acos(1 - 2 * t);
    let azimuth = angleIncrement * i;
    let x = sin(inclination) * cos(azimuth);
    let y = sin(inclination) * sin(azimuth);
    let z = cos(inclination);
    let nP = createVector(x, y, z);
    nP.normalize();
    Array.push(nP)
  }
  return Array;
}