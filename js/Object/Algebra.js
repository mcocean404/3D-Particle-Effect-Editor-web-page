// 代数类
export class Algebra {
	constructor(id) {
		this.type = "algebra";
		this.mcfunction = false;
		this.id = id;
		this.name = String.fromCharCode(Number(id + 97));
		this.start = -5;
		this.end = 5;
		this.step = 0.01;
		this.rate = 1;
		this.value = (this.start + this.end) / 2;
		this.sgin = 1;
		this.playToggle = "PLAY";

		this.addItem();
		this.event();
	}

	addItem() {
		let html =
			`<div class="item Algebra" id="itemAlgebra${this.id}">
				<button class="delete" title="删除">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
						<path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
					</svg>
				</button>
				
				<div class="expressionBox alterArea">
					<div class="type">
						<index>${Number(this.id) + 1}</index>
						<div class="flag">A</div>
					</div>
					<div class="content">
						<div class="currently">
							<input type="text" id="name" value="${this.name}"/> = <span id="value">2.55</span>
						</div>
						<div id="play"><i class="fa fa-play"></i></div>
						<div class="rateBox">
							<i class="fa fa-angle-double-left"></i>
							<span id="rate">1 ×</span>
							<i class="fa fa-angle-double-right"></i>
						</div>
						<input class="domain" id="start" value="${this.start}"/>
						<input type="range" id="range" value="${this.value}" min="${this.start}" max="${this.end}" step="${this.step}"/>
						<input class="domain" id="end" value="${this.end}"/>
					</div>
				</div>
			</div>`;
		$(".add").before(html);
		$(`#item${this.id}`).scale(540, .95);

		// get basic jQuery DOM
		this.$name = $(`#itemAlgebra${this.id} #name`);
		this.$range = $(`#itemAlgebra${this.id} #range`);
		this.$value = $(`#itemAlgebra${this.id} #value`);
		this.$play = $(`#itemAlgebra${this.id} #play`);
		this.$playIcon = $(`#itemAlgebra${this.id} #play .fa`);
		this.$deleteBtn = $(`#itemAlgebra${this.id} .delete`);
		this.$rateBox = $(`#itemAlgebra${this.id} .rateBox`);
		this.$rateLeft = $(`#itemAlgebra${this.id} .rateBox .fa-angle-double-left`);
		this.$rate = $(`#itemAlgebra${this.id} .rateBox #rate`);
		this.$rateRight = $(`#itemAlgebra${this.id} .rateBox .fa-angle-double-right`);

	}

	event() {
		let lastKey = this.name
		// auto width of name input
		this.$name.on('input', () => {
			// delete global.Algebras[lastKey]

			// lastKey = this.name
			this.name = this.$name.val();
			autoTextWidth(this);
		});
		
		// change key name
		this.$name.on('blur', () => {
			console.log("last：", lastKey, "\nfinally: ", this.$name.val());
		});

		// init auto width of name input
		autoTextWidth(this);

		function autoTextWidth(self) {
			self.$name.css('width', (self.name.length) * 9 + 'px');
		}

		// Range change event
		this.$range.on('input', () => {

			// get value value
			this.value = Number(this.$range.val());
			this.$value.text(this.value);

			this.update();
			// console.log(this.value)
		});


		// paly and pause
		this.$play.click(() => {

			// paly
			if (this.playToggle == "PLAY") {

				clearInterval(this.loop);
				this.loop = setInterval(() => {
					// 
					this.value += this.step * this.sgin * this.rate
					this.value = Math.round(this.value * 10000) / 10000

					// update
					this.$range.val(this.value);
					this.$value.text(this.value);
					console.log(this.value);

					// alter sgin direction
					if (this.value >= this.end) this.sgin = -1
					if (this.value <= this.start) this.sgin = 1

					this.update()
				}, 10);

				this.playTemp();
			}

			// pause
			else if (this.playToggle == "PAUSE") {
				this.playTemp();
				clearInterval(this.loop);
			}
		});


		// rate change
		this.$rateLeft.click(() => {
			this.rate *= 0.5;
			if (this.rate <= 0.05) {
				this.rate = 0.05
			}

			this.rate = Math.round(this.rate * 100) / 100
			this.$rate.text(this.rate + '×');
		});
		this.$rateRight.click(() => {
			this.rate /= 0.5;
			if (this.rate >= 20) {
				this.rate = 20
			}

			this.rate = Math.round(this.rate * 10) / 10
			this.$rate.text(this.rate + '×');
		});


		// stop range
		$(`#itemAlgebra${this.id} #name, #itemAlgebra${this.id} #range, #itemAlgebra${this.id} #start, #itemAlgebra${this.id} #end`)
			.mousedown(() => {
				this.playTemp(false)
				clearInterval(this.loop);
			});


		this.$deleteBtn.click(() => {
			$(`#itemAlgebra${this.id}`).slideUp(240)
			setTimeout(() => {
				$(`#itemAlgebra${this.id}`).remove()
			}, 240);
			delete this

			// 腾出数组位置
			global.Objects[this.id] = 0;
		});
	}

	playTemp(toggle) {

		let temp,
			rClass,
			aClass,
			translateX,
			pointerEvents;

		if (toggle === undefined) {
			if (this.playToggle == "PLAY") {
				temp = 1
				rClass = 'fa-play'
				aClass = 'fa-pause'
				translateX = 'translateX(-4.5px)'
			} else {
				temp = 0
				rClass = 'fa-pause'
				aClass = 'fa-play'
				translateX = 'translateX(-3.5px)'
			}
		} else {
			if (toggle == true) {
				this.playToggle = "PAUSE"
				temp = 1
				rClass = 'fa-play'
				aClass = 'fa-pause'
				translateX = 'translateX(-4.5px)'
			} else {
				this.playToggle = "PLAY"
				temp = 0
				rClass = 'fa-pause'
				aClass = 'fa-play'
				translateX = 'translateX(-3.5px)'
			}
		}


		this.$playIcon.removeClass(rClass)
			.addClass(aClass)
			.css('transform', translateX);

		this.$rateBox.css({
			'opacity': temp,
			'pointer-events': temp ? 'all' : 'none'
		});
		this.$deleteBtn.css({
			'opacity': temp ? 0 : 1,
			'pointer-events': temp ? 0 : 1 ? 'all' : 'none'
		});

		// console.log(this.playToggle);

		if (toggle === undefined) {
			this.playToggle = this.playToggle == "PLAY" ? "PAUSE" : "PLAY";
		}

	}

	update() {
		global.Algebras[this.name] = this.value
		
		this.updateFouirerRotor()
		// console.log(global.Algebras);
	}

	updateFouirerRotor() {
		for (let i = 0; i < global.AlgebraLink.length; i ++) {

			// get link object
			let linkData = global.AlgebraLink[i];

			// get object
			let obj = global.Objects[linkData.itemID];

			// show rotors data
			console.log(obj.rotors);

			// get key
			let key = linkData.AlgebraName;

			let value = global.Algebras[key]
			console.log("value: ", value)

			obj.rotors[linkData.rotorIndex][linkData.rotorKey] = value;
			obj.render(obj.animation);
		}
	}
}