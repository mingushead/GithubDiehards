var ANIM = {
	buildParticleSystem: function(_particleCount, _particles, _color, _sprite, x0, y0, z0) {

		var particleCount = _particleCount,
	    particles = _particles,
		pMaterial = new THREE.PointsMaterial({
			color: _color,
			size: 2,
			map: _sprite,
			depthTest: false,
			blending: THREE.SubtractiveBlending,
			transparent: true,
			opacity: 1
		});
		// now create the individual particles
		for(var p = 0; p < particleCount; p++) {
			// create a particle with random
			// position values, -250 -> 250
			var pX = (Math.random()*750)-375,
				pY = (Math.random()*750)-375,
				pZ = (Math.random()*750)-375,
			    particle = new THREE.Vector3(pX, pY, pZ);
			// add it to the geometry
			particles.vertices.push(particle);
		}
		// create the particle system
		var particleSystem = new THREE.Points(
			particles,
			pMaterial);
		
		particleSystem.sortParticles = true;

		return particleSystem;
	},
	animateShape: function(particles, x1, y1, z1, shape) {
		var pCount = particles.vertices.length;
		var r0 = particles.vertices.length / 15;
		while(pCount--) {
			var coords = ( shape ? this.randomSpherePoint(x1,y1,z1,r0*0.5, pCount) : this.randomCubeVertPoint(0,0,0,r0*4) );
			setupTween(particles.vertices[pCount], coords[0], coords[1], coords[2], (pCount * 3) + 5000);
		}
	},
	animateParticlesToForksView: function(i, particles, x1, y1, z1) {
		var pCount = particles.vertices.length;
		while(pCount--) {
			var coords = this.randomCubeVertPoint(0, 0, 0, 15, APP.data[i].forks/3.5, 15);
			setupTween(particles.vertices[pCount], coords[0], coords[1], coords[2], (pCount * 3) + 5000);
		}
	},
	randomSpherePoint: function(x0,y0,z0,radius){
	   var u = Math.random();
	   var v = Math.random();
	   var theta = 2 * Math.PI * u;
	   var phi = Math.acos(2 * v - 1);
	   var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
	   var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
	   var z = z0 + (radius * Math.cos(phi));
	   return [x,y,z];
	},
	randomCubeVertPoint: function(x0,y0,z0,w,h,d) {
		if(!h) h = w;
		if(!d) d = w;
		var side = Math.floor(Math.random() * (12 + 1));
		switch(side) {
			case(0):
				return [x0 - (w/2), y0 - (h/2), z0 - (d/2) + Math.random() * d];
			case(1):
				return [x0 - (w/2), y0 + (h/2), z0 - (d/2) + Math.random() * d];
			case(2):
				return [x0 + (w/2), y0 - (h/2), z0 - (d/2) + Math.random() * d];
			case(3):
				return [x0 + (w/2), y0 + (h/2), z0 - (d/2) + Math.random() * d];
			case(4):
				return [x0 - (w/2), y0 - (h/2) + Math.random() * h, z0 - (d/2)];
			case(5):
				return [x0 - (w/2), y0 - (h/2) + Math.random() * h, z0 + (d/2)];
			case(6):
				return [x0 + (w/2), y0 - (h/2) + Math.random() * h, z0 - (d/2)];
			case(7):
				return [x0 + (w/2), y0 - (h/2) + Math.random() * h, z0 + (d/2)];
			case(8):
				return [x0 - (w/2) + Math.random() * w, y0 - (h/2), z0 - (d/2)];
			case(9):
				return [x0 - (w/2) + Math.random() * w, y0 + (h/2), z0 - (d/2)];
			case(10):
				return [x0 - (w/2) + Math.random() * w, y0 - (h/2), z0 + (d/2)];
			default:
				return [x0 - (w/2) + Math.random() * w, y0 + (h/2), z0 + (d/2)];
		}
	},
	randomPointInCuboid: function(x0,y0,z0,w,h,d) {
		return [x0 - (w/2) + (Math.random() * w), y0 - (h/2) + (Math.random() * h), z0 - (d/2) + (Math.random() * d)];
	}
}