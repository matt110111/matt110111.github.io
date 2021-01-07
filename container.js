class Containter {
    constructor(center, size) {
        this.center = center; //Vector
        this.size = size/2; //Scalar
        this.planeArray = []
        this.planeArray.push(new Plane(createVector(0, 0, 0), createVector(600, 0, 600), createVector(0, 0, 600), createVector(0, 0, 0), createVector(600, 0, 600)));
        this.planeArray.push(new Plane(createVector(600, 0, 600), createVector(600, 600, 600), createVector(600, 0, 0), createVector(600, 0, 0), createVector(600, 600, 600)));
        this.planeArray.push(new Plane(createVector(600, 600, 0), createVector(0, 600, 600), createVector(600, 600, 600), createVector(600, 600, 0), createVector(0, 600, 600)));
        this.planeArray.push(new Plane(createVector(0, 600, 600), createVector(0, 0, 0), createVector(0, 600, 0), createVector(0, 600, 600), createVector(600, 0, 600)));
        this.planeArray.push(new Plane(createVector(600, 600, 600), createVector(0, 0, 600), createVector(600, 0, 600), createVector(0, 0, 600), createVector(600, 0, 600)));
        this.planeArray.push(new Plane(createVector(600, 0, 0), createVector(0, 600, 0), createVector(600, 600, 0), createVector(0, 600, 0), createVector(600, 0, 0)));

    }
    bounds(pt) {
        let X_min = this.center.x - this.size;
        let X_max = this.center.x + this.size;
        let Y_min = this.center.y - this.size;
        let Y_max = this.center.y + this.size;
        let Z_min = this.center.z - this.size;
        let Z_max = this.center.z + this.size;
        if (X_min <= pt.x && pt.x <= X_max && Y_min <= pt.y && pt.y <= Y_max && Z_min <= pt.z && pt.z <= Z_max) {
            return true;
        }
    }
    show() {

    }
}