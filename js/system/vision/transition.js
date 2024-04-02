import * as tweens from '../../plugins/threejs/tween.umd.js'
import { findCenter } from '../basis/functions.js'

export function tween(obj, type, attribute, transition) {
	
	let x, y, z
	switch(type) {
		case 'pos':
			x = obj.position.x
			y = obj.position.y
			z = obj.position.z
			break;
		case 'scale':
			x = obj.scale.x
			y = obj.scale.y
			z = obj.scale.z
			break;
		case 'rotation':
			x = obj.rotation.x
			y = obj.rotation.y
			z = obj.rotation.z
			break;
	}
	new TWEEN.Tween(attribute)
		.to({ x: x, y: y, z: z }, transition) // 移动到新位置，持续 transition 毫秒
		.easing(TWEEN.Easing.Cubic.Out) // 使用二次方缓动
		.onUpdate(() => {
			// 更新立方体位置
		})
		.start();
}

export function SE(obj, type) {
	
	let d;  // 距离 distance
	switch(type) {
		case 'up':
			
			// view
			obj.particles.position.y = -obj.distance * 11
			new TWEEN.Tween(obj.particles.position)
				.to({ y: obj.position.y }, 1000) // 移动到新位置，持续 transition 毫秒
				.easing(TWEEN.Easing.Cubic.Out) // 使用二次方缓动
				.onUpdate(() => {
					// 更新立方体位置
				})
				.start();

			//summonSE
			obj.dx = 0
			obj.dy = 0
			obj.dz = 0
			d = obj.distance
			obj.SE = 'vy=.91^t*' + d
			obj.dy = -d * 11
			$(`#item${obj.id} #y`).val(obj.y)
			console.log("SE: ", obj.SE)
			break;
		case 'down':
			
			// view
			obj.particles.position.y = obj.distance * 11
			new TWEEN.Tween(obj.particles.position)
				.to({ y: obj.position.y }, 1000) // 移动到新位置，持续 transition 毫秒
				.easing(TWEEN.Easing.Cubic.Out) // 使用二次方缓动
				.onUpdate(() => {
					// 更新立方体位置
				})
				.start();
				
			//summonSE
			obj.dx = 0
			obj.dy = 0
			obj.dz = 0
			d = obj.distance
			obj.SE = 'vy=-.91^t*' + d
			obj.dy = d * 11
			$(`#item${obj.id} #y`).val(obj.y)
			console.log("SE: ", obj.SE)
			break;
		case 'left':
			
			// view
			obj.particles.position.z = obj.distance * 11
			new TWEEN.Tween(obj.particles.position)
				.to({ z: obj.position.z }, 1000) // 移动到新位置，持续 transition 毫秒
				.easing(TWEEN.Easing.Cubic.Out) // 使用二次方缓动
				.onUpdate(() => {
					// 更新立方体位置
				})
				.start();
				
			// summonSE
			obj.dx = 0
			obj.dy = 0
			obj.dz = 0
			d = obj.distance
			obj.SE = 'vz=-.91^t*' + d
			obj.dz = d * 11
			console.log("SE: ", obj.SE)
			break;
		case 'right':
		
			// view
			obj.particles.position.z = -obj.distance * 11;

			new TWEEN.Tween(obj.particles.position)
				.to({ z: obj.position.z }, 1000) // 移动到新位置，持续 transition 毫秒
				.easing(TWEEN.Easing.Cubic.Out) // 使用二次方缓动
				.onUpdate(() => {
					// 更新立方体位置
				})
				.start();
				
			// summonSE
			obj.dx = 0
			obj.dy = 0
			obj.dz = 0
			
			d = obj.distance
			obj.SE = 'vz=.91^t*' + d
			obj.dz = -d * 11
			console.log("SE: ", obj.SE)
			break;
		case 'downScaleY':
			
			obj.particles.scale.y = 0;
			new TWEEN.Tween(obj.particles.scale)
				.to({ y: obj.scale.y }, 1000) // 移动到新位置，持续 transition 毫秒
				.easing(TWEEN.Easing.Quintic.Out) // 使用二次方缓动
				.onUpdate(() => {
					// 更新立方体位置
				})
				.start();
				
			break;
		case 'centerShow':
			
			obj.particles.scale.set(0, 0, 0);
			new TWEEN.Tween(obj.particles.scale)
				.to({ x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }, 1000) // 移动到新位置，持续 transition 毫秒
				.easing(TWEEN.Easing.Cubic.Out) // 使用二次方缓动
				.onUpdate(() => {
					// 更新立方体位置
				})
				.start();
		
			break;
		case 'toCenter':
			obj.particles.scale.set(3, 3, 3);
			new TWEEN.Tween(obj.particles.scale)
				.to({ x: obj.scale.x, y: obj.scale.y, z: obj.scale.z }, 1000) // 移动到新位置，持续 transition 毫秒
				.easing(TWEEN.Easing.Cubic.Out) // 使用二次方缓动
				.onUpdate(() => {
					// 更新立方体位置
				})
				.start();
			break;
	}
}

// export function easing(obj, type) {
// 	let easingType = 
// }