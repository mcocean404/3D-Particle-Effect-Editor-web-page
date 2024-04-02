// import * as EffectComposer from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/postprocessing/EffectComposer.js"
// import * as RenderPass from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/postprocessing/RenderPass.js"
// import * as ShaderPass from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/postprocessing/ShaderPass.js"
// import * as CopyShader from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/shaders/CopyShader.js"
// import * as LuminosityHighPassShader from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/shaders/LuminosityHighPassShader.js"
// import * as UnrealBloomPass from "https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/postprocessing/UnrealBloomPass.js"

import * as EffectComposer from '../../plugins/threejs/luminescencejs/EffectComposer.js'
import * as RenderPass from '../../plugins/threejs/luminescencejs/RenderPass.js'
import * as ShaderPass from '../../plugins/threejs/luminescencejs/ShaderPass.js'
import * as CopyShader from '../../plugins/threejs/luminescencejs/CopyShader.js'
import * as LuminosityHighPassShader from '../../plugins/threejs/luminescencejs/LuminosityHighPassShader.js'
import * as UnrealBloomPass from '../../plugins/threejs/luminescencejs/UnrealBloomPass.js'
import { scene } from '../../main.js'

export class Particle {
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
		this.rotateSpeed = 0
		this.dx = 0
		this.dy = 0
		this.dz = 0

		// 颜色
		this.color = "#00aaff"
		this.rgb = { r: 0, g: 170, b: 255 }
		this.THREEcolor = 0x00aaff

		// 几何材质
		this.geometry = new THREE.BufferGeometry();
		this.material = new THREE.PointsMaterial({
			color: this.THREEcolor,
			size: 0.2
		});

		// 统计
		this.points = []
		this.positions = new Float32Array(0)
		this.colors = new Float32Array(0);
		this.countParticles = 0

		// 状态
		this.rendering = false;

		// 结果
		this.SEType = 'null'
		this.command = null

		this.initParticles();
	}

	
	clear() {
		this.positions = new Float32Array(0)
		this.colors = new Float32Array(0)
		this.updateParticles();
		clearInterval(this.loop);
		scene.remove(this.pivots);
		this.countParticles = 0; // 重置粒子数量
	}

	initParticles() {
		this.particles = new THREE.Points(this.geometry, this.material);
		scene.add(this.particles);
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

	updateParticles() {
		this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		this.geometry.attributes.position.needsUpdate = true;
		this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
		this.geometry.attributes.color.needsUpdate = true;
	}

	setColors() {
		
		  // 更新this.THREEcolor为新的整型颜色代码
		this.THREEcolor = (this.rgb.r << 16) | (this.rgb.g << 8) | this.rgb.b;
		
		  // 更新材质的颜色
		this.material.color.set(this.THREEcolor);
		
		// 如果有粒子已经添加到geometry中，更新它们的颜色
		if (this.positions && this.positions.length > 0) {
			for (let i = 0; i < this.positions.length / 3; i++) {
				const colorIndex = i * 3;
				this.colors[colorIndex] = this.rgb.r / 255;
				this.colors[colorIndex + 1] = this.rgb.g / 255;
				this.colors[colorIndex + 2] = this.rgb.b / 255;
			}
			// 更新几何体属性
			this.updateParticles();
		}
	}
		
}