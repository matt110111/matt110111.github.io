let boids = [];
let bW = 800;
let bH = 800;
let bD = 800;
let ot;
let sub_division_view = false;
let perception_mask = false;
let a;
let numberViewDirections = 100;

function setup() {
  createCanvas(bW, bH, WEBGL).parent('canvasposition');
  fpsElement = createElement("H1", "Waiting..");
  show_player_perception = createCheckbox("Show boids perception", false);
  show_player_perception.changed(perceptionViewCheck)
  sub_division_view_ = createCheckbox("Show subdivision", false);
  sub_division_view_.changed(subdivisionCheck)
  h1 = createElement("P", "Waiting..");
  sub_division_depth_ = createSlider(1, 5, 1, 1).parent('controlposition');
  for (let i = 0; i < 299; i++) {
    boids.push(new Boid());
  }
  boids.push(new Boid(true));
  noStroke();



}

function draw() {
  background("#282828");


  orbitControl();
  translate(bW - bW / 1.5, -bH, -bD * 2.2);
  rotateX(HALF_PI - 0.2);
  rotateZ(2.4);
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



function drawSub(octree, depth) {
  if (octree.depth > depth) {

    octree.boxone.show()
    octree.boxtwo.show()
    octree.boxthr.show()
    octree.boxfou.show()
    octree.boxfiv.show()
    octree.boxsix.show()
    octree.boxsev.show()
    octree.boxeig.show()
  }
  if (octree.boxone.divided) {
    // octree.boxone.show()
    drawSub(octree.boxone, depth)
  }
  if (octree.boxtwo.divided) {
    // octree.boxtwo.show()
    drawSub(octree.boxtwo, depth)
  }
  if (octree.boxthr.divided) {
    // octree.boxthr.show()
    drawSub(octree.boxthr, depth)
  }
  if (octree.boxfou.divided) {
    // octree.boxfou.show()
    drawSub(octree.boxfou, depth)
  }
  if (octree.boxfiv.divided) {
    // octree.boxfiv.show()
    drawSub(octree.boxfiv, depth)
  }
  if (octree.boxsix.divided) {
    // octree.boxsix.show()
    drawSub(octree.boxsix, depth)
  }
  if (octree.boxsev.divided) {
    // octree.boxsev.show()
    drawSub(octree.boxsev, depth)
  }
  if (octree.boxeig.divided) {
    // octree.boxeig.show()
    drawSub(octree.boxeig, depth)
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