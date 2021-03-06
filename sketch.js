let boids = [];
let bW = 800;
let bH = 800;
let bD = 800;
let Haltdebug = false;
let PAUSE = false;


let sub_division_view = false;
let perception_mask = false;
let boid_range_shape = 'Sphere';
// let boidUpdates = 0;
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
  // boidUpdates_ = createElement("H1", "Waiting..");
  for (let i = 0; i < 50; i++) {
    boids.push(new Boid());
  }
  //boids.push(new Boid(true));
  noStroke();

  planeArray.push(new Plane(createVector(0, 0, 0), createVector(600, 0, 600), createVector(0, 0, 600), createVector(0, 0, 0), createVector(600, 0, 600)));
  planeArray.push(new Plane(createVector(600, 0, 600), createVector(600, 600, 600), createVector(600, 0, 0), createVector(600, 0, 0), createVector(600, 600, 600)));
  planeArray.push(new Plane(createVector(600, 600, 0), createVector(0, 600, 600), createVector(600, 600, 600), createVector(600, 600, 0), createVector(0, 600, 600)));
  planeArray.push(new Plane(createVector(0, 600, 600), createVector(0, 0, 0), createVector(0, 600, 0), createVector(0, 600, 600), createVector(600, 0, 600)));
  planeArray.push(new Plane(createVector(600, 600, 600), createVector(0, 0, 600), createVector(600, 0, 600), createVector(0, 0, 600), createVector(600, 0, 600)));
  planeArray.push(new Plane(createVector(600, 0, 0), createVector(0, 600, 0), createVector(600, 600, 0), createVector(0, 600, 0), createVector(600, 0, 0)));

}

function draw() {
  background("#282828");
  orbitControl();
  translate(bW - bW*1.5, bH - bH / 1.8, -bD * 0.5);
  rotateX(HALF_PI);
  //rotateZ((PI / 4) + .02);


  boundary = new Box(bW / 2, bH / 2, bD / 2, bW / 2, bH / 2, bD / 2, true)
  boundary.show()
  ot = new Octree(boundary, 32, 0);

  fpsElement.html(int(frameRate()));
  //boidUpdates_.html(boidUpdates)
  //boidUpdates = 0;

  let sub_division_depth = sub_division_depth_.value();

  for (let b of boids) {
    let point = new Point(b.pos.x, b.pos.y, b.pos.z, b);
    ot.insert(point)
  }
  if (sub_division_view) {

    drawSub(ot, sub_division_depth)
  }
  for (let i = 0; i < boids.length; i++) {
    //boids[i].edges();
    if (!PAUSE) {
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

// function generatePointCloud() {
//   let viewDensity = 21;
//   let Array = []
//   let goldenRatio = (1 + sqrt(5)) / 2;
//   let angleIncrement = PI * 2 * goldenRatio;
//   for (let i = 0; i < viewDensity; i++) {
//     let t = i / viewDensity;
//     let inclination = acos(1 - 2 * t);
//     let azimuth = angleIncrement * i;
//     let x = sin(inclination) * cos(azimuth);
//     let y = sin(inclination) * sin(azimuth);
//     let z = cos(inclination);
//     let nP = createVector(x, y, z);
//     nP.normalize();
//     Array.push(nP)
//   }
//   return Array;
// }

function generatePointCloud() {
  let Array = []
  let goldenRatio = (1 + sqrt(5)) / 2;
  let angleIncrement = PI * 2 * goldenRatio;
  for (let i = 0; i < 70; i++) {
    let t = i /2;
    let inclination = acos(1 - 2 * (t / 20));
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


function keyTyped() {
  if (key === 'p') {
    PAUSE = !PAUSE;
  }
}