//Ray object 

class Ray {
  constructor(v, d, length) {
    this.pos = v;
    this.length = length || 50; //default 50px
    //Below code. Refactor, included this for otimizing the collision system to use one Ray when the boid is in flight 
    this.dir = d.copy();
    this.dir = this.dir.normalize()
    this.p = createVector(this.pos.x + this.dir.x * this.length, this.pos.y + this.dir.y * this.length, this.pos.z + this.dir.z * this.length)
    // Refactor

  }
  //Very messy, simply resolving if the ray object will collide with the Plane if it will where the intersection will occur.
  //Sub feature, if there is no intersection, return dot product of the ray and the Plane to resolve the the angle of seperation.
  intersect(origin = this.pos.copy(), direction = this.dir.copy, Plane) {
    var denom = p5.Vector.dot(direction, Plane.normal)
    if (denom !== 0) {
      //print(denom)
      var t = -(p5.Vector.dot(origin, Plane.normal) + Plane.distance) / denom

      if (t < 0) {
        return {
          bool: false,
          value: null
        }
      }
      let outPut = p5.Vector.mult(direction, t)
      //console.log(p5.Vector.add(origin, outPut).copy())
      return {
        bool: true,
        value: p5.Vector.add(origin, outPut).copy()
      }

    } else if (p5.Vector.dot(Plane.normal, origin) + Plane.distance === 0) {
      return {
        bool: true,
        value: origin.copy()
      }
    } else {
      return {
        bool: false,
        value: null
      }
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