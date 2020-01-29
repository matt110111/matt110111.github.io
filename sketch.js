
let boids = [];
let bW = 600;
let bH = 600;
let bD = 600;
let ot;
let check_1 = false;
let a;
let numberViewDirections = 100;

function setup() {
  createCanvas(bW, bH, WEBGL);
  h1 = createElement("P", "Waiting..");
  check1 = createCheckbox("Show subdivision", false);
  check1.changed(myCheckedEvent)
  for (let i = 0; i < 2; i++) {
    boids.push(new Boid());


  }
  noStroke();
  


}

function draw() {
  background(25);
  //translate(-bW/16,-bH/2,-bD/16);
  orbitControl();

  
  strokeWeight(0.1)
  boundary = new Box(bW / 2, bH / 2, bD / 2, bW / 2, bH / 2, bD / 2)
  boundary.show()
  ot = new Octree(boundary, 16, 0);
  h1.html(int(frameRate()));
  //ot.show();


  for (let b of boids) {
    let point = new Point(b.pos.x, b.pos.y, b.pos.z, b);
    ot.insert(point)
  }
  if (check_1) {
    
    drawSub(ot)
  }
  for (let i = 0; i < boids.length; i++) {
    boids[i].edges();
    boids[i].flock(boids, ot);
    boids[i].update();
    boids[i].drawPerception() 
    boids[i].show();
  }
  
}



function drawSub(octree) {
  if (octree.depth > 1) {

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
    drawSub(octree.boxone)
  }
  if (octree.boxtwo.divided) {
    // octree.boxtwo.show()
    drawSub(octree.boxtwo)
  }
  if (octree.boxthr.divided) {
    // octree.boxthr.show()
    drawSub(octree.boxthr)
  }
  if (octree.boxfou.divided) {
    // octree.boxfou.show()
    drawSub(octree.boxfou)
  }
  if (octree.boxfiv.divided) {
    // octree.boxfiv.show()
    drawSub(octree.boxfiv)
  }
  if (octree.boxsix.divided) {
    // octree.boxsix.show()
    drawSub(octree.boxsix)
  }
  if (octree.boxsev.divided) {
    // octree.boxsev.show()
    drawSub(octree.boxsev)
  }
  if (octree.boxeig.divided) {
    // octree.boxeig.show()
    drawSub(octree.boxeig)
  }

}


function myCheckedEvent() {
  if (this.checked()) {
    check_1 = true;
  } else {
    check_1 = false;
  }

}


