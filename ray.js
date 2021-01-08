//Ray object 

class Ray {
  constructor(v, d, length) {
    this.pos = v;
    this.length = length || 50;  //default 50px
    //Below code. Refactor, included this for otimizing the collision system to use one Ray when the boid is in flight 
    this.dir = d.copy();
    this.dir = this.dir.normalize()
    this.p = createVector(this.pos.x + this.dir.x * this.length, this.pos.y + this.dir.y * this.length, this.pos.z + this.dir.z * this.length)
    // Refactor

  }
  //Very messy, simply resolving if the ray object will collide with the Plane if it will where the intersection will occur.
    //Sub feature, if there is no intersection, return dot product of the ray and the Plane to resolve the the angle of seperation.
  intersect(Plane, pos = true, epsilon=1e-6) {

      let ndotu = Plane.normal.dot(this.dir)
      if (abs(ndotu) < epsilon){
        return {
          bool: false,
          value: undefined
        }
      }
      let w = p5.Vector.sub(ray.pos,Plane.a)
      let si = -(Plane.normal.dot(w) / ndotu)
      let Psi = (p5.Vector.mult(ray.dir,si)
      let Psi 
      return {
        bool: true,
        value: c
      }
    }
  //Debug code.
  show(collided) {

    push();
    noStroke();
    if (!collided) {
      fill(0, 255, 0);
    } else {
      fill(255, 0, 255);
    }
    // strokeWeight(2.5)
    // stroke(0,255,0)
    // line(this.pos.x,this.pos.y,this.pos.z,this.p.x,this.p.y,this.p.z)
    // translate(this.pos.x, this.pos.y, this.pos.z)
    translate(this.p.x, this.p.y, this.p.z)
    sphere(2)
    pop();
  }
}
