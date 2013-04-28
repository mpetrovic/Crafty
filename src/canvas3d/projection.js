
function Projection(camera, target) {
	this.set(camera, target);
}

Projection.prototype = {
	set: function (camera, target) {
		this.c_vect = new Vector(camera.x, camera.y, camera.z);
		this.t_vect = new Vector(target.x, target.y, target.z);
		
		var d_vect = t_vect.sub(c_vect),
			hyp = Math.sqrt(d_vect.x*d_vect.x + d_vect.y*d_vect.y + d_vect.z*d_vect.z),
			ang = {
				x: Crafty.math.radToDeg(Math.asin(vector.z/hyp)),
				y: 0,
				z: Crafty.math.radToDeg(Math.atan2(-vector.x, -vector.y))
			};
		
		this.ang = ang;
	},
	
	// taken from http://en.wikipedia.org/wiki/3D_projection#Perspective_projection
	// translates a 3d vertex into a 2d vertex
	transform: function (vertex) {
		var cos = Math.cos, sin = Math.sin,
			t_vect = new Vector(target.x, target.y, target.z),
			d_vect = t_vect.sub(c_vect),
			ang = this.ang,
			d_vex = {
				x: cos(ang.y) * (sin(ang.z) * d_vect.y + cos(ang.z) * d_vect.x) - sin(ang.y) * d_vect.z,
				y: sin(ang.x) * (cos(ang.y) * d_vect.z + sin(ang.y) * (sin(ang.z) * d_vect.y + cos(ang.z) * d_vect.x)) + cos(ang.x) * (cos(ang.z) * d_vect.y - sin(ang.z) * d_vect.x),
				z: cos(ang.x) * (cos(ang.y) * d_vect.z + sin(ang.y) * (sin(ang.z) * d_vect.y + cos(ang.z) * d_vect.x)) - sin(ang.x) * (cos(ang.z) * d_vect.y - sin(ang.z) * d_vect.x)
			};
			
		return new Vertex(d_vex.x, d_vex.y);
	},
	
	transformFace: function (face, entity) {
	}
};