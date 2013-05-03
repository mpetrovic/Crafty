
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
	_render: function (data) {
		
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
		faces.sort(function (a, b) {
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
		
		var painter = new Painter(this);
		painter.render(polys);
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

