class Ray {
  constructor(v, d, length = 50) {
    this.pos = v;
    this.dir = d;
    this.length = length;
    this.p = this.pos.copy()
    this.d = d;
    this.d = this.d.normalize()
    //this.p.add(this.d)
    //this.p.mult(this.length)
    this.p = createVector(this.p.x + this.d.x*this.length, this.p.y + this.d.y*this.length, this.p.z + this.d.z*this.length)


  }

  intersect(Plane) {
    let d = p5.Vector.dot(Plane.normal, Plane.b);
    if (p5.Vector.dot(Plane.normal, this.dir) == 0) {
      return false;
    }
    let x = (d - p5.Vector.dot(Plane.normal, this.p)) / p5.Vector.dot(Plane.normal, this.dir);
    let v = p5.Vector.mult(this.dir, x);
    let c = p5.Vector.add(this.p, v);
    return c;
  }
  show(collided) {

    push();
    noStroke();
    if (!collided) {
      fill(255, 255, 150);
    } else {
      fill(255, 0, 255);
    }
    //translate(this.pos.x, this.pos.y, this.pos.z)
    translate(this.p.x, this.p.y, this.p.z)
    sphere(5)
    pop();
  }
}