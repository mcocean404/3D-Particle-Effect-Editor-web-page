import { UI } from '../system/UI/UI.js'
import { Particle } from '../system/particles/Particle.js'
import { scene } from '../main.js'
import { loadColor, copyHandle, hexToRgb, isNumericString, containsEnglish } from '../system/basis/functions.js'
import { toParameter } from '../system/export/ToColorblock.js'

export class Fourier extends Particle {
	constructor(id) {
		super()
		this.type = "function"
		this.flag = 'F'
		this.mcfunction = true
		this.id = id
		this.name = String.fromCharCode(Number(id + 102)) + "：Fourier"
		this.animation = false
		this.start = -3.14
		this.end = 3.14
		this.step = .003
		this.i = this.start
		this.rotors = [
			{r: 7, a: 4, ir: 0},
			{r: -10, a: -3, ir: 0}
		]
		this.countRotor = 0
		this.loop = setInterval(function() {});
		this.pivots = new THREE.Group();
		this.focused = null;

		// UI 控件
		this.addItem();
		this.removeEvent();

		
		this.render(0);
		
		// this.animate()
	}

	static {

		// 排除不存在的代数
		$('.controller').on('input', (e) => {

			// 获取已存在的代数名称
			let AlgebraKeys = Object.keys(global.Algebras);
			// console.log(AlgebraKeys)
			
			let element = e.target
			
			let has = false
			for (let i = 0; i < AlgebraKeys.length; i++) {
				if (element.value == AlgebraKeys[i]) {
					has = true
					console.log(has)
					break;
				}
			}
		});
	}

	// Calculate
	alterRotorAcount() { // 更改旋转因子数量
		initRotor(this);
		$(`#item${this.id} #removeRotor`).click(() => {
			add_or_removeRotor(false, this);
		});

		$(`#item${this.id} #addRotor`).click(() => {
			add_or_removeRotor(true, this);
		});
		
		// 随机赋值
		$(`#item${this.id} #random`).click(() => {
			for (let i = 0; i < this.rotors.length; i++) {
				let r = Math.round((Math.random() - .5) * 20);
				let a = Math.round((Math.random() - .5) * 20);
				let ir = Math.round((Math.random() - .5) * 20);
				
				if (r > -2 && r < 2) r *= 2
				if (a > -2 && a < 2) a *= 2
				if (r == 0) r = 1
				if (a == 0) a = 1
				
				console.log(r, a ,ir)
				
				this.rotors[i].r = r;
				this.rotors[i].a = a;
				this.rotors[i].ir = ir;

				$(`#RTable${this.id} #rotor${i} #r`).val(r);
				$(`#RTable${this.id} #rotor${i} #a`).val(a);
				$(`#RTable${this.id} #rotor${i} #ir`).val(ir);
			}

			this.render(this.animation);
		});

		// 增删旋转因子
		function add_or_removeRotor(sgin, obj) {
			if (sgin == true) {
				obj.countRotor++;
				obj.rotors.push({r: 0, a: 0, ir: 0});
				initRotor(obj);
			} else {
				if (obj.countRotor > 1) {
					obj.rotors.splice(--obj.countRotor);
					initRotor(obj);
					obj.render(obj.animation);
				}
			}
			console.log(
				"rotors: ", obj.rotors,
				"countRotor: ", obj.countRotor
			)

			obj.render(obj.animation)
		}


		function initRotor(self) {
			let $RTalbe = $(`#RTable${self.id}`);

			$RTalbe.empty();

			self.countRotor = 0;

			for (let i = 0; i < self.rotors.length; i++, self.countRotor++) {
				$RTalbe.append(rotorTrGroup(self, i));
			}
			inputs(self);

			function rotorTrGroup(self, index) {
				let html =
					`<tr class="tr_rotor" id="rotor${index}">
					<td>f${index + 1}</td>
					<td><input type="text" id="r" value="${self.rotors[index].r}" placeholder="r"></td>
					<td><input type="text" id="a" value="${self.rotors[index].a}" placeholder="a"></td>
					<td><input type="text" id="ir" value="${self.rotors[index].ir}" step="0.1" placeholder="ir"></td>
				</tr>`
				return html;
			}

			function inputs(self) {
				$(`#RTable${self.id}`).on('input', (e) => {
					
					if (e.target.id == 'r' || e.target.id == 'a' || e.target.id == 'ir') {
						
						// 操作元素
						let element = e.target;

						// 获取基本数据
						let index = getIndex(element);  // 旋转因子下标
						let id = e.target.id;  // r | a | ir
						let str = element.value;  // 表达式
						
						let value;

						// 解释表达式
						parseExpression(str);
						function parseExpression(str) {

							str = singleCharOptimize(str);
							replaceRealAlgebra(str);

							try {
								value = eval(str);

								update(index, id);
								console.log("finally: ", value);
							} catch(error) {
								console.error("input value of expression error");
							}


							function singleCharOptimize(str) {
								switch(str) {
									case '':
										str = '0';
										break;
									case '-':
										str = '0';
										break;
								}
								return str;
							}

							function replaceRealAlgebra(str) {
								
								let keys = Object.keys(global.Algebras);

								// for (let i = 0; i < str.length; i++) {
									
								// } 
								
								console.log("Algebra keys: ", keys);
							}
						}

						// if (isNumericString(str) && containsEnglish(str) || str == '') {
						// 	// 纯数字
						// 	value = Number(str);

						// 	// 更新与渲染
						// 	update(index, id);
						// } else {
						// 	// 含代数
						// 	setAlgebraLink();

						// 	// 获取代数名称
						// 	let AlgebraKeys = Object.keys(global.Algebras);
						// 	// 显示
						// 	console.log(AlgebraKeys);

						// 	// 获取代数
						// 	let key = getKey(str, AlgebraKeys)
						// 	// 测试存在否
						// 	if (key != null) {

						// 		let newExpression = (element.value).replace(key, "global.Algebras." + key)
						// 		console.log(newExpression)

						// 		value = eval(newExpression)
						// 		console.log(value)

						// 		// 更新与渲染
						// 		update(index, id);
						// 	}

							
							
						// 	function getKey(str, keys) {

						// 		let key = null

						// 		for (let i = 0; i < keys.length; i++) {
						// 			if (str == keys[i]) {
						// 				key = keys[i]
						// 				break;
						// 			}
						// 		}

						// 		if (key != null) 
						// 			console.log("have within, continue");
						// 		else 
						// 			console.error("no find, stop");

						// 		return key;
						// 	}

						// 	function setAlgebraLink() {
						// 		global.AlgebraLink.push({
						// 			itemID: self.id,
						// 			rotorIndex: index,
						// 			rotorKey: id,
						// 			AlgebraName: str
						// 		 })
						// 	}

						// }

						function getIndex(element) {
							let id = $(element.parentNode.parentNode).attr('id');
							return Number(id[id.length - 1]);
						}
						
						function update(index, id) {
							// 更新与渲染
							self.rotors[index][id] = value;
							self.render(self.animation);
						}
					}
				});
			}
		}
	}

	render(animation) {

		console.log(this.getGcd());
		super.clear(this);

		this.i = this.start;

		this.updateParticlesNumber(); // 粒子数量

		// 遍历粒子
		if (!animation) { // no animate
			// 坐标集合处理
			for (let i = this.start, index = 0; i <= this.end; i += this.step, index ++) {
				let p = this.CalculateCoordinate(i);
				super.addParticle(p.x, p.y, p.z, this.rgb);
			}
			super.updateParticles();
		} else { // with animate
			clearInterval(this.loop);
			// 创建视觉辅助线旋转度数
			if (this.animation) this.createHelpLine();

			this.loop = setInterval(() => {
				if (this.i < this.end) { // 继续

					for (let j = this.i; j < this.i + this.grow; j++, this.i += this.step) {
						let point = this.CalculateCoordinate(this.i);
						super.addParticle(point.x, point.y, point.z, this.rgb)
						super.updateParticles();
					}

					// 更新视觉辅助线旋转度数
					if (this.animation) this.upDateHelpLine(this.i);
				} else { // 结束
					clearInterval(this.loop);
					// 清除视觉辅助线
					scene.remove(this.pivots);
				}
			}, 16);
			
			// count particle number
			this.updateParticlesNumber();
		}
		
		this.toMath();
	}
	
	animate(end, reCall) {
		
		if (this.i < end) {
			requestAnimationFrame(this.animate.bind(this));
			
			reCall()
		}
		
		this.i ++
		console.log(this.i);
	}
	
	createHelpLine() {
		scene.remove(this.pivots);
		this.pivots = new THREE.Group();
		this.pivots.scale.set(this.scale.x, this.scale.y, this.scale.z);

		for (let i = 0; i < this.rotors.length; i++) {
			helpLine(this, this.rotors[i].r, 0, 0);
		}

		// 添加绘制线与圆框
		scene.add(this.pivots);

		// 绘制线与圆框
		function helpLine(self, lineLong, x, z) {
			lineLong = lineLong * self.initScale
			// 圆柱
			var cylinder = new THREE.CylinderGeometry(.05, .05, lineLong, 8);

			// 材质
			const material = new THREE.MeshBasicMaterial({
				color: 0xe859ee,
				opacity: .5
			});
			const helpLine = new THREE.Mesh(cylinder, material);

			// 创建圆环的几何体
			var geometry = new THREE.TorusGeometry(lineLong, .02, 16,
				100); // 参数分别为：圆环的半径，管道的半径，圆环的径向分段数，管道的分段数
			// 创建圆环的材质
			var torusMaterial = new THREE.MeshBasicMaterial({
				color: 0xff7bff,
				opacity: .5
			});
			// 创建圆环的网格对象
			var torus = new THREE.Mesh(geometry, torusMaterial);

			// 将圆环对象添加到场景中
			// scene.add(torus);

			// 旋转体
			var pivot = new THREE.Object3D();

			pivot.add(helpLine, torus);
			helpLine.position.set(0, lineLong / 2, 0);
			self.pivots.add(pivot);


			pivot.position.x = x;
			pivot.position.z = z;
			// 线
			torus.position.x = x;
			torus.position.z = z;

			pivot.rotation.x = Math.PI / 2;
			// pivot.rotation.z = 1;

			pivot.position.set(self.position.x, self.position.y, self.position.z);

			self.pivots.add(pivot);
			self.pivots.position.set(self.position.x, self.position.y, self.position.z);
			self.pivots.rotation.set(self.rotation.x, self.rotation.y, self.rotation.z);
			
			console.log('created');
		}
	}

	upDateHelpLine(angle) {

		// 更新线与圆框
		for (let i = 0; i < this.rotors.length; i++) {
			this.pivots.children[i].rotation.z = this.rotors[i].a * angle - Math.PI / 2 + this.rotors[i].ir;

			let x = 0,
				z = 0;
			for (let j = 0; j < i; j++) {
				x += this.rotor('cos', this.rotors[j].r, this.rotors[j].a, angle, this.rotors[j].ir) * this.initScale;
				z += this.rotor('sin', this.rotors[j].r, this.rotors[j].a, angle, this.rotors[j].ir) * this.initScale;

			}
			this.pivots.children[i].position.x = x;
			this.pivots.children[i].position.z = z;
		}
	}

	CalculateCoordinate(i) { // 计算坐标
		// step1: 级数求和
		let p = { x: 0, y: 0, z: 0 };

		for (let j = 0; j < this.rotors.length; j++) {
			p.x += this.rotor('cos', this.rotors[j].r, this.rotors[j].a, i, this.rotors[j].ir);
			p.z += this.rotor('sin', this.rotors[j].r, this.rotors[j].a, i, this.rotors[j].ir);
		}
	
		p.x *= this.initScale
		p.z *= this.initScale
		return p;
	}

	rotor(mode, rc, ac, i, angle) { // 计算级数
		let v;

		switch (mode) {
			case "sin":
				v = rc * Math.sin(ac * i + angle);
				break;
			case "cos":
				v = rc * Math.cos(ac * i + angle);
				break;
			default:
				console.error("no find it");
		}

		return v;
	}

	toMinecraftCommand() {

		console.log(`copy ${this.id}`);
		let plexX = "0";
		let plexY = "0";
		let plexZ = "0";

		for (let i = 0; i < this.rotors.length; i++) {
			plexX += `+${this.rotors[i].r}*cos(t*${this.rotors[i].a}+${this.rotors[i].ir})`;
			plexZ += `+${this.rotors[i].r}*sin(t*${this.rotors[i].a}+${this.rotors[i].ir})`;
		}

		let scaleX = `scaleX=${this.initScale * this.scale.x};`;
		let scaleY = `scaleY=${this.initScale * this.scale.y};`;
		let scaleZ = `scaleZ=${this.initScale * this.scale.z};`;
		let rx = `rx=${this.rotation.x};`;
		let ry = `ry=${this.rotation.y};`;
		let rz = `rz=${this.rotation.z};`;
		
		let parameters = scaleX + scaleY + scaleZ;
		if (this.rotation.x != 0) {
			parameters += rx
		}
		if (this.rotation.y != 0) {
			parameters += ry
		}
		if (this.rotation.z != 0) {
			parameters += rz
		}

		let EX = `(${plexX})*scaleX`;
		let EY = `(${plexY})*scaleY`;
		let EZ = `(${plexZ})*scaleZ`;

		// rotateX
		let Es = commandRotate(this, EX, EY, EZ);
		EX = Es[0];
		EY = Es[1];
		EZ = Es[2];

		let E =
			parameters +
			"x=" + EX + ";y=" + EY + ";z=" + EZ + "";

		let SE;
		if (this.rotateSpeed != 0) {
			SE =
				`"a=${this.rotateSpeed / 250};(vx,,vy,,vz)=(-sin(a),0,-cos(a),,0,1,0,,cos(a),0,-sin(a))*(x*2*sin(a),,0,,z*2*sin(a))"`;
		} else {
			SE = `"vy=0"`
		}
		
		
		this.command = toParameter(this, E, SE);

		copyHandle(this.command);

		console.log(this.command);

		function commandRotate(obj, ex, ey, ez) {
			// rotateX
			let x1, y1, z1,
				x2, y2, z2,
				x3, y3, z3;

			if (obj.rotation.x != 0) {
				x1 = ex;
				y1 = `(${ey})*cos(rx)-(${ez})*sin(rx)`;
				z1 = `(${ey})*sin(rx)+(${ez})*cos(rx)`;
			} else {
				x1 = ex;
				y1 = ey;
				z1 = ez;
			}

			// rotateY
			if (obj.rotation.y != 0) {
				x2 = `(${x1})*cos(ry)+(${z1})*sin(ry)`;
				y2 = y1;
				z2 = `(-${x1})*sin(ry)+(${z1})*cos(ry)`;
			} else {
				x2 = x1;
				y2 = y1;
				z2 = z1;
			}

			// rotateZ
			if (obj.rotation.z != 0) {
				x3 = `(${x2})*cos(rz)-(${y2})*sin(rz)`;
				y3 = `(${x2})*sin(rz)+(${y2})*cos(rz)`;
				z3 = z2;
			} else {
				x3 = x2;
				y3 = y2;
				z3 = z2;
			}

			return [x3, y3, z3];
		}
	}
	
	toMath() {
		let plexX = "";
		let plexZ = "";
		
		let count = 0;
		for (let i = 0; i < this.rotors.length; i++) {
			if (count != 0) {
				if (this.rotors[i].r >= 0) {
					plexX += '+'
					plexZ += '+'
				}
			}
			// if ()
			let startAngle;
			if (this.rotors[i].ir == 0) {
				startAngle = ""
			} else {
				startAngle = this.rotors[i].ir > 1 ? '+' + this.rotors[i].ir : this.rotors[i].ir
			}
			
			plexX += `${this.rotors[i].r}cos(${this.rotors[i].a}t${startAngle})`;
			plexZ += `${this.rotors[i].r}sin(${this.rotors[i].a}t${startAngle})`;
			
			count++;
		}
		
		
		let expressions =
			"x =" + plexX + "<br>z=" + plexZ + "";
		
		this.command = `${expressions}`;
		
		$(`#item${this.id} #mathWord`).html(`
			<div class="mathWord">
				${this.command} <br><br>
				t ∈ [${this.start}, ${this.end}]
			</div>
		`);
	}
	
	addItem() {
		let elements = new UI();
		elements.domian = true;
		
		this.html = 
		`<div class="accordion">
			<div class="label">
				<button class="unfold"><i class="fa fa-angle-left"></i></button>外形设置
			</div>
			<ul class="settingList setting-rotor">
				<table>
					<tr>
						<th>级数</th>
						<th>半径</th>
						<th>转速</th>
						<th>初始角</th>
					</tr>
				</table>
				<div class="RInputs">
					<table id="RTable${this.id}"></table>
				</div>
				<div class="sonChange">
					<button class="btn" id="removeRotor">删减</button>
					<button class="btn" id="addRotor">添加</button>
				</div>
				<button class="btn" id="random">随机参数</button>
			</ul>
		</div>`;
		
		
		elements.addItem(this);
		this.alterRotorAcount();

		$(`#item${this.id} .expressionBox`).click();
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

			super.clear(this);

			// 腾出数组位置
			global.Objects[this.id] = 0;

			// console.log(ObjectMenu.FourierObjects);
		})
	}

	updateParticlesNumber() {
		this.countParticles = Math.round((this.end - this.start) / this.step);
		loadColor(this);
	}

	getGcd() {
		let chaArr = [];
		for (let i = 0; i < this.rotors.length - 1; i++) {
			for (let j = 0; j < this.rotors.length - 1; j ++) {
				chaArr.push(this.rotors[i].a - this.rotors[j + 1].a);
			}
		}
		return chaArr;
	}

}