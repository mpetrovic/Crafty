/**
 * Defines a vertex in a 2D polygon
 */
function Vertex(x, y, depth) {
	this.x = x;
	this.y = y;
	this.depth = depth;
}

Vertex.prototype = {
	set: function (x, y, depth) {
		if (typeof x == 'number')
			this.x = x;
		if (typeof y == 'number')
			this.y = y;
		if (typeof depth == 'number') {
			this.depth = depth;
		}
	},
}