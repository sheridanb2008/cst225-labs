/* Names Craig Calvert and Brian Sheridan
 * An object type representing an implicit sphere.
 *
 * @param center A Vector3 object representing the position of the center of the sphere
 * @param radius A Number representing the radius of the sphere.
 */

var Sphere = function(center, radius) {
  if (!(this instanceof Sphere)) {
    console.error("Sphere constructor must be called with the new operator");
  }

  if (!(center instanceof Vector3)) {
      //console.error("The sphere center must be a Vector3");
      center = new Vector3(0, 0, 0);
  }

  if ((typeof(radius) != 'number')) {
      //console.error("The radius must be a Number");
      radius = 1;
  }

  this.center = center;
  this.radius = radius;

  // todo - make sure center and radius are replaced with default values if and only if they
  // are invalid or undefined (i.e. center should be of type Vector3 & radius should be a Number)
  // - the default center should be the zero vector
  // - the default radius should be 1


    this.raycast = function(ray) {
        // todo determine whether the ray intersects this sphere and where

        // Recommended steps
        // ------------------
        // 0. (optional) watch the video showing the complete implementation of plane.js
        //    You may find it useful to see a different piece of geometry coded.
        // 1. review slides/book math
        // 2. create the vector(s) needed to solve for the coefficients in the
        //    quadratic equation
        // 3. calculate the discriminant
        // 4. use the discriminant to determine if further computation is necessary
        // 5. return the following object literal "result" based on the following cases:
        //    case 1: no VALID intersections
        //      var result = { hit: false, point: null }
        //    case 2: 1 or more intersections
        //      var result = {
        //        hit: true,
        //        point: 'a Vector3 containing the closest VALID intersection',
        //        normal: 'a vector3 containing a unit length normal at the intersection point',
        //        distance: 'a scalar containing the intersection distance from the ray origin'
        //      }
        // Create points for Quad formula
        var pHat = (ray.origin.clone()).subtract(this.center);
        var aQuad = ray.direction.dot(ray.direction);
        var bQuad = ((ray.direction.clone()).multiplyScalar(2)).dot(pHat);
        var cQuad = (pHat.dot(pHat)) - Math.pow(radius, 2);
        // Test for intersection 
        var discriminant = Math.pow(bQuad, 2) - (4 * aQuad * cQuad);
        var alpha1 = (-1 * bQuad + Math.sqrt(discriminant)) / 2 * aQuad;
        var alpha2 = (-1 * bQuad - Math.sqrt(discriminant)) / 2 * aQuad;
        var intersectionPoint = ((ray.origin.clone()).add((ray.direction.clone()).multiplyScalar(Math.min(alpha1, alpha2))))
        // An object created from a literal that we will return as our result
        var result = {
            hit: null,      // should be of type Boolean
            point: null,    // should be of type Vector3
            normal: null,   // should be of type Vector3
            distance: null, // should be of type Number (scalar)
        };
        // Assign values to the result return point
        if ((discriminant > 0 && alpha1 > 0 || alpha2 > 0) && ray.origin.subtract(this.center).length() > Math.pow(radius, 2)) { result.hit = true } else { result.hit = false };
        result.point = intersectionPoint;
        result.normal = ((intersectionPoint.clone()).subtract(this.center)).normalize()
        result.distance = Math.min(alpha1, alpha2);
        return result;
    };
};
