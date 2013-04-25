/**
 * Defines a vertex in a 2D polygon
 */
function Vertex(x, y) {
	this.x = x;
	this.y = y;
	
	this.edges = [];
}

Vertex.prototype = {
	set: function (x, y) {
		if (typeof x == 'number')
			this.x = x;
		if (typeof y == 'number')
			this.y = y;
	},
	
	addEdge: function (ed) {
		if (!(ed instanceof Edge)) throw 'Exception: Invalid argument';
	}
}