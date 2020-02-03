
class Plane {
  constructor(vector1, vector2, vector3, vector4) {
    this.s = vector1
    this.d1 = vector1.copy()
    this.r = vector2
    this.d2 = vector2.copy()
    this.b = vector3
    this.normal = p5.Vector.cross(this.d2.sub(this.b), (this.d1.sub(this.b))).normalize();

  }
  show(){
    console.log(this.s,this.r,this.b)
    noLoop();
    push();
    noStroke();
    fill(255,0,0)
    translate(this.s.x,this.s.y,this.s.z);
    sphere(5);
    pop()
    push()
    fill(0,255,0);
    translate(this.r.x,this.r.y,this.r.z);
    sphere(5);
    pop()
    push()
    fill(0,0,255);
    translate(this.b.x,this.b.y,this.b.z);
    sphere(5);
    pop();
  }
  showLines(){
    stroke(0,255,0)
    strokeWeight(4)
    line(this.s.x,this.s.y,this.s.z,this.r.x,this.r.y,this.r.z)
    line(this.r.x,this.r.y,this.r.z,this.b.x,this.b.y,this.b.z)
    line(this.s.x,this.s.y,this.s.z,this.b.x,this.b.y,this.b.z)


  }
}
