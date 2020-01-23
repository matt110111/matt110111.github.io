// bx = [false, true, false, true, false, true, false, true];
// by = [false, false, true, true, false, false, true, true];
// bz = [false, false, false, false, true, true, true, true];

class Point {
  constructor(x, y, z,userData) {
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
    push();
    translate(this.x-bW/2, this.y-bH/2, this.z);
    fill(200, 10)
    box(this.w);
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
    let two = new Box(x + w, y - h, z - d, w, h, d);
    this.boxtwo = new Octree(two, this.capacity, this.depth);
    let thr = new Box(x - w, y + h, z - d, w, h, d);
    this.boxthr = new Octree(thr, this.capacity, this.depth);
    let fou = new Box(x + w, y + h, z - d, w, h, d);
    this.boxfou = new Octree(fou, this.capacity, this.depth);
    let fiv = new Box(x - w, y - h, z + d, w, h, d);
    this.boxfiv = new Octree(fiv, this.capacity, this.depth);
    let six = new Box(x + w, y - h, z + d, w, h, d);
    this.boxsix = new Octree(six, this.capacity, this.depth);
    let sev = new Box(x - w, y + h, z + d, w, h, d);
    this.boxsev = new Octree(sev, this.capacity, this.depth);
    let eig = new Box(x + w, y + h, z + d, w, h, d);
    this.boxeig = new Octree(eig, this.capacity, this.depth);


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
    translate(-w, h, d);

    fill(255, 50)
    sphere(20)
    box(w*4);
    pop();
  }


}
