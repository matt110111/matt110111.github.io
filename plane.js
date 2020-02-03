
class Plane {
  constructor(vector1, vector2, vector3, vector4) {
    this.s = vector1;
    this.r = vector2;
    this.b = vector3;
    let product1 = p5.Vector.sub(this.r,this.b);
    let prodcut2 = p5.Vector.sub(this.s,this.b);
    this.normal = p5.Vector.cross(product1,prodcut2).normalize();

  }



  debugLines(){
    stroke(0,255,0)
    strokeWeight(5)
    line(this.s.x,this.s.y,this.s.z,this.r.x,this.r.y,this.r.z);
    line(this.r.x,this.r.y,this.r.z,this.b.x,this.b.y,this.b.z);
    stroke(255,0,0)
    line(this.s.x,this.s.y,this.s.z,this.b.x,this.b.y,this.b.z);
  }
}
