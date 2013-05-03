
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
		console.log({x: Crafty.math.radToDeg(ang.x), z: Crafty.math.radToDeg(ang.z)});
	},
	
	// taken from http://en.wikipedia.org/wiki/3D_projection#Perspective_projection
	// translates a 3d vertex into a 2d vertex
	transform: function (vector) {
		var cos = Math.cos, sin = Math.sin,
			t_vect = new Vector(vector.x, vector.y, vector.z),
			d_vect = t_vect.sub(this.c_vect),
			ang = this.ang,
			d_vex = {
				x: cos(ang.y) * (sin(ang.z) * d_vect.y + cos(ang.z) * d_vect.x) - sin(ang.y) * d_vect.z,
				y: sin(ang.x) * (cos(ang.y) * d_vect.z + sin(ang.y) * (sin(ang.z) * d_vect.y + cos(ang.z) * d_vect.x)) + cos(ang.x) * (cos(ang.z) * d_vect.y - sin(ang.z) * d_vect.x),
				z: cos(ang.x) * (cos(ang.y) * d_vect.z + sin(ang.y) * (sin(ang.z) * d_vect.y + cos(ang.z) * d_vect.x)) - sin(ang.x) * (cos(ang.z) * d_vect.y - sin(ang.z) * d_vect.x)
			},
			r_dim = {
				x: Crafty.viewport.width,
				y: Crafty.viewport.height,
				z: Crafty.viewport.width/4 + Crafty.viewport.height/3
			},
			r_vex = {
				x: d_vex.x * (r_dim.z / d_vex.z),
				y: d_vex.y * (r_dim.z / d_vex.z)
			};
			
		return new Vertex(r_vex.x >> 0, r_vex.y >> 0);
	},
	
	transformFace: function (face, entity) {
		var points = [];
		
		switch (face.facing) {
			case 'front':
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z));
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z));
				break;
			case 'left':
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z));
				break;
			case 'right':
				points.push(new Vector(entity.x, entity.y, entity.z));
				points.push(new Vector(entity.x, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z));
				break;
			case 'back':
				points.push(new Vector(entity.x, entity.y, entity.z));
				points.push(new Vector(entity.x, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z));
				break;
			case 'top':
				points.push(new Vector(entity.x, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z+entity.h));
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