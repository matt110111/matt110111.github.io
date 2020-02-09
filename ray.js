class Ray {
  constructor(v, d, length = 50) {
    this.pos = v;
    this.dir = d;
    this.length = length;
    this.p = this.pos.copy()
    this.d = d.copy();
    this.d = this.d.normalize()
    this.p = createVector(this.p.x + this.d.x * this.length, this.p.y + this.d.y * this.length, this.p.z + this.d.z * this.length)


  }

  intersect(Plane, pos = true) {
    let d = p5.Vector.dot(Plane.normal, Plane.b);
    if (pos) {
      if (p5.Vector.dot(Plane.normal, this.dir) == 0) {
        return false;
      }
      let x = (d - p5.Vector.dot(Plane.normal, this.pos)) / p5.Vector.dot(Plane.normal, this.dir);
      let v = p5.Vector.mult(this.dir, x);
      let c = p5.Vector.add(this.pos, v);
      return c;
    } else {
      if (p5.Vector.dot(Plane.normal, this.d) == 0) {
        return false;
      }
      let x = (d - p5.Vector.dot(Plane.normal, this.p)) / p5.Vector.dot(Plane.normal, this.d);
      let v = p5.Vector.mult(this.d, x);
      let c = p5.Vector.add(this.p, v);
      return c;
    }
    return
  }

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