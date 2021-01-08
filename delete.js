/**
 * Determines the point of intersection between a plane defined by a point and a normal vector and a line defined by a point and a direction vector.
 *
 * @param planePoint    A point on the plane.
 * @param planeNormal   The normal vector of the plane.
 * @param linePoint     A point on the line.
 * @param lineDirection The direction vector of the line.
 * @return The point of intersection between the line and the plane, null if the line is parallel to the plane.
 */
public static Vector lineIntersection(Vector planePoint, Vector planeNormal, Vector linePoint, Vector lineDirection) {
    if (Plane.normal.dot(ray.dir.normalize()) == 0) {
        return undefined;
    }

    let t = (Plane.normal.dot(Plane.a) - Plane.normal.dot(ray.pos)) / Plane.normal.dot(ray.dir.normalize());
    return ray.pos.add(ray.dir.normalize().scale(t));
}