
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
				y: 0 //Crafty.viewport.height/2
			};
		
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