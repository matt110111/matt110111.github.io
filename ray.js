class Ray {
  constructor(v, d) {
    this.pos = v;
    this.dir = d;


  }
  show() {
    push();
    noStroke()
    fill(255,255,150)
    translate(this.pos.x,this.pos.y,this.pos.z)
    translate(this.dir.x * 100, this.dir.y * 100, this.dir.z * 100)
    sphere(2)
    pop();



  }

  intersect(Plane) {


    let d = p5.Vector.dot(Plane.normal,Plane.b);
    
    if (p5.Vector.dot(Plane.normal, this.dir) == 0){
      return false;
    }
    let x = (d - p5.Vector.dot(Plane.normal, this.pos)) / p5.Vector.dot(Plane.normal, this.dir);
    let v = p5.Vector.mult(this.dir,x);
    let c = p5.Vector.add(this.pos, v);
    return c;
  }


}
// float d = Dot(normal, coord);

// if (Dot(normal, ray) == 0) {
//     return false; // No intersection, the line is parallel to the plane
// }


//  // Compute the X value for the directed line ray intersecting the plane
//  float x = (d - Dot(normal, rayOrigin)) / Dot(normal, ray);

//  // output contact point
//  *contact = rayOrigin + normalize(ray)*x; //Make sure your ray vector is normalized
//  return true;