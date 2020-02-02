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
      if (nvel.dist(nP) > this.perception / 4) {
        nP.normalize();

        let nR = new Ray(this.pos, nP);
        let intersect = nR.intersect(planeArray[0])
        //console.log(intersect);
        if (intersect && this.leader && perception_mask) {

          push()
          stroke(0, 255, 0);
          strokeWeight(20);

          line(this.pos.x, this.pos.y, this.pos.z, intersect.x, intersect.y, intersect.z);
          pop()


        }

        // if (this.leader && perception_mask) {
        //   push()
        //   stroke(0, 255, 0, 1);
        //   strokeWeight(2);
        //   translate(this.pos.x, this.pos.y, this.pos.z);
        //   line(0, 0, 0, nP.x, nP.y, nP.z);
        //   pop()
        // }



      }
    }


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