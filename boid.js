class Boid {

  constructor(leader = false) {
    this.pos = createVector(random(width), random(height), random(height));
    this.vel = createVector(-10, 0, -10);
    this.vel.setMag(random(-4, 4));

    this.acc = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.perception = 100;
    this.radius = 5
    this.leader = leader;
    this.pointCloud = generatePointCloud();
    this.heading_for_collision = false;
    this.collided = false;
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
  awareness(planes) {
    let distance = 4;

    let ray = new Ray(this.pos, this.vel, this.perception);
    //ray.show(false)
    for (let p of planes) {
      if (ray.intersect(p))
        distance = p5.Vector.dist(ray.p, ray.intersect(p))
      //print(distance)
      if (!planeArray[0].bounds(ray.p) || distance < 4) {
        this.collided = true;
        ray.show(true);

      } else {
        this.collided = false;
      }
    }
  }




  avoidence(planes) {

    let steering = createVector();
    let vectors = generatePointCloud();
    let drawn = false;
    let lstOfVs = []
    let idealLine = createVector()
    for (let v of vectors) {

      let ray = new Ray(this.pos, v, this.perception)
      for (let p of planes) {
        let intersect = ray.intersect(p);
        // if it intersects its within the boundary and its outside of perception radius
        if (intersect) {
          let distance = p5.Vector.dist(ray.pos, intersect)
          if (distance < this.perception && p.bounds(intersect)) {
            lstOfVs.push(v)
            // push()
            // strokeWeight(2)
            // stroke(255, 0, 0)
            // line(this.pos.x, this.pos.y, this.pos.z, intersect.x, intersect.y, intersect.z)
            // pop()
          }
        }
      }
    }
    for (let v of vectors) {
      if (!lstOfVs.includes(v)) {
        // push()
        // strokeWeight(2)
        // stroke(255, 0, 0)
        // line(this.pos.x, this.pos.y, this.pos.z, this.pos.x + v.x * this.perception, this.pos.y + v.y * this.perception, this.pos.z + v.z * this.perception)
        // pop()
        steering.sub(v)
      }
      steering.normalize()
      push()
      strokeWeight(2)
      stroke(0, 255, 0)
      line(this.pos.x, this.pos.y, this.pos.z, this.pos.x + steering.x * this.perception, this.pos.y + steering.y * this.perception, this.pos.z + steering.z * this.perception)
      pop()
    }
    steering.setMag(this.maxSpeed);
    steering.add(this.vel);
    steering.limit(this.maxForce*2);
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

    let alignment = this.align(filteredBoids);
    let cohesion = this.cohesion(filteredBoids);
    let seperation = this.seperation(filteredBoids);
    // let avoidence;
    // if (this.awareness(planeArray)) {
    this.awareness(planeArray);
    // }
    this.acc.add(alignment);
    this.acc.add(cohesion);
    this.acc.add(seperation);
    if (this.collided) {
      this.acc.add(this.avoidence(planeArray))
    }
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