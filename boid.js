class Boid {

  constructor(leader = false) {
    this.pos = createVector(random(width), random(height), random(height));
    this.vel = p5.Vector.random3D();
    this.vel.setMag(random(-4, 4));

    this.acc = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.perception = 100;
    this.radius = 5
    this.leader = leader;
    this.pointCloud = generatePointCloud()
  }
  edges() {
    if (this.pos.x > bW) {
      this.pos.x = 0;
    }
    if (this.pos.y > bH) {
      this.pos.y = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = bW;
    }
    if (this.pos.y < 0) {
      this.pos.y = bH;
    }
    if (this.pos.z < 0) {
      this.pos.z = bW;
    }
    if (this.pos.z > bW) {
      this.pos.z = 0;
    }

  }

  align(boids) {

    let steering = createVector();
    let total = 0;
    for (let b of boids) {
      boidUpdates++;
      let other = b.userData;
      let d = other.pos.dist(this.pos)
      if (other != this && d < this.perception) {
        total++;
        steering.add(other.vel);
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;

  }
  cohesion(boids) {

    let steering = createVector();
    let total = 0;

    for (let b of boids) {
      boidUpdates++;
      let other = b.userData;
      let d = other.pos.dist(this.pos)
      if (other != this && d < this.perception) {
        steering.add(other.pos);
        total++;

      }
    }
    if (total > 0) {
      steering.div(total);
      steering.sub(this.pos);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;

  }

  seperation(boids) {

    let steering = createVector();
    let total = 0;
    for (let b of boids) {
      boidUpdates++;
      let other = b.userData;
      let d = other.pos.dist(this.pos)
      if (other != this && d < this.perception / 2) {
        let diff = p5.Vector.sub(this.pos, other.pos);
        diff.div(d * d)
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.div(total);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel);
      steering.limit(this.maxForce);
    }
    return steering;

  }
  avoidence(planes) {
    let steering = createVector();
    let genPointCloud = generatePointCloud();
    let nVel = this.vel.copy();
    nVel.normalize();
    let furthestP = {
      t: 0,
      v: createVector()
    }
    let Psi;

    for (let p of planes) {
      for (let vector of genPointCloud) {
        let ray = new Ray(this.pos, vector)
        Psi = ray.intersect(p)
      }
      if (!Psi && Psi != undefined && this.pos.dist(Psi)<this.perception) {
        steering.add(Psi);
        furthestP.t++

      }
    }
    if (furthestP.t > 0) {
      steering.div(furthestP.t);
      steering.setMag(this.maxSpeed);
      steering.sub(this.vel)
      steering.limit(this.maxForce+20);
    }
    return steering;
  }






  flock(boids, ot) {
    let range;
    if (boid_range_shape == 'Box') {
      range = new Box(this.pos.x, this.pos.y, this.pos.z, this.perception, this.perception, this.perception);
    } else {
      range = new Sphere(this.pos.x, this.pos.y, this.pos.z, this.perception);
    }

    if (perception_mask) {
      range.show()
    }

    let filteredBoids = ot.query(range);
    //Add Weights to the 3 fundementals
    let alignment = this.align(filteredBoids);
    let cohesion = this.cohesion(filteredBoids);
    let seperation = this.seperation(filteredBoids);
    let avoidence = this.avoidence(planeArray);
    //print(alignment);
    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(seperation);
    this.acc.add(avoidence)
  }

  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.acc.mult(0);
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    noStroke();

    if (!this.leader) {
      fill("#00AAFF");
    } else {
      fill(255, 0, 0);
    }
    sphere(5);
    pop();

  }
}