let boids = [];
let bW = 1000;
let bH = 500;
let bD = 800;

let sub_division_view = false;
let perception_mask = false;

let numberViewDirections = 100;

function setup() {
  createCanvas(bW, bH, WEBGL).parent('canvasposition');
  fpsElement = createElement("H1", "Waiting..");
  sub_division_depth_ = createSlider(1, 5, 3, 1).parent('controlposition');

  sub_division_view_ = createCheckbox("Show subdivision", false).parent('controlposition');
  sub_division_view_.changed(subdivisionCheck)
  show_player_perception = createCheckbox("Show boids perception", false).parent('controlposition');
  show_player_perception.changed(perceptionViewCheck);
  h1 = createElement("P", "Number of boid updates p/s:");

  for (let i = 0; i < 299; i++) {
    boids.push(new Boid());
  }
  boids.push(new Boid(true));
  noStroke();



}

function draw() {
  background("#282828");

  
  orbitControl();
  translate(bW - bW / 1.7, -bH-100, -bD * 3.1);
  rotateX(HALF_PI);
  rotateZ(2.3);
  strokeWeight(0.1);


  boundary = new Box(bW / 2, bH / 2, bD / 2, bW / 2, bH / 2, bD / 2)
  boundary.show()
  ot = new Octree(boundary, 8, 0);
  fpsElement.html(int(frameRate()));
  // ot.show();
  let sub_division_depth = sub_division_depth_.value();

  for (let b of boids) {
    let point = new Point(b.pos.x, b.pos.y, b.pos.z, b);
    ot.insert(point)
  }


  if (sub_division_view) {

    drawSub(ot, sub_division_depth)
  }


  for (let i = 0; i < boids.length; i++) {
    boids[i].edges();
    boids[i].flock(boids, ot);
    boids[i].update();
    boids[i].show();
    boids[i].drawPerception()
  }

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
