let boids = [];
let bW = 600;
let bH = 750;
let bD = 600;
let ot;



function setup() {
  createCanvas(bW, bH, WEBGL);

  for (let i = 0; i < 200; i++) {
    boids.push(new Boid());


  }
  noStroke();


}

function draw() {
  background(25);
  //orbitControl();


  boundary = new Box(300, 375, 300, bW / 2, bH / 2, bD / 2)
  //boundary.show()
  ot = new Octree(boundary, 4, 0);
  //ot.show();
  // push();
  // translate(0, 0, 0);
  // sphere(20);
  // pop();

  for (let b of boids) {
    let point = new Point(b.pos.x, b.pos.y, b.pos.z, b);
    ot.insert(point)
  }
  //drawSub(ot)
  //noLoop();

  // console.log(ot);
  //
  // noLoop();
  //rotateX(PI / 2.9);

    translate(-width / 2, -height / 1.5 + 250,-100);

  for (let i = 0; i < boids.length; i++) {
    boids[i].edges();
    boids[i].flock(boids, ot);
    boids[i].update();
    boids[i].show();
  }

}



function drawSub(octree) {
  if (octree.divided) {

    octree.boxone.show()
    octree.boxtwo.show()
    octree.boxthr.show()
    octree.boxfou.show()
    octree.boxfiv.show()
    octree.boxsix.show()
    octree.boxsev.show()
    octree.boxeig.show()
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
}
