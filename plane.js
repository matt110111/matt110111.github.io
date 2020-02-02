class Plane {
  constructor(vector1, vector2, vector3, vector4) {
    this.b = vector1
    this.r = vector2
    this.s = vector3
    this.normal = p5.Vector.cross(this.r.sub(this.b), (this.s.sub(this.b))).normalize();

  }
}
