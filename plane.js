class Plane {
  constructor(vector1, vector2, vector3, vector4) {
    this.a = vector1;
    this.b = vector2;
    this.c = vector3;
    this.A = this.a.y * (this.b.z - this.c.z) + this.b.y * (this.c.z - this.a.z) + this.c.y * (this.a.z - this.b.z);
    this.B = this.a.z * (this.b.x - this.c.x) + this.b.z * (this.c.x - this.a.x) + this.c.z * (this.a.x - this.b.x);
    this.C = this.a.x * (this.b.y - this.c.y) + this.b.x * (this.c.y - this.a.y) + this.c.x * (this.a.y - this.b.y);
    this.D = (this.a.x * (this.b.y * this.c.z - this.c.y * this.b.z) + this.b.x * (this.c.y * this.a.z - this.a.y * this.c.z) + this.c.x * (this.a.y * this.c.z - this.b.y * this.a.z));

    this.normal = createVector(this.A, this.B, this.C)
    this.normal.normalize()




  }



  debugLines() {
    stroke(0, 255, 0)
    strokeWeight(5)
    line(this.s.x, this.s.y, this.s.z, this.r.x, this.r.y, this.r.z);
    line(this.r.x, this.r.y, this.r.z, this.b.x, this.b.y, this.b.z);
    stroke(255, 0, 0)
    line(this.s.x, this.s.y, this.s.z, this.b.x, this.b.y, this.b.z);
  }
}


// A = y1 (z2 - z3) + y2 (z3 - z1) + y3 (z1 - z2)
// B = z1 (x2 - x3) + z2 (x3 - x1) + z3 (x1 - x2)
// C = x1 (y2 - y3) + x2 (y3 - y1) + x3 (y1 - y2)
// - D = x1 (y2 z3 - y3 z2) + x2 (y3 z1 - y1 z3) + x3 (y1 z2 - y2 z1)
// let product1 = p5.Vector.sub(this.a, this.b);
// let prodcut2 = p5.Vector.sub(this.c, this.b);
// this.normal = p5.Vector.cross(product1, prodcut2).normalize();