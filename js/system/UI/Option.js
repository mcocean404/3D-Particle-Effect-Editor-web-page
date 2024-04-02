import { Fourier } from '../../Object/Fourier.js'
import { Algebra } from "../../Object/Algebra.js"
import { Polar } from "../../Object/Polar.js"
import { Model } from "../../Object/Model.js"
import { Img } from "../../Object/Img.js"

export function option() {
	// show option menu
	$(".add button").focus(() => {
		$('.optionMenu').fadeIn(300).click(function() {
			$(this).fadeOut(0);
		});
	});

	// option menu
	let options = $('.optionMenu div');
	for (let i = 0; i < options.length; i++) {
		// find ids
		let id = $(options[i]).attr('id');

		$(`.optionMenu #${id}`).click(() => {

			append(id);
			console.log(id);
		});
	}
}

option();

export function append(type) {
	// 补齐算法
	let countZero = 0;
	
	for (let i = 0; i < global.Objects.length; i++) {
		if (global.Objects[i] == 0) {
			
			createObject('insert', type, i);

			countZero++;
			break;
		}
	}
	// 正常追加
	if (countZero == 0) {
		let index = global.Objects.length;
		
		createObject('append', type, index);
	}
	
	function createObject(addWay, type, index) {

		switch (addWay) {
			case 'append':
				eval(`global.Objects.push(new ${type}(index))`);
				break;
			case 'insert':
				eval(`global.Objects[index] = new ${type}(index)`);
				break;
		}

		if (type == "Algebra") initAlgebraKey();

		function initAlgebraKey() {
			let obj = {}
			obj.name = global.Objects[index].name
			global.Algebras[obj.name] = global.Objects[index].value

			console.log(global.Algebras);
		}
	}
}

