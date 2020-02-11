//Ray object 

class Ray {
  constructor(v, d, length) {
    this.pos = v;
    this.dir = d;
    this.length = length || 50;  //default 50px
    //Below code. Refactor, included this for otimizing the collision system to use one Ray when the boid is in flight 
    this.p = createVector(this.pos.x + this.dir.x * this.length, this.pos.y + this.dir.y * this.length, this.pos.z + this.dir.z * this.length)
    // Refactor

  }
  //Very messy, simply resolving if the ray object will collide with the Plane if it will where the intersection will occur.
    //Sub feature, if there is no intersection, return dot product of the ray and the Plane to resolve the the angle of seperation.
  intersect(Plane, pos = true) {
    let d = p5.Vector.dot(Plane.normal, Plane.b);
    if (pos) {
      if (p5.Vector.dot(Plane.normal, this.dir) <= 0) {
        return {
          bool: false,
          value: p5.Vector.dot(Plane.normal, this.dir)
        }
      }
      let x = (d - p5.Vector.dot(Plane.normal, this.pos)) / p5.Vector.dot(Plane.normal, this.dir);
      let v = p5.Vector.mult(this.dir, x);
      let c = p5.Vector.add(this.pos, v);
      return {
        bool: true,
        value: c
      }
    } else {
      if (p5.Vector.dot(Plane.normal, this.dir) <= 0) {
        return {
          bool: false,
          value: p5.Vector.dot(Plane.normal, this.dir)
        }
      }
      let x = (d - p5.Vector.dot(Plane.normal, this.p)) / p5.Vector.dot(Plane.normal, this.dir);
      let v = p5.Vector.mult(this.dir, x);
      let c = p5.Vector.add(this.p, v);
      return {
        bool: true,
        value: c
      }
    }
  }
  //Debug code.
  show(collided) {

    push();
    noStroke();
    if (!collided) {
      fill(0, 255, 0);
    } else {
      fill(255, 0, 255);
    }
    //translate(this.pos.x, this.pos.y, this.pos.z)
    translate(this.p.x, this.p.y, this.p.z)
    sphere(2)
    pop();
  }
}
