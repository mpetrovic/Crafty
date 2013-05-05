
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