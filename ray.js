class Ray {
  constructor(vector, d) {
    this.pos = vector;
    this.dir = d;


  }
  show() {
    push();
    stroke(0, 255, 0, 10);
    strokeWeight(2)
    translate(this.pos.x, this.pos.y, this.pos.z)
    line(0, 0, 0, this.dir.x * 100, this.dir.y * 100, this.dir.z * 100)
    pop();



  }

  intersect(Plane) {


    let ndotu = p5.Vector.dot(Plane.normal, this.dir)
    
    if (abs(ndotu) < 1e-6) {
      return false;
    }
    let w = p5.Vector.sub(this.pos,Plane.r)
    let si = -(Plane.normal.dot(w)) / ndotu
    let c = createVector(this.dir.x + Plane.s.x, this.dir.y + Plane.s.y, this.dir.z + Plane.s.z)
    c = createVector(c.x * -si, c.y * -si, c.z*-si)
    c.add(w)

    return c;
  }
}




// ndotu = p5.Vector.dot(planeNormal, rayDirection)
//   // if (abs(ndotu) < epsilon) {
//   //   return c;
//   // }
//   let w = p5.Vector.sub(rayPoint, planePoint)
//   let si = -(planeNormal.dot(w)) / ndotu
//   let c = createVector(rayDirection.x + planePoint.x, rayDirection.y + planePoint.y, rayDirection.z + planePoint.z)
//   c = createVector(c.x * -si, c.y * -si)
//   c.add(w)

//   return c;