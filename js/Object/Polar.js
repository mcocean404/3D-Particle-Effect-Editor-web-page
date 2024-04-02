import { UI } from '../system/UI/UI.js'
import { scene } from '../main.js'
import { Particle } from '../system/particles/Particle.js'
import { loadColor, hexToRgb, copyHandle } from '../system/basis/functions.js'

export class Polar extends Particle {
	constructor(id) {
		super()
		this.id = id;
		this.name = String.fromCharCode(Number(id + 102)) + "：polar"

		this.render()
		this.addItem()
		this.removeEvent()
	}

	render() {
		super.clear(this);
		this.particleGroup = new THREE.Group();

		let radius = 5; // 球的半径
		let points_azimuth = 30; // 极角方向上的点数
		let points_elevation = 30; // 方位角方向上的点数

		for (let i = 0; i < points_azimuth; i++) {

			let azimuth = (i / points_azimuth) * Math.PI; // 计算极角

			for (let j = 0; j < points_elevation; j++) {
				let elevation = (j / points_elevation) * 2 * Math.PI; // 计算方位角

				let p = this.convertToCartesian(azimuth, elevation, radius);

				this.createParticle(p);
			}
		}

		scene.add(this.particleGroup);
		loadColor(this, this.particles);
	}

	// 转换为笛卡尔
	convertToCartesian(azimuth, elevation, radius) {
		let x = radius * Math.sin(azimuth) * Math.cos(elevation); // 根据球坐标系转换为直角坐标系
		let y = radius * Math.sin(azimuth) * Math.sin(elevation);
		let z = radius * Math.cos(azimuth);

		return [x, y, z]
	}

	addItem() {
		let elements = new UI();
		
		this.html = 
		`<fieldset class="setting setting-basic">
			<legend>基本设置</legend>
				<ul>
					<li>
						<div class="name">位角</div>
						<div class="inputs">
							<input type="number" id="theta" value="${self.theta}" placeholder="θ">
						</div>
					</li>
					<li>
						<div class="name">俯角</div>
						<div class="inputs">
							<input type="number" id="phi" value="${self.phi}" placeholder="φ">
						</div>
					</li>
					<li>
						<div class="name">距离</div>
						<div class="inputs">
							<input type="number" id="r" value="${self.r}" placeholder="r">
						</div>
					</li>
				</ul>
			</fieldset>`;
			
		elements.addItem(this);
	}

	removeEvent() {
		let $id = $(`#item${this.id} .delete`);
	
		$id.click(() => {
		
			let timeout = 240
			$(`#item${this.id}`).css('transition', 'none');
			$(`#item${this.id}`).slideUp(timeout);
	
			setTimeout(() => {
				$(`#item${this.id}`).remove();
			}, timeout);
	
			delete this;
	
			super.clean(this);
	
			// 腾出数组位置
			global.Objects[this.id] = 0;
	
			// console.log(ObjectMenu.FourierObjects);
		})
	}
}