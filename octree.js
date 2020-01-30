// bx = [false, true, false, true, false, true, false, true];
// by = [false, false, true, true, false, false, true, true];
// bz = [false, false, false, false, true, true, true, true];

class Point {
  constructor(x, y, z, userData) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.userData = userData;
  }
}

class Box {
  constructor(x, y, z, w, h, d) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
    this.h = h;
    this.d = d;
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x <= this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y <= this.y + this.h &&
      point.z >= this.z - this.d &&
      point.z <= this.z + this.d
    );
  }
  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h ||
      range.z - range.d > this.z + this.h ||
      range.z + range.d < this.z - this.h
    );
  }
  show() {


    // rotateX();
    // rotateY(10)
    // rotateZ(10);
    push()
    stroke(0);
    strokeWeight(5);
    scale(1.5, -1.5, -1.5);
    // rotateZ(HALF_PI / 2)
    // rotateY(HALF_PI / 2)
    translate(this.x, this.y-250, this.z);
    //rotateX(HALF_PI);
    fill(200, 10)
    box(this.w * 2);
    pop();
  }
}




class Octree {
  constructor(boundary, capacity, depth) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.depth = depth;
    this.divided = false;
  }
  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let z = this.boundary.z;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;
    let d = this.boundary.d / 2;
    this.depth += 1;
    let one = new Box(x - w, y - h, z - d, w, h, d);
    this.boxone = new Octree(one, this.capacity, this.depth);
    // this.boxone.show();
    let two = new Box(x + w, y - h, z - d, w, h, d);
    this.boxtwo = new Octree(two, this.capacity, this.depth);
    // this.boxtwo.show();
    let thr = new Box(x - w, y + h, z - d, w, h, d);
    this.boxthr = new Octree(thr, this.capacity, this.depth);
    // this.boxthr.show();
    let fou = new Box(x + w, y + h, z - d, w, h, d);
    this.boxfou = new Octree(fou, this.capacity, this.depth);
    // this.boxfou.show();
    let fiv = new Box(x - w, y - h, z + d, w, h, d);
    this.boxfiv = new Octree(fiv, this.capacity, this.depth);
    // this.boxfiv.show();
    let six = new Box(x + w, y - h, z + d, w, h, d);
    this.boxsix = new Octree(six, this.capacity, this.depth);
    // this.boxsix.show();
    let sev = new Box(x - w, y + h, z + d, w, h, d);
    this.boxsev = new Octree(sev, this.capacity, this.depth);
    // this.boxsev.show();
    let eig = new Box(x + w, y + h, z + d, w, h, d);
    this.boxeig = new Octree(eig, this.capacity, this.depth);
    // this.boxeig.show();


    this.divided = true;
  }
  insert(point) {
    if (!this.boundary.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }
    if (
      this.boxone.insert(point) ||
      this.boxtwo.insert(point) ||
      this.boxthr.insert(point) ||
      this.boxfou.insert(point) ||
      this.boxfiv.insert(point) ||
      this.boxsix.insert(point) ||
      this.boxsev.insert(point) ||
      this.boxeig.insert(point)
    ) {
      return true;

    }

  }

  query(range, found) {
    if (!found) {
      found = [];
    }

    if (!range.intersects(this.boundary)) {
      return found;
    }

    for (let p of this.points) {
      if (range.contains(p)) {
        found.push(p);
      }
    }
    if (this.divided) {
      this.boxone.query(range, found);
      this.boxtwo.query(range, found);
      this.boxthr.query(range, found);
      this.boxfou.query(range, found);
      this.boxfiv.query(range, found);
      this.boxsix.query(range, found);
      this.boxsev.query(range, found);
      this.boxeig.query(range, found);
    }

    return found;
  }
  show() {

    push();
    let x = this.boundary.x;
    let y = this.boundary.y;
    let z = this.boundary.z;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;
    let d = this.boundary.d / 2;
    scale(1.5, -1.5, -1.5);
    translate(x, y-250, z);
    //console.log(this.depth)
    fill(255, this.depth * 7);
    //sphere(20)
    box((w * 4) - 4);
    pop();
  }
}


function drawSub(octree, depth) {
  if (octree.depth > depth) {

    octree.boxone.show()
    octree.boxtwo.show()
    octree.boxthr.show()
    octree.boxfou.show()
    octree.boxfiv.show()
    octree.boxsix.show()
    octree.boxsev.show()
    octree.boxeig.show()
  }
  if (octree.boxone.divided) {
    // octree.boxone.show()
    drawSub(octree.boxone, depth)
  }
  if (octree.boxtwo.divided) {
    // octree.boxtwo.show()
    drawSub(octree.boxtwo, depth)
  }
  if (octree.boxthr.divided) {
    // octree.boxthr.show()
    drawSub(octree.boxthr, depth)
  }
  if (octree.boxfou.divided) {
    // octree.boxfou.show()
    drawSub(octree.boxfou, depth)
  }
  if (octree.boxfiv.divided) {
    // octree.boxfiv.show()
    drawSub(octree.boxfiv, depth)
  }
  if (octree.boxsix.divided) {
    // octree.boxsix.show()
    drawSub(octree.boxsix, depth)
  }
  if (octree.boxsev.divided) {
    // octree.boxsev.show()
    drawSub(octree.boxsev, depth)
  }
  if (octree.boxeig.divided) {
    // octree.boxeig.show()
    drawSub(octree.boxeig, depth)
  }

}
