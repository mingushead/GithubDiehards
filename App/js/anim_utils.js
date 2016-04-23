var ANIM = {
	buildParticleSystem: function(_particleCount, _particles, _color, _sprite, x0, y0, z0) {
		//set up particle system variables
		var particleCount = _particleCount,
	    particles = _particles,

	    //create material & apply texture
		pMaterial = new THREE.PointsMaterial({
			color: _color,
			size: 14,
			map: _sprite,
			depthTest: false,
			blending: THREE.SubtractiveBlending,
			transparent: true,
			opacity: 0.1
		});

		// now create the individual particles
		for(var p = 0; p < particleCount; p++) {
			// create a particle with random
			// initial position values, -375 -> 375
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
	//general function for handling both the nested cubes animation, and array of spheres animation
	//GITHARDlied on a per-particle-system basis
	animateShape: function(particles, x1, y1, z1, shape) {
		// v=vertex, vol=volume, shape=isCube/isSphere
		var vCount = particles.vertices.length;
		var vol = particles.vertices.length;
		//amount of turns in the spiralling sphere
		var turns = Math.pow(vol, (1/2.3));
		while(vCount--) {
			//set up a tweening function for each particle in the system
			var coords = ( shape ? this.spiralSpherePoint(x1,y1,z1,vol, vCount, turns) : this.getEvenCubeVertPoint(0,0,0,vCount, vol) );
			setupTween(particles.vertices[vCount], coords, (vCount * 3) + 1000);
		}
	},
	//function for handling the conjoin spheres animation
	conjoinSpheres: function(systems, x1, y1, z1) {
		var vCount = 0;
		//get sum of vertices in all particle systems
		for(var i = 0; i < systems.length; i++){
			vCount += systems[i].geometry.vertices.length;
		}
		var vol = vCount;
		var turns = Math.pow(vol, (1/2.3));
		for(var j = 0; j < systems.length; j++){
			//vCount counts down through all vertices in all systems, v counts down vertices in this system
			v = systems[j].geometry.vertices.length;
			while(v--) {
				vCount--;
				var coords = this.spiralSpherePoint(x1, y1, z1, vol, vCount, turns, 1.5);
				setupTween(systems[j].geometry.vertices[v], coords, (v * 3) + 3000);
			}
		}
	},
	animateParticlesToForksView: function(i, particles, x1, y1, z1) {
		var pCount = particles.vertices.length;
		var vol = GITHARD.data[i].forks;
		while(pCount--) {
			var coords = this.getRandomCubeVertPoint(0, 0, 0, vol, 15);
			setupTween(particles.vertices[pCount], coords, (pCount * 3) + 1000);
		}
	},
	spiralSpherePoint: function(x0,y0,z0, volume, vCount, turns, multiplier){
	   var x, y, z;
	   var u = (vCount/volume);
	   var radius = Math.cbrt( (volume/Math.PI) * (3/4) ) * 10 * (multiplier ? multiplier : 1); //10 multiplier just to see things more clearly
	   var phi = Math.acos(2 * u - 1);
	   var theta = 2 * turns * phi % (2 * Math.PI);

	   x = radius * Math.sin(phi) * Math.sin(theta);
	   y = radius * Math.sin(phi) * Math.cos(theta);
	   z = radius *  Math.cos(phi);

	   return [ x0 + x, y0 + y, z0 + z];
	},
	getRandomCubeVertPoint: function(x0,y0,z0,vol,dim) {
		var h = dim ? (vol / Math.pow(dim, 2))*50 : Math.cbrt(vol) * 30;
		w = dim ? dim : h;
		d = dim ? dim : h;
		var side;

		side = Math.floor(Math.random() *12);

		if (w != h) {
			if(Math.random() < 0.6){
				side = Math.floor(Math.random() * 4) + 4;
			}
		}
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
	},
	getEvenCubeVertPoint: function(x0,y0,z0, i, total) {
		var w, h, d;
		w = Math.pow(total, 0.8);
		if(!h) h = w;
		if(!d) d = w;
		i = (i || 0);
		tot = (total || 0);
		sideTotal = tot/12;
		var side = Math.floor(i / sideTotal);
		switch(side) {
			case(0):
				return [x0 - (w/2), y0 - (h/2), z0 - (d/2) + (i%sideTotal/sideTotal) * d];
			case(1):
				return [x0 - (w/2), y0 + (h/2), z0 - (d/2) + (i%sideTotal/sideTotal) * d];
			case(2):
				return [x0 + (w/2), y0 - (h/2), z0 - (d/2) + (i%sideTotal/sideTotal) * d];
			case(3):
				return [x0 + (w/2), y0 + (h/2), z0 - (d/2) + (i%sideTotal/sideTotal) * d];
			case(4):
				return [x0 - (w/2), y0 - (h/2) + (i%sideTotal/sideTotal) * h, z0 - (d/2)];
			case(5):
				return [x0 - (w/2), y0 - (h/2) + (i%sideTotal/sideTotal) * h, z0 + (d/2)];
			case(6):
				return [x0 + (w/2), y0 - (h/2) + (i%sideTotal/sideTotal) * h, z0 - (d/2)];
			case(7):
				return [x0 + (w/2), y0 - (h/2) + (i%sideTotal/sideTotal) * h, z0 + (d/2)];
			case(8):
				return [x0 - (w/2) + (i%sideTotal/sideTotal) * w, y0 - (h/2), z0 - (d/2)];
			case(9):
				return [x0 - (w/2) + (i%sideTotal/sideTotal) * w, y0 + (h/2), z0 - (d/2)];
			case(10):
				return [x0 - (w/2) + (i%sideTotal/sideTotal) * w, y0 - (h/2), z0 + (d/2)];
			default:
				return [x0 - (w/2) + (i%sideTotal/sideTotal) * w, y0 + (h/2), z0 + (d/2)];
		}
	}
}