
function Vector(x, y, z) {
	this.x = x;
	this.y = y;
	this.z = z;
}

Vector.prototype = {
	set: function (x, y, z) {
		if (typeof x == 'number')
			this.x = x;
		if (typeof y == 'number')
			this.y = y;
		if (typeof z == 'number')
			this.z = z;
	},
	
	sub: function (v) {
		if (!(v instanceof Vector)) throw 'Exception: Invalid argument';
		
		return new Vertex(this.x - v.x, this.y - v.y, this.z - v.z);
	},
	
	length: function() {
		return Math.sqrt(this.x*this.x, this.y*this.y, this.z*this.z);
	},
	
	dot: function (v) { 
		if (!(v instanceof Vector)) throw 'Exception: Invalid argument';
		
		return ((this.x*v.x + this.y*v.y + this.z*v.z)/(this.length() * v.length()));
	}
};

Vector.create_from_to = function (from, to) {
	if (!('x' in from) || !('x' in to)) throw 'Exception: Invalid argument';
	
	var x = to.x - from.x,
		y = to.y - from.y,
		z = to.z - from.z;
	
	return new Vector(x, y, z);
}