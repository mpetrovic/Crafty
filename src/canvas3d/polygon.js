
/**
 * Polygon contains a Linked List of vertices.
 * To render, we only need to traverse the list.
 */
function Polygon() {
	this.head = false;
	this.tail = false;
	this._fill = false;
}

Polygon.prototype = {
	add: function (v) {
		if (!(v instanceof Vertex)) throw 'Exception: Invalid argument';
		
		if (this.head) {
			var tail = this.tail;
			tail.next = this.tail = {
				vertex: v,
				next: this.head
			};
		}
		else {
			this.head = this.tail = {
				vertex: v,
				next: this.head
			}
		}
	},
	remove: function (v) {
		if (!(v instanceof Vertex)) throw 'Exception: Invalid argument';
		
		if (this.head.vertex === v) {
			this.head = this.head.next;
			this.tail = this.head;
		}
		else {
			var current = this.head;
			while (current !== this.tail && current.next.vertex !== v) {
				current = current.next;
			}
			// we broke out of the loop because we found our match
			if (current !== this.tail) {
				if (current.next === this.tail) {
					current.next = this.head;
					this.tail = current;
				}
				else {
					current.next = current.next.next;
				}
			}
			// if we didn't find a match, good. Mission accomplished.
		}
	},
	isInside: function isInside (p) {
		return this.reduce(function isInsideRec (b, curr) {
			if (!b) return b;
			var v1 = {x: curr.vertex.x-p.x, y: curr.vertex.y-p.y},
				v2 = {x: curr.next.vertex.x-p.x, y: curr.next.vertex.y-p.y},
				edge = {x: v1.x-v2.x, y: v1.y-v2.y},
				x = edge.x*v1.y - edge.y*v1.x;
				
				return b && (x >= 0);
		}, true);
	},
	reduce: function reduce (fun, initial) {
		var ret = initial,
			current = this.head;
		
		while (current !== this.tail) {
			ret = fun(ret, current);
			current = current.next;
		}
		
		ret = fun(ret, current);
		
		return ret;
	},
	map: function map (fun) {
		var ret = [],
			current = this.head,
			args = Array.prototype.slice.call(arguments, 1);
			
		while (current !== this.tail) {
			ret.push(fun.apply(current, args));
			current = current.next;
		}
		
		ret.push(fun.apply(current, args));
		
		return ret;
	},
	getPath: function () {
		var list = [],
			current = this.head.next;
		
		if (this.head) {
			list.push(this.head.vertex);
			while (current !== this.head) {
				list.push(current.vertex);
				current = current.next;
			}
			// push head onto the end of the list to close 
			list.push(this.head.vertex);
		}
		
		return list;
	},
	fill: function (fill) {
		if (typeof fill != 'undefined') {
			this._fill = fill;
		}
		
		return this._fill;
	},
}