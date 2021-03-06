class Boid {

  constructor() {
    this.pos = createVector(random(width), random(height), random(height));
    this.vel = p5.Vector.random3D();

    this.vel = createVector(10, 0, 0);
    this.vel.setMag(random(-4, 4));
    this.grouped = false;
    this.acc = createVector();
    this.maxForce = 0.2;
    this.maxSpeed = 4;
    this.perception = 50;
    this.radius = 5
    this.leader = false;
    this.pointCloud = generatePointCloud();
    this.heading_for_collision = false;
    this.escape_trajectory = undefined
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

      steering.limit(this.maxForce * 1.5);
    }
    return steering;

  }


  collection(boids) {
    let commonDirection = createVector();
    let commonPosition = createVector();
    let total = 0;

    for (let b of boids) {
      let bU = b.userData
      commonDirection.add(bU.vel);
      commonPosition.add(bU.pos);
      total++;
    }
    let point = createVector();
    let furthestP = {
      value: 0,
      boid: 0
    };
    for (let b of boids) {
      b.userData.leader = false
      let u = p5.Vector.sub(b.userData.pos.copy(), commonPosition).normalize();

      let magsq_cD = commonDirection.magSq()
      let UdotV = u.dot(commonDirection);
      let scalar = abs(magsq_cD / UdotV)
      if (0 < scalar && scalar < 1000) {
        furthestP.value = scalar;
        furthestP.boid = b;
      }
    }
    if (furthestP.value) {
      furthestP.boid.userData.leader = true
    }
    // console.log(furthestP)
    if (total > 1) {
      //commonDirection.div(total);
      commonPosition.div(total);

    }
  }


  awareness(planes) {
    let ray = new Ray(this.pos, this.vel, this.perception);

    for (let p of planes) {
      let intersect = ray.intersect(p, false);
      if (!p.bounds(ray.p)) {
        this.heading_for_collision = true;
        ray.show()
        
      } else {
        this.heading_for_collision = false;
      }
    }
  }


//Avoidence create internal variable denoting that a boid is heading for collision pick a random direction thats free.
/*
avoidence should find a vector based on the dot product of the plane intersection and the normal
--Plane 
--Dot of Plane selected && ray direction

--Coner and edge of plane detection.
*/


  avoidence(planes) {
    let steering = createVector();
    let vectors = this.pointCloud;
    let evaluated = false; // Evaluated 
    let total = 0;
    for (let v of vectors) {
      evaluated = false;
      let g = this.vel.copy()
      g.normalize()
      let t = p5.Vector.add(v,g)
      let ray = new Ray(this.pos, t)
      //ray.show()
      for (let p of planes) {

        let intersect = ray.intersect(p);
        let Dot = p5.Vector.dot(p.normal,ray.dir)
        if (intersect.bool) {
          let distance = p5.Vector.dist(ray.pos, intersect.value)
          if (distance < this.perception && p.bounds(intersect.value) && !evaluated) {
            evaluated = true
          }
        } else if (!evaluated && p.bounds(ray.p) && (Dot < 0.9 && Dot > 0.4 || Dot < -0.4 && Dot > -0.9) ) {
          evaluated = true
          ray.show()
          steering.add(v);
          total++;
        }
        if(!p.bounds(this.pos)){
          let dir = p5.Vector.sub(createVector(300,300,300),this.pos)
          dir.normalize()
          steering.add(dir)
          steering.setMag(this.maxSpeed*20);
          steering.limit(this.maxForce);
          return steering
        }
      }
    }
    //Divide the sum of vectors that resulted in no intersection by the number of occurences
    if (total > 0) {
      steering.div(total);
      //steering.sub(this.vel)
      steering.setMag(this.maxSpeed);
      steering.limit(this.maxForce);
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
    if (filteredBoids.length > 1) {
      //print(this.grouped)
      this.grouped = true;  
    } else {
      this.grouped = false;
    }

    let alignment = this.align(filteredBoids);
    let cohesion = this.cohesion(filteredBoids);
    let seperation = this.seperation(filteredBoids);
    //let collection = this.collection(filteredBoids);
    
    this.awareness(planeArray)
    
    // this.acc.add(alignment);
    // this.acc.add(cohesion);
    // this.acc.add(seperation);
    if (this.heading_for_collision) {
      if (!this.grouped || this.leader)
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
    sphere(3);
    pop();

  }
}