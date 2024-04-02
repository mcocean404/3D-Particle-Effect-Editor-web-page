import {particleNames} from '../../data/data.js'
import { hexToRgb, copyHandle, exportToMineraft, getLastLower, playSound } from '../basis/functions.js'
import { tween, SE } from '../../system/vision/transition.js'
import {scene} from '../../main.js'


export class UI {
	constructor() {
		this.domian = false;
		this.SE = false;
	}
	
	addItem(self) {
		let html =
			`<div class="item Fourier" id="item${self.id}">
			
				<button class="delete" title="删除">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
						<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
					</svg>
				</button>
					
				<div class="expressionBox">
					<div class="type">
						<index>${Number(self.id) + 1}</index>
						<div class="flag" style="background:${self.color};">${self.flag}</div>
					</div>
					<div class="content">
						<input type="text" class="expressionName" id="name" value="${self.name}" placeholder="名称"><br>
						<p class="info">粒子数量：<span id="particles">-</span></p>
					</div>
				</div>
				
				<div class="sonParameter">
				
					${self.html}
					
					${this.SE ? this.setSE(self) : ''}
					
					${this.setBasic(self)}

					<div class="footer">
						<button class="btn" id="copy">copy</button>
						<button class="slideUp" title="收起">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-compact-up" viewBox="0 0 16 16">
								<path fill-rule="evenodd" d="M7.776 5.553a.5.5 0 0 1 .448 0l6 3a.5.5 0 1 1-.448.894L8 6.56 2.224 9.447a.5.5 0 1 1-.448-.894l6-3z"/>
							</svg>
						</button>
					</div>
				</div>
				
			</div>`;
		
		$(".add").before(html);

		
		
		
		// event
		$(`#item${self.id}`).scale(450, .95);
		$('.controller').animate({ scrollTop: $('.controller')[0].scrollHeight }, 240, 'swing');

		
		unfold(self);
		foucs(self);
		slideUp(self);
		get(self);
		copyCommand(self);
		exportEvent();
		soundEevent();
		
		function get(self) {
			$(`#item${self.id}`).on('input', (e) => {
				
				let id = e.target.id;
		
				let value = $(`#item${self.id} #${id}`).val();
				let NumberValue = Number($(`#item${self.id} #${id}`).val());
		
				switch (id) {
					case "name":
						self[id] = value;
						break;
					case "particleName":
						self[id] = value;
						break;
					case "start":
					case "end":
						self[id] = NumberValue;
						self.render(0);
						break;
					case "step":
						if (NumberValue != 0) {
							self[id] = NumberValue;
							self.render(0);
							
							// 负载程度的颜色提示
							if (NumberValue >= 0.005) {
								$(`#item${self.id} #step`).css('color', '#333!important');
							} else if (NumberValue > 0.002) {
								$(`#item${self.id} #step`).css('color', '#ffaa00!important');
							} else {
								$(`#item${self.id} #step`).css('color', '#ff0000!important');
							}
						}
						break;
					case "x":
					case "y":
					case "z":
						self.position[id] = NumberValue;
						// self.particleGroup.position[id] = NumberValue;
						// self.pivots.position[id] = NumberValue;
						tween(self, 'pos', self.particles.position, 200);
						if (self.pivots != undefined)
							tween(self, 'pos', self.pivots.position, 200);
						
						break;
					case "scaleX":
					case "scaleY":
					case "scaleZ":
						self.scale[getLastLower(id)] = NumberValue;
						tween(self, 'scale', self.particles.scale, 200);
						if (self.pivots != undefined)
							tween(self, 'scale', self.pivots.scale, 200);
							
						break;
					case "grow":
						self[id] = NumberValue;
						if (self[id] != 0) {
							self.animation = true;
							self.render(self.animation);
						} else {
							self.animation = false;
							self.render(self.animation);
						}
						break;
					case "color":
						self.color = value;
		
						// 转义成three能识别的类型
						self.THREEcolor = parseInt((self.color.toString()).slice(1), 16);
						self.rgb = hexToRgb(self.color);
						// 颜色集合处理
						self.setColors(self.rgb);
						
						// 标志颜色更新
						infoUpdate(self);
						break;
						// 45° = PI
					case "rotateX":
					case "rotateY":
					case "rotateZ":
						// 获取最后一个字母的小写
						let direction = id.charAt(id.length - 1).toLowerCase();
						self.rotation[getLastLower(id)] = Math.round(Math.PI / 180 * NumberValue * 10 ** 4) / 10 ** 4;
						
						tween(self, 'rotation', self.particles.rotation, 200);
						if (self.pivots != undefined)
							tween(self, 'rotation', self.pivots.rotation, 200);
						console.log(direction);
						break;
					case "age":
						self[id] = NumberValue;
						break;
					case "rotateSpeed":
						self[id] = NumberValue;
						// 弃用rotateX,Y,Z
						// self.rotateX = 0;
						// self.rotateY = 0;
						// self.rotateZ = 0;
						// $(`#item${self.id} #rotateX`).val(0);
						// $(`#item${self.id} #rotateY`).val(0);
						// $(`#item${self.id} #rotateZ`).val(0);
						// let opacityValue = self.rotateSpeed ? 0.3 : 1;
						// $(`#item${self.id} #rotateX, #item${self.id} #rotateY, #item${self.id} #rotateZ`).prop('disabled', self
						// 	.rotateSpeed).css('opacity', opacityValue);
						break;
					case 'SEType':
						self[id] = value
						SE(self, value);
						break;
					case 'curve':
						self[id] = value
				}
				
				function infoUpdate(self) {
					let $flag = $(`#item${self.id} .flag`);
					$flag.css({
						'background': `rgba(${self.rgb.r}, ${self.rgb.g}, ${self.rgb.b}, 1)`,
						'border': `1px solid ${self.color}`
					});
					let rgbSum = self.rgb.r + self.rgb.g + self.rgb.b;
					if (rgbSum >= 255 * 3 / 2) {
						$flag.css('color', '#333');
					} else {
						$flag.css('color', '#fff');
					}
				}
			})
			
			
			$('#SEPlay').click(() => {
				SE(self, self.SEType);
			});
		}
		
		function foucs(self) {
		
			$(`#item${self.id} .expressionBox`).click(() => {
				ExceptSelf(self);
			});
		
			
			// 排他思想
			function ExceptSelf(self) {
				
				if ($(`#item${self.id}`).hasClass('itemFocus')) {
					// 收起
					$(`.item .sonParameter`).slideUp(500, 'easeOutExpo');
					// 去除所有线框
					$(`.item`).removeClass('itemFocus');

					footerToggle(false);
				} else {
					// 展开
					$(`.item .sonParameter`).not(`#item${self.id} .sonParameter`).slideUp(500, 'easeOutExpo');
					$(`#item${self.id} .sonParameter`).slideDown(500, 'easeOutExpo');
					// 去除所有线框
					$(`.item`).removeClass('itemFocus');
					// 保留自己的线框
					$(`#item${self.id}`).addClass('itemFocus');

					footerToggle(true);
				}
			}
		}
		
		function slideUp(self) {
			$(`#item${self.id} .slideUp`).click(() => {
				setTimeout(() => {
					$(`#item${self.id} .sonParameter`).slideUp(500, 'easeOutExpo');
					// 线框
					$(`#item${self.id}`).removeClass('itemFocus');
				});
				console.log("onclick slideUp");
				
				footerToggle(false);
			});
		}

		function footerToggle(t) {
			if (t) {
				$(`#item${self.id} .footer`).myFadeIn(240);
			} else {
				$(`#item${self.id} .footer`).myFadeOut(240)
			}
		}
		
		function unfold(self) {

			let item = `#item${self.id}`,
				label = $(item + ` .sonParameter .accordion .label`),
				label_i = $(item + ` .sonParameter .accordion .label i`),
				outer = $(item + ` .sonParameter .accordion`),
				HideArea = $(item + ` .accordion ul`);
			
			// 初始化-根据是否拥有类名 “fieldsetHide” 而隐藏
			if ($(`#item${self.id} .unfoldBox`).hasClass('hide')) {
				$(`.unfoldBox ul`).css('display', 'none');
			} else {
				$(label_i[0]).css('transform', 'rotate(-90deg)');
			}
			
			for (let i = 0; i < outer.length; i++) {
				$(label[i]).click(() => {
					
					let state = $(HideArea[i]).css('display');
					if (state == 'none') {
						showToggle(true, i);
					} else {
						showToggle(false, i);
					}
				});
			}

			function showToggle(t, i) {
				if (t) {
					// 显示
					$(HideArea[i]).slideDown(340, 'easeOutQuart');
					$(label_i[i]).css('transform', 'rotate(-90deg)')
					$(`#item${self.id} .accordion ul:eq(${i}) li`).css({
						'transition': '.34s',
						'opacity': 1,
						'transform': 'translateY(0%)'
					});
					
				} else {
					// 隐藏
					$(HideArea[i]).slideUp(340, 'easeOutQuart');
					$(label_i[i]).css('transform', 'rotate(0deg)');
					$(`#item${self.id} .accordion ul:eq(${i}) li`).css({
						'transition': '.34s',
						'opacity': 0,
						'transform': 'translateY(-100%)'
					});
				}
			}
		}

		function copyCommand(self) {
			let $copyBtn = $(`#item${self.id} #copy`);
		
			$copyBtn.click(() => {
				self.toMinecraftCommand();
		
				// textTip
				$copyBtn.text("copied!");
				setTimeout(() => {
					$copyBtn.css('opacity', 0);
				}, 1500);
				setTimeout(() => {
					$copyBtn.css('opacity', 1);
					$copyBtn.text("copy");
				}, 1700);
			});
		}
		
		function exportEvent() {
			$('.export').click(() => {
				exportToMineraft();
			});
		}
		
		function soundEevent() {
			playSound("show");
			$('.delete').click(() => { playSound("cancel") });
		}
	}
	
	setBasic(self) {

		let element =
		`<div class="accordion">
			<div class="label">
				<button class="unfold">
					<i class="fa fa-angle-left"></i>
				</button>
				参数设置
			</div>
			<ul class="settingList displayNone">
				<li>
					<div class="name">粒子类型</div>
					<div class="inputs">
						<select id="particleName">
							${this.lis()}
						</select>
					</div>
				</li>
				<li>
					<div class="name">坐标</div>
					<div class="inputs">
						<input type="number" id="x" value="${self.position.x}" placeholder="x">
						<input type="number" id="y" value="${self.position.y}" placeholder="y">
						<input type="number" id="z" value="${self.position.z}" placeholder="z">
					</div>
				</li>
				<li>
					<div class="name">色彩</div>
					<div class="inputs">
						<input type="color" id="color" value="${self.color}" placeholder="color">
					</div>
				</li>
				<li>
					<div class="name">缩放</div>
					<div class="inputs">
						<input type="number" id="scaleX" value="${self.scale.x}" min="0" step="0.1" placeholder="scaleX">
						<input type="number" id="scaleY" value="${self.scale.y}" min="0" step="0.1" placeholder="scaleY">
						<input type="number" id="scaleZ" value="${self.scale.z}" min="0" step="0.1" placeholder="scaleZ">
					</div>
				</li>
				<li>
					<div class="name">旋转°</div>
					<div class="inputs">
						<input type="number" id="rotateX" value="${self.rotation.x}" step="15" placeholder="rx">
						<input type="number" id="rotateY" value="${self.rotation.y}" step="15" placeholder="ry">
						<input type="number" id="rotateZ" value="${self.rotation.z}" step="15" placeholder="rz">
					</div>
				</li>
				${this.domian ? `<li>
					<div class="name">定义域</div>
					<div class="inputs">
						[<input type="number" id="start" value="${self.start}" step="0.1" placeholder="start"/>, 
						<input type="number" id="end" value="${self.end}" step="0.1" placeholder="end"/>]
					</div>
				</li>
				<li>
					<div class="name">步长</div>
					<div class="inputs">
						<input type="number" id="step" value="${self.step}" step="0.001" min="0.001" placeholder="step">
					</div>
				</li>
				<li>
					<div class="name">生长动画</div>
					<div class="inputs">
						<input type="number" id="grow" value="0" min="0" step="1" placeholder="grow">
					</div>
				</li>` : ''}
				<li>
					<div class="name">旋转速度</div>
					<div class="inputs">
						<input type="number" id="rotateSpeed" value="0" placeholder="speed">
					</div>
				</li>
				<li>
					<div class="name">寿命(秒)</div>
					<div class="inputs">
						<input type="number" id="age" value="${self.age}" min="0" step="1" placeholder="age">
					</div>
				</li>
			</ul>
		</div>`

		return element;
	}
	
	setSE(obj) {
		let html =
		`<div class="accordion">
			<div class="label">
				<button class="unfold"><i class="fa fa-angle-left"></i></button>动画
			</div>
			<ul class="settingList displayNone">
				<li>
					<div class="name">动画类型</div>
					<div class="inputs">
						<select id="SEType">
							<option value="null">无</option>
							<option value="up">上升</option>
							<option value="down">下降</option>
							<option value="left">左移</option>
							<option value="right">右移</option>
							<option value="downScaleY">从下展开</option>
							<option value="centerShow">爆炸</option>
							<option value="toCenter">聚拢</option>
						</select>
					</div>
				</li>
				<li>
				<div class="name">动画曲线</div>
				<div class="inputs">
					<select id="curve">
						<option value="Linear">线性</option>
						<option value="Quadratic">二次方缓动</option>
						<option value="Cubic">三次方缓动</option>
						<option value="Quartic">四次方缓动</option>
						<option value="Quintic">五次方缓动</option>
						<option value="Sinusoidal">正弦曲线</option>
						<option value="Exponential">指数曲线</option>
						<option value="Circular">圆形曲线</option>
						<option value="Elastic">指数正弦曲线</option>
						<option value="Back">超范围三次方</option>
						<option value="Bounce">指数反弹</option>
					</select>
				</div>
				</li>
				<li>
					<div class="name">移动距离</div>
					<div class="inputs">
						<input type="number" id="distance" value="${obj.distance}">
					</div>
				</li>
				<li>
					<div class="name">持续时间</div>
					<div class="inputs">
						<input type="number" id="outime" value="${obj.distance}">
					</div>
				</li>
				<li>
					<div class="name"></div>
					<div class="inputs">
						<button id="SEPlay"><i class="fa fa-play" style="font-size:13px;"></i></button>
					</div>
				</li>
			</ul>
		</div>`
		
		return html;
	}
	
	export() {
		let html =
		`<div class="accordion">
			<div class="label">
				<button class="unfold"><i class="fa fa-angle-left"></i></button>导出
			</div>
			<ul class="settingList displayNone">
				<li>
					<div class="name">动画类型</div>
					<div class="inputs">
						<select id="SEType">
							<option value="null">无</option>
							<option value="up">上升</option>
							<option value="down">下降</option>
							<option value="left">左移</option>
							<option value="right">右移</option>
							<option value="downScaleY">从下展开</option>
							<option value="centerScaleY">水平展开</option>
							<option value="centerScaleZ">垂直展开</option>
							<option value="centerShow">中心展开</option>
							<option value="toCenter">向中心收拢</option>
						</select>
					</div>
				</li>
				<li>
				<div class="name">动画曲线</div>
				<div class="inputs">
					<select id="curve">
						<option value="Linear">线性</option>
						<option value="Quadratic">二次方缓动</option>
						<option value="Cubic">三次方缓动</option>
						<option value="Quartic">四次方缓动</option>
						<option value="Quintic">五次方缓动</option>
						<option value="Sinusoidal">正弦曲线</option>
						<option value="Exponential">指数曲线</option>
						<option value="Circular">圆形曲线</option>
						<option value="Elastic">指数正弦曲线</option>
						<option value="Back">超范围三次方</option>
						<option value="Bounce">指数反弹</option>
					</select>
				</div>
				</li>
				<li>
					<div class="name">移动距离</div>
					<div class="inputs">
						<input type="number" id="distance" value="${obj.distance}">
					</div>
				</li>
				<li>
					<div class="name">持续时间</div>
					<div class="inputs">
						<input type="number" id="outime" value="${obj.distance}">
					</div>
				</li>
				<li>
					<div class="name"></div>
					<div class="inputs">
						<button id="SEPlay"><i class="fa fa-play" style="font-size:13px;"></i></button>
					</div>
				</li>
			</ul>
		</div>`
		
		return html;
	}

	lis() {
		let lis = ''
		for (let i = 0; i < particleNames.length; i++) {
			lis += `<option value="${particleNames[i][0]}">${particleNames[i][1]}</option>`
		}

		return lis;
	}
}