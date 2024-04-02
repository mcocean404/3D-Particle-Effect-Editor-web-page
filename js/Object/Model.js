import { UI } from '../system/UI/UI.js'
import { ParticleSystem } from '../system/particles/particleSystem.js'
import { scene } from '../main.js'
import { toNormals } from '../system/export/ToColorblock.js'
import { loadColor, playSound } from '../system/basis/functions.js'

export class Model extends ParticleSystem {
	constructor(id) {
		super()
		this.id = id
		this.flag = 'M'
		this.name = "model"
		this.initScale = .1
		this.distance = 1
		
		this.HTML()
		this.main()
		this.event()
	}

	main() {
		let elements = new UI();
		elements.SE = true;

		elements.addItem(this);
		this.getFile();

		$(`#item${this.id} .expressionBox`).click();
		$(`#item${this.id} #fileInput`).click();
	}

	HTML() {
		this.html =
			`<div class="accordion">
				<div class="label">
					<button class="unfold"><i class="fa fa-angle-left"></i></button>导入
				</div>
				<ul class="settingList model">
					<input type="file" id="fileInput" style="display:none;" accept=".obj">
					<button class="clear" title="清除">
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
						<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
					</svg>
					</button>
					<div class="drop-area" title="点击上传文件">
						<p>选择打开文件，也可拖入文件</p>
					</div>
					<p class="dropPrompt">目前尽支持 obj 文件，其他格式请转为 obj</p>
				</ul>
			</div>`;
	}

	render() {
		super.clear(this);

		// 计数
		let len = this.points.length;
		this.countParticles = len;
		loadColor(this);
		
		// 创建位置数组
		this.geometry = new THREE.BufferGeometry();
		this.positions = new Float32Array(len * 3);
		this.colors = new Float32Array(len * 3);

		// 坐标集合处理
		for (let i = 0; i < len; i ++) {

			let x = this.points[i].x * this.scale.x * this.initScale;
			let y = this.points[i].y * this.scale.y * this.initScale;
			let z = this.points[i].z * this.scale.z * this.initScale;
			// 赋值
			// super.addParticle(x, y, z);
			this.positions[i * 3] = x
			this.positions[i * 3 + 1] = y
			this.positions[i * 3 + 2] = z
		}
		
		
		// 加载
		this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
		super.setColors();
		this.particles = new THREE.Points(this.geometry, this.shaderMaterial);
		scene.add(this.particles);

		// 加载成功音效
		setTimeout(() => {
			playSound('loaded');
			$(`#item${this.id} .drop-area p`).text("加载成功").css('color', 'green');
		});
	}

	getFile() {

		const dropArea = document.querySelector(`#item${this.id} .drop-area`);
		// 阻止默认事件
		dropArea.addEventListener('dragover', (e) => {
			e.preventDefault();
			let bgColor = set.theme == 'day' ? '#f0f0f0' : '#3d4351'
			dropArea.style.backgroundColor = bgColor; // 拖拽时改变背景颜色
		});

		// 恢复背景颜色
		dropArea.addEventListener('dragleave', () => {
			dropArea.style.backgroundColor = '';
		});



		// get data
		$(`#item${this.id} #fileInput`).on('change', (e) => {
			const file = e.target.files[0];
			const reader = new FileReader();

			// get file name

			if (file !== undefined) {
				this.name = file.name;
				$(`#item${this.id} #name`).val(this.name);
				this.drogUIOFFON(this, true, this.name);
				console.log('上传文件:', this.name);
	
				reader.onload = (e) => {
					const data = e.target.result;
					const lines = data.split('\n');
					const vertices = [];
	
					lines.forEach(line => {
						if (line.startsWith('v ')) {
							const vertex = line.split(' ').slice(1).map(parseFloat);
							vertices.push(vertex);
						}
					});
	
					let string = JSON.stringify(vertices, null, 2);
					let JSONPoints = JSON.parse(string);
	
					// 剔除 null
					let points = JSONPoints.map(innerArr => innerArr.filter(item => item !== null));
					this.points = []
					for (let i = 0; i < points.length; i++) {
						this.points.push({ x: points[i][0], y: points[i][1], z:points[i][2] })
					}
	
					this.render();
				}
				reader.readAsText(file);
			}
		});

		dropArea.addEventListener('drop', (e) => {
			e.preventDefault();
			dropArea.style.backgroundColor = ''; // 恢复背景颜色

			const files = e.dataTransfer.files; // 获取拖拽的文件
			[...files].forEach(file => {
				const reader = new FileReader();
				
				if (file !== undefined) {
					// get file name
					this.name = file.name;
					$(`#item${this.id} #name`).val(this.name);
					this.drogUIOFFON(this, true, this.name);

					// 在这里可以编写文件上传的逻辑
					reader.onload = (e) => {
						const data = e.target.result;
						const lines = data.split('\n');
						let vertices = [];

						lines.forEach(line => {
							if (line.startsWith('v ')) {
								const vertex = line.split(' ').slice(1).map(parseFloat);
								vertices.push(vertex);
							}
						});
						let string = JSON.stringify(vertices, null, 2);
						let JSONPoints = JSON.parse(string);

						// 剔除 null
						this.points = JSONPoints.map(innerArr => innerArr.filter(item => item !== null));
						// console.log(this.points);
						
						this.render();
					}
					reader.readAsText(file);
				}
			});
		});
	}

	event() {
		let $id = $(`#item${this.id} .delete`);
		let $clear = $(`#item${this.id} .clear`);

		// remove Object
		$id.click(() => {

			let timeout = 200
			$(`#item${this.id}`).css('transition', 'none').removeClass("itemFocus");
			$(`#item${this.id}`).slideUp(timeout);

			setTimeout(() => {
				$(`#item${this.id}`).remove();
			}, timeout);

			delete this;

			super.clear(this);

			// 腾出数组位置
			global.Objects[this.id] = 0;

			// console.log(ObjectMenu.FourierObjects);
		})

		// clear Model
		$clear.click(() => {
			super.clear(this);

			this.drogUIOFFON(this, false);
			loadColor(this);
		});

		// dropArea click
		$(`#item${this.id} .drop-area`).click((event) => {
			$(`#item${this.id} #fileInput`).click();
		})
	}
	
	drogUIOFFON(self, OFFON, fileName) {
		
		let borderColor = set.theme == 'day' ? '#ccc' : '#686868';
		let textColor = set.theme == 'day' ? '#696969' : '#aeaeae';
		
		
		if (OFFON === false) {
			$(`#item${self.id} .drop-area p`).text('将obj文件拖拽至此区域').css('color', textColor);
			$(`#item${self.id} .drop-area`).css('border', '2px dashed ' + borderColor);
		} else {
			$(`#item${self.id} .drop-area p`).text('已导入' + fileName).css('color', textColor);
			$(`#item${self.id} .drop-area`).css('border', '2px solid ' + borderColor);
			
			console.log('上传文件:', fileName);
		}
	}

	toMinecraftCommand() {

		toNormals(this);
	}

	update(recall) {
		recall()
	}
}