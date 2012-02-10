
var schemes = {
	complementary: [0, 180],
	splitComplementary: [0, 150, 320],
	splitComplementaryCW: [0, 150, 300],
	splitComplementaryCCW: [0, 60, 210],
	triadic: [0, 120, 240],
	clash: [0, 90, 270],
	tetradic: [0, 90, 180, 270],
	fourToneCW: [0, 60, 180, 240],
	fourToneCCW: [0, 120, 180, 300],
	fiveToneA: [0, 115, 155, 205, 245],
	fiveToneB: [0, 40, 90, 130, 245],
	fiveToneC: [0, 50, 90, 205, 320],
	fiveToneD: [0, 40, 155, 270, 310],
	fiveToneE: [0, 115, 230, 270, 320],
	sixToneCW: [0, 30, 120, 150, 240, 270],
	sixToneCCW: [0, 90, 120, 210, 240, 330],
	neutral: [0, 15, 30, 45, 60, 75],
	analogous: [0, 30, 60, 90, 120, 150]
};

var Color = function(color, type) {
	if (['rgb', 'hsl'].indexOf(type) == -1) {
		type = 'rgb';
	}
	if (color instanceof Color) {
		this._h = color._h;
		this._s = color._s;
		this._l = color._l;
		this._o = color._o;
	} else if (color instanceof Array) {
		if (color[3]) {
			this._o = color[3];
		}
		if (type == 'rgb' && color[0] !== undefined && color[1] !== undefined && color[2] !== undefined) {
			color = rgbToHsl.apply(undefined, color);
		}
		if (color[0] !== undefined && color[1] !== undefined && color[2] !== undefined) {
			this._h = color[0];
			this._s = color[1];
			this._l = color[2];
			return this;
		}
	} else if (typeof(color) == 'string') {
		var color = hexToRgba(color);
		this._o = color[3];
		color = rgbToHsl.apply(undefined, color);
		this._h = color[0];
		this._s = color[1];
		this._l = color[2];
	}
	return this;
}

Color.prototype = {
	
	_h: 0,
	_s: 0,
	_l: 0,
	_o: 1,
	
	scheme: function(name) {
		if (schemes[name]) {
			var self = this;
			var scheme = schemes[name];
			if (scheme instanceof Function) scheme = scheme.call(this);
			var colors = [];
			if (scheme instanceof Array) {
				scheme.forEach(function(i, dif) {
					var color = new Color(self);
					if (typeof(dif) == 'number') {
						color.spin(dif);
					} else if (dif instanceof Array) {
						if (dif[0]) color.spin(dif[0]);
						if (dif[1]) color.saturate(dif[1]);
						if (dif[2]) color.lighten(dif[2]);
						if (dif[3]) color.fade(dif[3]);
					}
					colors.push(color);
				});
				return colors;
			}
		}
		return [this];
	},
	
	saturate: function(percent) {
		if (percent === undefined) {
			this.saturation(1);
		} else {
			var s = this._s * (percent + 1);
			this.saturation(s);
		}
		return this;
	},
	
	desaturate: function(percent) {
		if (percent === undefined) {
			this.saturation(0);
		} else {
			this.saturate(-percent);
		}
		return this;
	},
	
	lighten: function(percent) {
		if (percent !== undefined) {
			var l = this._l * (percent + 1);
			this.lightness(l);
		}
		return this;
	},
	
	darken: function(percent) {
		if (percent !== undefined) {
			this.lighten(-percent);
		}
		return this;
	},
	
	spin: function(spin) {
		if (typeof(spin) != 'number') return this;
		var h = this._h + spin;
		this.hue(h);
		return this;
	},
	
	hue: function(value) {
		if (value) {
			this._h = value;
			this._normalize();
			return this;
		};
		return this._h;
	},
	
	saturation: function(value) {
		if (value !== undefined) {
			this._s = value;
			this._normalize();
			return this;
		};
		return this._s;
	},
	
	lightness: function(value) {
		if (value !== undefined) {
			this._l = value;
			this._normalize();
			return this;
		};
		return this._l;
	},
	
	fadein: function(percent) {
		return this.fadeout(-percent);
	},
	
	fadeout: function(percent) {
		if (percent === undefined) return this;
		var o = this._o * (percent + 1);
		return this;
	},
	
	fade: function(value) {
		if (value !== undefined) {
			if (value >= 0 && value <= 1) this._o = value;
			this._normalize();
			return this;
		}
		return this._o;
	},
	
	to: function(type) {
		if (['hex', 'rgb'].indexOf(type) == -1) type = 'hex';
		var out = '', rgb = hslToRgb(this._h, this._s, this._l);
		switch(type) {
			case 'hex':
				out = rgbToHex.apply(undefined, rgb);
				out.toUpperCase();
				break;
			case 'rgb':
				rgb.push(this._o);
				out = rgbaToString.apply(undefined, rgb);
				break;
		}
		return out;
	},
	
	hex: function() {
		return this.to('hex');
	},
	
	rgb: function() {
		return this.to('rgb');
	},
	
	_normalize: function() {
		while(this._h < 0) this._h += 360;
		this._h %= 360;
		this._s = Math.min(Math.max(0, this._s), 1);
   		this._l = Math.min(Math.max(0, this._l), 1);
   		this._o = Math.min(Math.max(0, this._o), 1);
	},
	
	clone: function() {
		return new Color(this);
	},
	
	toString: function() {
		return this._o == 1 ? this.hex() : this.rgb();
	},
	
	luminance: function(value) {
		var step = 0.01;
		if (value !== undefined) {
			if (value > 254) {
				this.lightness(1);
				return this;
			} else if (value < 1) {
				this.lightness(0);
				return this;
			}
			var current = this.luminance();
			while ( Math.abs(value - current) > 0.5 ) {
				var lightness = this.lightness();
				this.lightness(lightness * value / current);
				var current = this.luminance();
			}
			return this;
		}
		var color = hslToRgb(this._h, this._s, this._l);
		var r = color[0];
		var g = color[1];
		var b = color[2];
		return Math.sqrt(r*r*.241 + g*g*.691+b*b*.068);
	},
	
	mix: function(color) {
		var color2 = new Color(color);
		var rgb1 =  hslToRgb(this._h, this._s, this._l);
		var rgb2 = hslToRgb(color2._h, color2._s, color2._l);
		var rgb = [(rgb2[0] + rgb1[0])/2, (rgb2[1] + rgb1[1])/2, (rgb2[2] + rgb1[2])/2];
		var hsl = rgbToHsl.apply(undefined, rgb);
		this._h = hsl[0];
		this._s = hsl[1];
		this._l = hsl[2];
		return this;
	}
	
};

var colors = {};

var color = module.exports = function() {
	if ((typeof(arguments[0]) == 'string' && arguments[0][0] == '#') || typeof(arguments[0]) != 'string') {
		if (arguments[0].constructor === Object) {
			var obj = arguments[0];
			for (var name in obj) {
				color(name, obj[name], arguments[1]);
			}
			return color;
		}
		return new Color(arguments[0], arguments[1]);
	}
	if (arguments[1]) {
		colors[arguments[0]] = [arguments[1], arguments[2]];
		return color;
	}
	var clr = colors[arguments[0]];
	if (clr) {
		return new Color(clr[0], clr[1]);
	} else {
		console.log('node-color: color not found `' + arguments[0] + '`');
		return new Color();
	}
}

color.scheme = function(name, scheme) {
	if (typeof(name) != 'string' || (!(scheme instanceof Array) && (!(scheme instanceof Function)))) return;
	schemes[name] = scheme;
}

color.rgbToHsl = rgbToHsl;
color.hslToRgb = hslToRgb;
color.hexToRgba = hexToRgba;
color.rgbaToString = rgbaToString;
color.rgbToHex = rgbToHex;

function rgbToHsl(r, g, b){
    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s, l];
}

function hslToRgb(h, s, l){
    var r, g, b;
    h /= 360;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [parseInt(r * 255), parseInt(g * 255), parseInt(b * 255)];
}
    
function hexToRgba(hex) {
	hex = hex.replace('#', '');
	if (hex.length == 3 || hex.length == 4) {
		var rgb = hex.split('');
		rgb = rgb.map(function(color) {
			return parseInt(color, 16) * 17;
		});
	} else if (hex.length == 6 || hex.length == 8) {
		var rgb = hex.match(/(.{2})/g);
		rgb = rgb.map(function(color) {
			return parseInt(color, 16);
		});
	} else {
		var rgb = [0, 0, 0, 1];
	}
	if (rgb.length == 4) {
		rgb.push(rgb.shift() / 255);
	} else {
		rgb.push(1);
	}
	return rgb;
}

function rgbaToString(r, g, b, a) {
	if (a != 1) {
		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
	} else {
		return 'rgb(' + r + ', ' + g + ', ' + b + ')';
	}
}

function rgbToHex(r, g, b) {
	out = '#';
	r = r.toString(16);
	if (r.length == 1) r = '0' + r;
	g = g.toString(16);
	if (g.length == 1) g = '0' + g;
	b = b.toString(16);
	if (b.length == 1) b = '0' + b;
	out += r + g + b;
	return out;
}