
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
		
		var faces = [];
		
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
				
				face.distance = camera_v.length();
				
				if (camera_v.dot(face_v) < 0) {
					faces.push(face);
				}
			}
		}
		
		// sort by distance from camera
		faces.sort(function (a, b) {
			if (a.distance < b.distance)
				return -1;
			else if (a.distance > b.distance)
				return 1;
			return 0;
		});
	}
};

function get_center(face, entity) {
	var angle = entity.rotation,
		offset = 0,
		cent = {
			x: entity.x + entity.w/2,
			y: entity.y + entity.l/2
		},
		p = {
			x: entity.y,
			y: entity.w/2
		};
	
	switch (face.facing) {
		case 'front': 
			offset = 0;
			break;
		case 'left':
			offset = -90;
			break;
		case 'right':
			offset = 90;
			break;
		case 'back':
			offset = 180;
			break;
		case 'top':
			return new Vector(cent.x, cent.y, entity.z+entity.h);
		case 'below':
			return new Vector(cent.x, cent.y, entity.z);
	}
	
	var s = Math.sin(Crafty.math.degToRad(angle+offset)),
		c = Math.cos(Crafty.math.degToRad(angle+offset));
	
	return new Vector((p.x * c - p.y * s + cent.x) >> 0,
		(p.x * s + p.y * c + cent.y) >> 0,
		face.z
	);
}

/**
 * Combines the rotation of an entity and
 * the direction of a face to get the normal
 * vector of the face
 */
function get_normal(face, entity) {
	var f_cent = get_center(face, entity),
		e_cent = new Vector(entity.x + entity.w/2, entity.y + entity.l/2, entity.z+(entity.h/2));
		
	return f_cent.sub(e_cent);
}
