class Boid {

  constructor(leader = false) {
    this.pos = createVector(random(width), random(height), random(height));
    this.vel = p5.Vector.random3D();
    // this.pos = createVector(300, 300, 300)
    // this.vel = createVector(10, 0, 0);
    this.vel.setMag(random(-4, 4));

    this.acc = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.perception = 100;
    this.radius = 5
    this.leader = leader;
    this.pointCloud = generatePointCloud();
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
      if (other != this && d < this.perception / 4) {
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
      steering.limit(this.maxForce * 1.1);
    }
    return steering;

  }
  awareness(planes) {
    let distance = 4;
    let ray = new Ray(this.pos, this.vel, this.perception);
    for (let p of planes) {
      let intersect = ray.intersect(p,false);
      if (intersect.bool)
        distance = p5.Vector.dist(ray.p, intersect.value)
      if (!p.bounds(ray.p) || distance < 2) {
        this.collided = true;
      } else {
        this.collided = false;
      }
    }
  }




  avoidence(planes) {
    let steering = createVector();
    let vectors = this.pointCloud;
    let evaluated = false;
    let count = 0;
    for (let v of vectors) {
      evaluated = false
      let ray = new Ray(this.pos, v)
      for (let p of planes) {

        let intersect = ray.intersect(p);

        if (intersect.bool) {
          let distance = p5.Vector.dist(ray.pos, intersect.value)
          if (distance < this.perception / 2 && p.bounds(intersect.value) && !evaluated) {
            evaluated = true
          }
        } else if (!evaluated && p.bounds(ray.p)) {
          steering.add(v);
          count++;
        }
      }
    }
    //Divide the sum of vectors that resulted in no intersection by the number of occurences
    if (count > 0) {
      steering.div(count);
      steering.setMag(this.maxSpeed);
      steering.limit(this.maxForce * 1.25);
      push();
      stroke(255,0,255);
      strokeWeight(2.5);
      line(this.pos.x,this.pos.y,this.pos.z,this.pos.x+steering.x*this.perception,this.pos.y+steering.y*this.perception,this.pos.z+steering.z*this.perception)
      pop();
      return steering
    }
  }





  flock(boids, ot) {
    let range;
    if (boid_range_shape == 'Box') {
      range = new Box(this.pos.x, this.pos.y, this.pos.z, this.perception, this.perception, this.perception);
    } else {
      range = new Sphere(this.pos.x, this.pos.y, this.pos.z, this.perception);
    }

    

    let filteredBoids = ot.query(range);
    
    if (perception_mask) {
      if (filteredBoids.length > 1){
      range.show(true)
      }
      else{

      range.show(false)
      }
    }
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
