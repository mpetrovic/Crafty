
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
				x: 0,
				y: (Math.atan2(d_vect.y, -d_vect.x)),
				z: (Math.acos(d_vect.z/hyp))
			};
		
		this.ang = ang;
		console.log(this.ang);
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
			};
			console.log(d_vex);
			
		return new Vertex(d_vex.x, d_vex.y);
	},
	
	transformFace: function (face, entity) {
		var points = [];
		
		switch (face.facing) {
			case 'front':
				points.push(new Vector(entity.x, entity.y, entity.z));
				points.push(new Vector(entity.x, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y, entity.z));
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
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z));
				points.push(new Vector(entity.x, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z+entity.h));
				points.push(new Vector(entity.x+entity.w, entity.y+entity.l, entity.z));
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
		
		return poly;
	}
};