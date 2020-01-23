let boids = [];
let bW = 600;
let bH = 600;
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
  orbitControl();

  boundary = new Box(0, 0, 0, bW/2, bH/2, bD/2)
  //boundary.show()
  ot = new Octree(boundary, 8, 0);
  ot.show();

  //translate(0, 0, bD / 2);


  for (let b of boids) {
    let point = new Point(b.pos.x, b.pos.y, b.pos.z, b);
    ot.insert(point)
  }
  // console.log(ot);
  //
  // noLoop();


  for (let i = 0; i < boids.length; i++) {
    boids[i].edges();
    boids[i].flock(boids, ot);


  }

  for (let i = 0; i < boids.length; i++) {
    boids[i].update();

    boids[i].show();
  }
}
