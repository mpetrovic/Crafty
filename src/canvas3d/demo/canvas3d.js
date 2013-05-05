//wrap around components
(function(Crafty, window, document) {
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
	
	add: function (v) {
		if (!(v instanceof Vector)) throw 'Exception: Invalid argument';
		
		return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
	},
	
	sub: function (v) {
		if (!(v instanceof Vector)) throw 'Exception: Invalid argument';
		
		return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
	},
	
	length: function() {
		return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
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
function Projection(camera, target) {
	this.set(camera, target);
}

Projection.prototype = {
	set: function (camera, target) {
		this.c_vect = new Vector(camera.x, camera.y, camera.z);
		
		var t_vect = new Vector(target.x, target.y, target.z),
			d_vect = t_vect.sub(this.c_vect),
			hyp = Math.sqrt(d_vect.x*d_vect.x + d_vect.y*d_vect.y + d_vect.z*d_vect.z),
			ang = {
				x: (Math.acos(d_vect.z/hyp)),
				y: 0,
				z: (Math.atan2(d_vect.y, -d_vect.x))
			};
		
		this.ang = ang;
	},
	
	// taken from http://en.wikipedia.org/wiki/3D_projection#Perspective_projection
	// translates a 3d vertex into a 2d vertex
	transform: function transform (vector) {
		var cos = Math.cos, sin = Math.sin,
			t_vect = new Vector(vector.x, vector.y, vector.z),
			d_vect = t_vect.sub(this.c_vect),
			ang = this.ang,
			d_vex = {
				x: (sin(ang.z) * d_vect.x + cos(ang.z) * d_vect.y),
				y: (sin(ang.x) * (d_vect.z)) + (cos(ang.x) * (cos(ang.z) * d_vect.x - sin(ang.z) * d_vect.y)),
				z: (cos(ang.x) * (d_vect.z)) - (sin(ang.x) * (cos(ang.z) * d_vect.x - sin(ang.z) * d_vect.y))
			},
			r_dim = {
				z: Math.sqrt(Crafty.viewport.width*Crafty.viewport.width + Crafty.viewport.height*Crafty.viewport.height)
			},
			r_vex = {
				x: d_vex.x * (r_dim.z / d_vex.z),
				y: d_vex.y * (r_dim.z / d_vex.z)
			};
			
			
		return new Vertex(r_vex.x >> 0, -(r_vex.y >> 0), d_vex.z);
	},
	
	transformFace: function transformFace (face, entity) {
		var points = [];
		
		switch (face.facing) {
			case 'front':
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z));
				break;
			case 'left':
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z));
				break;
			case 'right':
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z));
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x, entity.y, entity.z));
				break;
			case 'back':
				points.push(new Vector(entity.x, entity.y, entity.z));
				points.push(new Vector(entity.x, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z));
				break;
			case 'top':
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x, entity.y, entity.z+entity.h));
				break;
			case 'below':
				points.push(new Vector(entity.x, entity.y, entity.z));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z));
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z));
				break;
			
		}
		
		var poly = new Polygon();
		for (var i = 0; i < points.length; i++) {
			var vert = this.transform(points[i]);
			poly.add(vert);
		}
		poly.fill(face.paint['background-color']);
		poly.facing = face.facing;
		
		return poly;
	}
};
function Painter(camera) {
	var canvas = document.querySelectorAll('#camera_'+camera.label)[0];
	
	this.ctx = canvas.getContext('2d');
}

Painter.prototype = {
	render: function (polys) {
		var i = 0,
			l = polys.length,
			j = 0,
			verts, first,
			off = {
				x: Crafty.viewport.width/2,
				y: Crafty.viewport.height/2
			};
			
		this.ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height);
		
		polys = polys.reverse();
		
		for (i=0; i<l; i++) {
			verts = polys[i].getPath();
			first = verts.shift();
			
			this.ctx.beginPath();
			this.ctx.moveTo(first.x+off.x, first.y+off.y);
			for (j=0; j<verts.length; j++) {
				this.ctx.lineTo(verts[j].x+off.x, verts[j].y+off.y);
				this.ctx.stroke();
			}
			this.ctx.fillStyle = polys[i].fill();
			this.ctx.fill();
		}
	},
};
function ZBuffer(camera) {
	var canvas = document.querySelectorAll('#camera_'+camera.label)[0];
	
	this.ctx = canvas.getContext('2d');
}

ZBuffer.prototype = {
	getDepth: function getDepth(x, y, poly) {
		var weights = poly.map(function weightValue () {
			var x_diff = x - this.vertex.x,
				y_diff = y - this.vertex.y;
			return {
				weight: Math.sqrt(x_diff*x_diff + y_diff*y_diff),
				value: this.vertex.depth
			};
		}),
			total = 0,
			total2 = 0,
			i = 0, l = weights.length,
			top = 0;
		
		for (;i<l;i++) {
			total += weights[i].weight;
		}
		for (i=0;i<l;i++) {
			top += (total - weights[i].weight) * weights[i].value;
			total2 += (total - weights[i].weight);
		}
		
		return top/total2;
	},
	
	drawPixel: function drawPixel(x, y, poly) {
		var pixel = this.ctx.createImageData(1, 1),
			color = this.getRGBFromColor(poly.fill());
			
		pixel.data[0] = color.r;
		pixel.data[1] = color.g;
		pixel.data[2] = color.b;
		pixel.data[3] = 255;
		
		this.ctx.putImageData(pixel, x, y);
	},
	
	render: function(polys) {
		this.ctx.clearRect(0, 0, Crafty.viewport.width, Crafty.viewport.height);
		
		var buffer = [],
			x = 0, 
			y = 0,
			i = 0,
			off = {
				x: Crafty.viewport.width/2,
				y: Crafty.viewport.height/2 >> 0
			};

		for (;x<Crafty.viewport.width;x++) {
			for (y=0;y<Crafty.viewport.height;y++) {
				var vert = {x: x-off.x, y: y-off.y};
				for (i=0;i<polys.length;i++) {
					var isInside = polys[i].isInside(vert);
					if (isInside) {
						var depth = this.getDepth(vert.x, vert.y, polys[i]),
							key = x+'-'+y;
						if ((typeof buffer[key] == 'number' && buffer[key] > depth) 
							|| typeof buffer[key] == 'undefined') {
							buffer[key] = depth;
							this.drawPixel(x, y, polys[i]);
						}
					}
				}
			}
		}
	},
	
	getRGBFromColor: function (color) {
		var c_arr = colorLookup(color).split(''),
			color = {r: 0, g: 0, b: 0};
			
		if (c_arr[0] == '#') {
			if (c_arr.length == 4) {
				color.r = parseInt(c_arr[1]+c_arr[1], 16);
				color.g = parseInt(c_arr[2]+c_arr[2], 16);
				color.b = parseInt(c_arr[3]+c_arr[3], 16);
			}
			else if (c_arr.length == 7) {
				color.r = parseInt(c_arr[1]+c_arr[2], 16);
				color.g = parseInt(c_arr[3]+c_arr[4], 16);
				color.b = parseInt(c_arr[5]+c_arr[6], 16);
			}
		}
		
		return color;
	}
};

function colorLookup(color) {
	var colornames = {
		aqua: '#00ffff', black: '#000000', blue: '#0000ff', fuchsia: '#ff00ff',
		gray: '#808080', green: '#008000', lime: '#00ff00', maroon: '#800000',
		navy: '#000080', olive: '#808000', purple: '#800080', red: '#ff0000',
		silver: '#c0c0c0', teal: '#008080', white: '#ffffff', yellow: '#ffff00'
	};
	
	if (typeof colornames[color] != 'undefined') {
		return colornames[color];
	}
	return color;
}
Crafty.camera.modes.canvas3d = {
	lookAt: function (x, y, z) {
		if (typeof x == 'object' && x) {
			y = x.y;
			z = x.z;
			x = x.x;
		}
		this.target.x = x;
		this.target.y = y;
		this.target.z = z;
		this.changed = true;
		
		return this;
	},
	composite: 'painter',
	_render: function render (data) {
		
		var faces = [],
			changed = this.changed;
		
		// collect list of all faces to render
		for (var e in data) {
			for (var i in data[e].faces) {
				// backface filtering:
				// get dot product of camera to face and face normal
				// if it's greater than 0, the camera can't see the
				// renderable side of the face
				var face = data[e].faces[i],
					camera_v = Vector.create_from_to(this, get_center(face, data[e].entity)),
					face_v = get_normal(face, data[e].entity);
				
				changed = face.dirty || changed;
				
				face.distance = camera_v.length();
				face.entity = data[e].entity;
				
				if (camera_v.dot(face_v) < 0) {
					faces.push(face);
				}
			}
		}
		
		if (!this.changed) return;
		
		// sort by distance from camera
		faces.sort(function sort (a, b) {
			if (a.distance < b.distance)
				return -1;
			else if (a.distance > b.distance)
				return 1;
			return 0;
		});
		
		var polys = [],
			proj = new Projection(this, this.target);
		for (var i = 0; i < faces.length; i++) {
			polys.push(proj.transformFace(faces[i], faces[i].entity));
		}
		
		var painter = null;
		switch (this.composite) {
			case 'zbuffer':
				painter = new ZBuffer(this);
				break;
			case 'bbuffer':
				//painter = new BBuffer(this);
			case 'painter':
			default:
				painter = new Painter(this);
		}
		console.profile();
		painter.render(polys);
		console.profileEnd();
	}
};

function get_center(face, entity) {
	var angle = entity.rotation,
		offset = 0,
		cent = {
			x: entity.x + entity.l/2,
			y: entity.y + entity.w/2
		},
		p = {
			x: -entity.w/2,
			y: 0
		};
	
	switch (face.facing) {
		case 'front': 
			offset = 270;
			break;
		case 'left':
			offset = 180;
			break;
		case 'right':
			offset = 0;
			break;
		case 'back':
			offset = 90;
			break;
		case 'top':
			return new Vector(cent.x, cent.y, entity.z+entity.h);
			break;
		case 'below':
			return new Vector(cent.x, cent.y, entity.z);
			break;
	}
	
	var s = Math.sin(Crafty.math.degToRad(angle+offset)),
		c = Math.cos(Crafty.math.degToRad(angle+offset));
	
	return new Vector((p.x * c - p.y * s + cent.x) >> 0,
		(p.x * s + p.y * c + cent.y) >> 0,
		entity.z+face.z
	);
}

/**
 * Combines the rotation of an entity and
 * the direction of a face to get the normal
 * vector of the face
 */
function get_normal(face, entity) {
	var f_cent = get_center(face, entity),
		e_cent = new Vector(entity.x + entity.l/2, entity.y + entity.w/2, entity.z+(entity.h/2));
		
	return f_cent.sub(e_cent);
}

})(Crafty,window,window.document);
//@ sourceURL=canvas3d.js