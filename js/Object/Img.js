import { UI } from '../system/UI/UI.js'
import { ParticleSystem } from '../system/particles/particleSystem.js'
import { scene } from '../main.js'
import { toNormals } from '../system/export/ToColorblock.js'
import {
  loadColor,
  xRotate,
  yRotate,
  zRotate,
  rgbToHex,
  playSound
} from '../system/basis/functions.js'



export class Img extends ParticleSystem {
	constructor(id) {
		super()
		this.id = id
		this.flag = 'I'
		this.name = "image"
		this.initScale = .1
		this.distance = 5
		this.pixels = []

		this.main()
		this.event()
	}

	main() {
		let elements = new UI();
		elements.SE = true;

		this.html =
			`<div class="accordion">
				<div class="label">
					<button class="unfold"><i class="fa fa-angle-left"></i></button>导入
				</div>
				<ul class="settingList model">
					<input type="file" id="fileInput" accept="image/*" style="display:none;">
					<button class="clear" title="清除">
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
						<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
					</svg>
					</button>
					<div class="drop-area" title="点击上传文件">
						<p>选择打开文件，也可拖入文件</p>
					</div>
				</ul>
			</div>`;
		elements.addItem(this);

		this.getFile()

		$(`#item${this.id} .expressionBox`).click();
		$(`#item${this.id} #fileInput`).click();
	}

	render() {
		
		super.clear(this);

		// 创建位置数组
		this.geometry = new THREE.BufferGeometry();
		this.positions = new Float32Array(this.pixels.length * 3);
		this.colors = new Float32Array(this.pixels.length * 3);
		
		for (let i = 0; i < this.pixels.length; i++) {
			
			// 坐标
			let x = this.pixels[i].x * this.scale.x * this.initScale,
				y = this.pixels[i].y * this.scale.y * this.initScale,
				z = 0;

			this.positions[i * 3] = x;
			this.positions[i * 3 + 1] = y;
			this.positions[i * 3 + 2] = z;

			// 颜色
			let r = this.pixels[i].r / 255,
				g = this.pixels[i].g / 255,
				b = this.pixels[i].b / 255;

			this.colors[i * 3] = r;
			this.colors[i * 3 + 1] = g;
			this.colors[i * 3 + 2] = b;
		}
		// console.log(this.positions, this.colors);
		this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
		this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
	
		this.particles = new THREE.Points(this.geometry, this.shaderMaterial);

		scene.add(this.particles);

		// 计数
		this.countParticles = this.pixels.length
		loadColor(this);

		// 初始化参数
		initAttribute(this);

		
		
		function initAttribute(self) {
			self.particles.position.x = self.position.x
			self.particles.position.y = self.position.y
			self.particles.position.z = self.position.z
			self.particles.rotation.x = self.rotation.x
			self.particles.rotation.y = self.rotation.y
			self.particles.rotation.z = self.rotation.z
			self.particles.scale.x = self.scale.x
			self.particles.scale.y = self.scale.y
			self.particles.scale.z = self.scale.z
		}

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

		/**
		 * 从图片文件中提取像素数据。
		 * @param {File} file - 用户选择的图片文件对象。
		 * @returns {Promise<Array>} 一个Promise对象，解析为包含像素数据的数组，每个元素都是一个包含坐标和颜色值的对象。
		 */
		// click get data
		$(`#item${this.id} #fileInput`).on('change', (e) => {
			const file = event.target.files[0];
			if (file) {
				extractPixels(file).then((pixelData) => {
					
					this.pixels = pixelData
					console.log('提取的像素数据:', this.pixels);
					// 这里可以处理提取到的像素数据
					this.render()
					
				}).catch((error) => {
					console.error('提取像素数据时发生错误:', error);
				});
			}
		});

		
		function extractPixels(file) {
			// 检查文件是否存在且类型为图片
			if (!file || !file.type.match('image.*')) {
			return Promise.reject(new Error('请选择一个图片文件。'));
			}
		
			return new Promise((resolve, reject) => {
			// 创建一个新的Image对象
			const img = new Image();
		
			// 图片加载完成时的回调函数
			img.onload = () => {
				// 创建一个Canvas元素用于绘制图片
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');
				canvas.width = img.width;
				canvas.height = img.height;
				const centerPosition = { x: img.width / 2, y: img.height / 2  }
				ctx.drawImage(img, 0, 0);
		
				// 获取图片的像素数据
				const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
				const data = imageData.data;
		
				// 初始化一个数组来存储像素数据
				const pixels = [];
		
				// 遍历像素数据
				for (let i = 0; i < data.length; i += 4) {
					// 计算像素的x和y坐标
					const x = i / 4 % canvas.width - centerPosition.x;
					const y = -(Math.floor(i / (canvas.width * 4)) - centerPosition.y);
			
					// 获取RGBA颜色值
					const r = data[i];
					const g = data[i + 1];
					const b = data[i + 2];
					const a = data[i + 3];
			
					// 如果像素不完全透明，则添加到数组中
					if (a > 127) {
						pixels.push({ x, y, r, g, b, a });
					}
				}
		
				// 解析Promise并返回像素数据数组
				resolve(pixels);
			};
		
			// 图片加载失败时的回调函数
			img.onerror = (error) => {
				// 拒绝Promise并返回错误信息
				reject(new Error('图片加载失败: ' + error));
			};
		
			// 读取文件为DataURL，用于图片源
			const reader = new FileReader();
			reader.onload = (event) => {
				img.src = event.target.result;
			};
			reader.onerror = (error) => {
				// 拒绝Promise并返回错误信息
				reject(new Error('文件读取失败: ' + error));
			};
			reader.readAsDataURL(file);
			});
		}
		
		// drop get data
		dropArea.addEventListener('drop', (e) => {
			
			// init
			super.clear(this);
			this.points = []
			this.particles = 0
			
			e.preventDefault();
			dropArea.style.backgroundColor = ''; // 恢复背景颜色

			const files = e.dataTransfer.files; // 获取拖拽的文件
			[...files].forEach(file => {

				if (file !== undefined) {
					const reader = new FileReader();

					// get file name
					this.name = file.name;
					$(`#item${this.id} #name`).val(this.name);
					this.drogUIOFFON(this, true, this.name);
					
					reader.onload = (event) => {
						const img = new Image();
						img.onload = () => {
							const canvas = document.createElement('canvas');
							canvas.width = img.width;
							canvas.height = img.height;
							this.width = img.width;
							this.height = img.height;
							const ctx = canvas.getContext('2d');
							ctx.drawImage(img, 0, 0);
					
							// 输出图片的宽度和高度
							console.log(`Image size: ${img.width} x ${img.height}`);
					
							// 输出不完全透明的像素的坐标和颜色
							const imageData = ctx.getImageData(0, 0, img.width, img.height);
							let centerPoint = { x: this.width / 2, y: this.height / 2 }

							this.points = []
							for (let y = 0; y < img.height; y++) {
								for (let x = 0; x < img.width; x++) {
									const index = (y * img.width + x) * 4;
									const a = imageData.data[index + 3]; // 获取透明度值
									if (a > 127) { // 排除完全透明的像素
										const r = imageData.data[index];
										const g = imageData.data[index + 1];
										const b = imageData.data[index + 2];
					
										let hex = rgbToHex(r, g, b)
										this.THREEcolor = parseInt((hex.toString()).slice(1), 16);
										
										// super.createParticle({ x: x * .2, y: y * .2, z: 0 })
										this.points.push({
											x: (x - centerPoint.x) * this.initScale, 
											y: (y - centerPoint.y) * this.initScale, 
											z: 0,
										})
									}
								}
							}
							this.render();
						};
						img.src = event.target.result;
					};

					reader.readAsDataURL(file);
				}
				
			});
			
		});

		// dropArea click
		$(`#item${this.id} .drop-area`).click((e) => {
			$(`#item${this.id} #fileInput`).click();
		})
	}

	drogUIOFFON(self, OFFON, fileName) {

		let borderColor = set.theme == 'day' ? '#ccc' : '#686868';
		let textColor = set.theme == 'day' ? '#696969' : '#aeaeae';


		if (OFFON === false) {
			$(`#item${self.id} .drop-area p`).text('将图像文件拖拽至此区域').css('color', textColor);
			$(`#item${self.id} .drop-area`).css('border', '2px dashed ' + borderColor);
		} else {
			$(`#item${self.id} .drop-area p`).text('已导入' + fileName).css('color', textColor);
			$(`#item${self.id} .drop-area`).css('border', '2px solid ' + borderColor);

			console.log('上传文件:', fileName);
		}
	}

	event() {
		let $id = $(`#item${this.id} .delete`);

		$id.click(() => {

			let timeout = 240
			$(`#item${this.id}`).css('transition', 'none');
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
		let $clear = $(`#item${this.id} .clear`);
		$clear.click(() => {
			super.clear(this);
		
			this.drogUIOFFON(this, false);
			loadColor(this);
		});
	}
	
	toMinecraftCommand() {
		toNormals(this);
	}
}