

class Plane {
  constructor(vector1, vector2, vector3, minV, maxV) {
    this.a = vector1;
    this.b = vector2;
    this.c = vector3;
    this.A = this.a.y * (this.b.z - this.c.z) + this.b.y * (this.c.z - this.a.z) + this.c.y * (this.a.z - this.b.z);
    this.B = this.a.z * (this.b.x - this.c.x) + this.b.z * (this.c.x - this.a.x) + this.c.z * (this.a.x - this.b.x);
    this.C = this.a.x * (this.b.y - this.c.y) + this.b.x * (this.c.y - this.a.y) + this.c.x * (this.a.y - this.b.y);
    this.D = (this.a.x * (this.b.y * this.c.z - this.c.y * this.b.z) + this.b.x * (this.c.y * this.a.z - this.a.y * this.c.z) + this.c.x * (this.a.y * this.c.z - this.b.y * this.a.z));

    this.normal = createVector(this.A, this.B, this.C);
    this.normal.normalize();

  }
  bounds(points) {
    let X_min = 0;
    let X_max = 600;
    let Y_min = 0;
    let Y_max = 600;
    let Z_min = 0;
    let Z_max = 600;
    if (X_min <= points.x && points.x <= X_max && Y_min <= points.y && points.y <= Y_max && Z_min <= points.z && points.z <= Z_max) {
      return true;
    }
  }
}