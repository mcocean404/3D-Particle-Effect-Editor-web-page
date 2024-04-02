import { scene } from '../../main.js'

export class ParticleSystem {
	constructor() {
		// 基本
		this.particleName = 'end_rod'
		this.position = {x: 0, y: 0, z: 0};
		this.initScale = .4
		this.scale = {x: 1, y: 1, z: 1};
		this.rotation = {x: 0, y: 0, z: 0};
		this.age = 5
		this.animation = false
		this.grow = 0
		this.PassDraw_of_color = true
		this.dx = 0
		this.dy = 0
		this.dz = 0

		// 颜色
		this.color = "#00aaff"
		this.rgb = { r: 0, g: 170, b: 255 }
		this.THREEcolor = 0x00aaff

		// 几何材质
		this.geometry = new THREE.BufferGeometry();
		this.uniforms = { uTime: { value: 0 }}
		this.shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                uniform float uTime;
                attribute vec3 color;
                varying vec3 vColor;

                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = 3.0;
                    gl_Position = projectionMatrix * mvPosition;
                    vColor = color;
                }
            `,

			fragmentShader: `
                varying vec3 vColor;

                void main() {
                    gl_FragColor = vec4(vColor, 1.0);
                }
            `
        });

		// 统计
		this.positions = new Float32Array(0)
		this.colors = new Float32Array(0);
		this.countParticles = 0

		// 状态
		this.rendering = false;

		// 结果
		this.SEType = 'null'
		this.command = null
	}

	
	clear() {
		scene.remove(this.particles)
		clearInterval(this.loop);
		scene.remove(this.pivots);
		this.countParticles = 0; // 重置粒子数量
	}

	initParticleGroup() {
		this.particleGroup = new THREE.Points(this.geometry, this.material);
		scene.add(this.particleGroup);
	}

	addParticle(x, y, z, rgb) {
		let newPositions = new Float32Array(this.positions.length + 3);
		newPositions.set(this.positions);
		newPositions[this.positions.length] = x;
		newPositions[this.positions.length + 1] = y;
		newPositions[this.positions.length + 2] = z;
		this.positions = newPositions;

		let newColors = new Float32Array(this.colors.length + 3);
		newColors.set(this.colors);
		newColors[this.colors.length] = rgb.r / 255;
		newColors[this.colors.length + 1] = rgb.g / 255;
		newColors[this.colors.length + 2] = rgb.b / 255;

		this.colors = newColors;
	}

	updateParticlePositions() {
		this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		this.geometry.attributes.position.needsUpdate = true;
	}
	updateParticleColors() {
		this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
		this.geometry.attributes.color.needsUpdate = true;
	}

	setColors() {
		for (let i = 0; i < this.colors.length; i ++) {
			
			this.colors[i * 3] = this.rgb.r / 255;
			this.colors[i * 3 + 1] = this.rgb.g / 255;
			this.colors[i * 3 + 2] = this.rgb.b / 255;
		}
		this.updateParticleColors();

		console.log("color updated");
	}
}