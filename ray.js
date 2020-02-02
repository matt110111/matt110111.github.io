class Ray {
  constructor(vector, d) {
    this.pos = vector;
    this.dir = d;


  }

  intersect(Plane) {
    let g = this.pos.copy()
    let h = this.dir.copy()
    let ndotu = Plane.normal.dot(this.dir)
    if (abs(ndotu) < 1e-6) {
      return false;
    }
    let w =  g.sub(Plane.b);
    let si = -Plane.normal.dot(w) / ndotu
    let Psi = createVector(this.dir.x +Plane.b.x, this.dir.y+Plane.b.y, this.dir.z+Plane.b.z)
    Psi = createVector(Psi.x*si,Psi.y*si,Psi.z)
    return Psi;
    }
}
