class Boid {

  constructor() {
    this.pos = createVector(random(width), random(height), random(height));
    this.vel = p5.Vector.random3D();
    this.vel.setMag(random(2, 4));
    this.acc = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.perception = 100;
  }
  edges() {
    if (this.pos.x > width) {
      this.pos.x = 0;
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
    }
    if (this.pos.z < 0) {
      this.pos.z = 600;
    }
    if (this.pos.z > 600) {
      this.pos.z = 0;
    }

  }

  align(boids) {

    let steering = createVector();
    let total = 0;
    for (let b of boids) {
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




  flock(boids, ot) {
    let range = new Box(this.pos.x, this.pos.y, this.pos.z, this.perception, this.perception, this.perception);
    //range.show()

    let filteredBoids = ot.query(range);
    //console.log(filteredBoids.length);
    //noLoop();
    let alignment = this.align(filteredBoids);
    let cohesion = this.cohesion(filteredBoids);
    let seperation = this.seperation(filteredBoids);
    //print(alignment);
    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(seperation);
  }



  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.acc.mult(0);

  }

  show() {
    push();
    translate(this.pos.x - width / 2, this.pos.y - height / 2, this.pos.z);


    noStroke();
    fill(255, 0, 0);
    sphere(5);
    //triangle(-5, 5, 0, -10, 5, 5);
    pop();
    // strokeWeight(6);
    // cone(this.pos.x, this.pos.y);
  }
}
