class Plane {
  constructor(vector1, vector2, vector3, minV,maxV) {
    this.a = vector1;
    this.b = vector2;
    this.c = vector3;
    this.A = this.a.y * (this.b.z - this.c.z) + this.b.y * (this.c.z - this.a.z) + this.c.y * (this.a.z - this.b.z);
    this.B = this.a.z * (this.b.x - this.c.x) + this.b.z * (this.c.x - this.a.x) + this.c.z * (this.a.x - this.b.x);
    this.C = this.a.x * (this.b.y - this.c.y) + this.b.x * (this.c.y - this.a.y) + this.c.x * (this.a.y - this.b.y);
    this.D = (this.a.x * (this.b.y * this.c.z - this.c.y * this.b.z) + this.b.x * (this.c.y * this.a.z - this.a.y * this.c.z) + this.c.x * (this.a.y * this.c.z - this.b.y * this.a.z));

    this.normal = createVector(this.A, this.B, this.C);
    this.normal.normalize();
    this.minV = minV;
    this.maxV = maxV;
  }
  bounds(point) {
    if (point.x >= this.a.x && point.y >= this.a.y && point.z >= this.a.z) {
      return true;
    } else if (point.x <= this.b.x && point.y <= this.b.y && point.z <= this.b.z) {

    }


  }

  debugminmax() {
    push();
    fill(255, 0, 0);
    translate(this.minV.x, this.minV.y, this.minV.z);
    sphere(5);
    pop();
    push();
    fill(0, 255, 0);
    translate(this.maxV.x, this.maxV.y, this.maxV.z);
    sphere(5);
    pop();
    
  }
  debug() {
    push();
    fill(255, 0, 0);
    translate(this.a.x, this.a.y, this.a.z);
    sphere(20);
    pop();
    push();
    fill(0, 255, 0);
    translate(this.b.x, this.b.y, this.b.z);
    sphere(15);
    pop();
    push();
    fill(0, 0, 255);
    translate(this.c.x, this.c.y, this.c.z);
    sphere(10);
    pop();
  }
}