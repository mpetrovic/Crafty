
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
					camera_v = Vector.from_to(camera, get_center(face, data[e].entity)),
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
		offset = 0;
	
	switch (face.facing) {
		case 'front': 
			offset = 0;
			break;
		case 'left':
			offset = 90;
			break;
		case 'right':
			offset = -90;
			break;
		case 'back':
			offset = 180;
			break;
		case 'top':
			return new Vertex(entity.x, entity.y, entity.z+entity.h);
		case 'bottom':
			return new Vertex(entity.x, entity.y, entity.z);
	}
	
	var s = Math.sin(angle+offset),
		c = Math.cos(angle+offset);
	
	return {
		x: face.x * c - face.y * s + entity.x,
		y: face.x * s + face.y * c + entity.y,
		z: face.z
	};
}

/**
 * Combines the rotation of an entity and
 * the direction of a face to get the normal
 * vector of the face
 */
function get_normal(face, entity) {
	
}