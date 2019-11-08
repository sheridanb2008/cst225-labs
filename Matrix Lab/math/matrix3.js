/*
 * An object representing a 3x3 matrix
 */

var Matrix3 = function() {

	if (!(this instanceof Matrix3)) {
		alert("Matrix3 constructor must be called with the new operator");
	}

	// Stores a matrix in a flat array - left to right, top to bottom.
	// This format will be similar to what we'll eventually need to provide the WebGL API
	this.elements = new Float32Array(9);

	// todo
	// "this.elements" should be initialized with values equal to the identity matrix --> (1, 0, 0, 0, 1, 0, 0, 0, 1)
	for (var i = 0; i < 9; ++i) {
		this.elements[i] = (i % 3 == Math.floor(i / 3)) ? 1 : 0;
	};

	// -------------------------------------------------------------------------
	this.clone = function() {
		// todo
		// create a new Matrix3 instance that is an exact copy of 'this' one and return it
		// cloneMatrix.set(this.elements[0], this.elements[1], this.elements[2], this.elements[3], this.elements[4], this.elements[5], this.elements[6], this.elements[7], this.elements[8]);
		
		return this.matrixClone; /* should be a new Matrix instance*/;
	};

	// -------------------------------------------------------------------------
	this.copy = function(other) {
		// todo
		// copy all of the elements of other into the elements of 'this' matrix
		for (var i = 0; i < 9; ++i) {
			this.elements[i] = other.elements[i];
		};
		return this;
	};

	// -------------------------------------------------------------------------
	this.set = function (e11, e12, e13, e21, e22, e23, e31, e32, e33) {
		// todo
		// given the 9 elements passed in as argument e-row#col#, use
		// them as the values to set on 'this' matrix.
		// Order is left to right, top to bottom.
		for (var i = 0, j = arguments.length; i < j; i++) {
			this.elements[i] = arguments[i];
		}
		return this;
	};

	// -------------------------------------------------------------------------
	this.getElement = function(row, col) {
		// todo
		// use the row and col to get the proper index into the 1d element array and return it
		var index = row * 3 + col;
		return this.elements[index];
		// return this; // <== delete this line and use the one above
	};

	// -------------------------------------------------------------------------
	this.setIdentity = function() {
		// todo
		// reset every element in 'this' matrix to make it the identity matrix
		for (var i = 0; i < 9; ++i) {
			this.elements[i] = (i % 3 == Math.floor(i / 3)) ? 1 : 0;
		};
		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationX = function(angle) {
		// not required yet, attempt to implement if finished early
		// create a rotation matrix that rotates around the X axis
		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationY = function(angle) {
		// not required yet, attempt to implement if finished early
		// create a rotation matrix that rotates around the Y axis
		return this;
	};

	// -------------------------------------------------------------------------
	this.setRotationZ = function(angle) {
		// not required yet, attempt to implement if finished early
		// create a rotation matrix that rotates around the Z axis
		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyScalar = function(s) {
		// todo
		// multiply every element in 'this' matrix by the scalar argument s
		for (var i = 0; i < 9; ++i) {
			this.elements[i] = this.elements[i] * s;
		};
		return this;
	};

	// -------------------------------------------------------------------------
	this.multiplyRightSide = function(otherMatrixOnRight) {
		// todo
		// multiply 'this' matrix (on the left) by otherMatrixOnRight (on the right)
		// the results should be applied to the elements on 'this' matrix

		return this;
	};

	// -------------------------------------------------------------------------
	this.determinant = function() {
		// todo
		// compute and return the determinant for 'this' matrix
		return Math.Infinity; // should be the determinant
	};

	// -------------------------------------------------------------------------
	this.transpose = function() {
		// todo
		// modify 'this' matrix so that it becomes its transpose
		return this;
	};

	// -------------------------------------------------------------------------
	this.inverse = function() {
		// todo
		// modify 'this' matrix so that it becomes its inverse
		return this;
	};

	// -------------------------------------------------------------------------
	this.log = function() {
		var e = this.elements;
		console.log('[ '+
      '\n ' + e[0]  + ', ' + e[1]  + ', ' + e[2]  +
      '\n ' + e[4]  + ', ' + e[5]  + ', ' + e[6]  +
      '\n ' + e[8]  + ', ' + e[9]  + ', ' + e[10] +
      '\n ' + e[12] + ', ' + e[13] + ', ' + e[14] +
      '\n]'
		);

		return this;
	};
};
