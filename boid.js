class Boid {

  constructor(leader=false) {
    this.pos = createVector(random(width), random(height), random(height));
    this.vel = p5.Vector.random3D();
    this.vel.setMag(random(2, 4));
    this.acc = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.perception = 100;
    this.radius = 5
    this.leader = leader;
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
  drawPerception() {
    let pointCloud = [];
    let nvel = this.vel.copy()

    nvel.mult(this.perception / 6);

    let goldenRatio = (1 + sqrt(5)) / 2;
    let angleIncrement = PI * 2 * goldenRatio;
    for (let i = 0; i < numberViewDirections; i++) {
      let t = i / numberViewDirections;
      let inclination = acos(1 - 2 * t);
      let azimuth = angleIncrement * i;
      let x = sin(inclination) * cos(azimuth);
      let y = sin(inclination) * sin(azimuth);
      let z = cos(inclination);
      let nP = createVector(x, y, z);

      nP.add(this.vel)
      nP.mult(this.perception / 4);
      if (nvel.dist(nP) < this.perception / 4) {
        nP.normalize();
        pointCloud.push(nP);
      }

      if (this.leader&&perception_mask) {
        push()
        scale(1.5, -1.5, -1.5)
        stroke(0, 255, 0,1);
        strokeWeight(2);
        translate(this.pos.x, this.pos.y - 250, this.pos.z);
        line(0, 0, 0, nP.x, nP.y, nP.z);
        pop()
      }



    }
  }


  show() {
    push();
    scale(1.5, -1.5, -1.5)
    translate(this.pos.x, this.pos.y - 250, this.pos.z);

    noStroke();
    if (!this.leader){
    fill(0, 200, 255);
    }
    else{
      fill(255,0,0);
    }
    sphere(5);
    pop();

  }
}