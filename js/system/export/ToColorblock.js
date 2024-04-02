import {hexToRgb,download, xRotate, yRotate, zRotate} from '../basis/functions.js'
import { SeeingDebug } from '../UI/debug/seeingDebug.js';

export function toParameter(obj, E, SE) {
	let tick = obj.animation ? "tick" : "";
	let grow = obj.animation ? " " + obj.grow * 3 : "";

	// 当值为零 = ''
	let x = obj.position.x ? obj.position.x : '';
	let y = obj.position.y ? obj.position.y : '';
	let z = obj.position.z ? obj.position.z : '';

	let rgb = hexToRgb(obj.color);
	let red = (rgb.r / 255).toFixed(2);
	let green = (rgb.g / 255).toFixed(2);
	let blue = (rgb.b / 255).toFixed(2);
	let ahpla = 1;
	let command =
		`particleex ${tick}parameter minecraft:${obj.particleName} ~${x} ~${y} ~${z} ${red} ${green} ${blue} ${ahpla} 0 0 0 ${obj.start} ${obj.end} "${E}" ${obj.step}${grow} ${obj.age * 20} ${SE}`;

	return command
}

export function toNormals(obj) {
	let rgb = hexToRgb(obj.color);
	let red = (rgb[0] / 255).toFixed(2);
	let green = (rgb[1] / 255).toFixed(2);
	let blue = (rgb[2] / 255).toFixed(2);
	let ahpla = 1;

	console.log(
		typeof(obj.points[0].x),
		"\nscale: ", typeof(obj.scale.x),
		"\nrotation", typeof(obj.rotation.x),
		"\nposition:" , typeof(obj.position.x),
		"\ndx: ", typeof(obj.dx)
	)

	let commands = ''
	for (let i = 0; i < obj.points.length; i++) {
		
		let p = { x: 0, y: 0, z: 0 }
		
		p.x = obj.points[i].x * obj.scale.x * obj.initScale
		p.y = obj.points[i].y * obj.scale.y * obj.initScale
		p.z = obj.points[i].z * obj.scale.z * obj.initScale
		
		p = xRotate(p, obj.rotation.x)
		p = yRotate(p, obj.rotation.y)
		p = zRotate(p, obj.rotation.z)

		p.x += obj.position.x + obj.dx
		p.y += obj.position.y + obj.dy
		p.z += obj.position.z + obj.dz
		
		p.x = Math.round(p.x * 10000) / 10000
		p.y = Math.round(p.y * 10000) / 10000
		p.z = Math.round(p.z * 10000) / 10000
		
		let command, SE;
		
		switch(obj.SEType) {
			case 'null':
				SE = `vy=0`
				command =
						`particleex normal minecraft:${obj.particleName} ~${p.x} ~${p.y} ~${p.z} ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
			case 'up':
				SE = `vy=.91^t*${obj.distance * 2}`
				command =
						`particleex normal minecraft:${obj.particleName} ~${p.x} ~${p.y - obj.distance * 11} ~${p.z} ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
			case 'down':
				SE = `vy=-.91^t*${obj.distance * 2}`
				command =
						`particleex normal minecraft:${obj.particleName} ~${p.x} ~${p.y + obj.distance * 11} ~${p.z} ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
			case 'left':
				SE = `vx=-.91^t*${obj.distance * 2}`
				command =
						`particleex normal minecraft:${obj.particleName} ~${p.x + obj.distance * 11} ~${p.y} ~${p.z} ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
			case 'right':
				SE = `vx=.91^t*${obj.distance * 2}`
				command =
						`particleex normal minecraft:${obj.particleName} ~${p.x - obj.distance * 11} ~${p.y} ~${p.z} ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
			case 'downScaleY':
				SE = `vy=.91^t*${p.y * .1}`
				command =
						`particleex normal minecraft:${obj.particleName} ~${p.x} ~ ~${p.z} ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
			case 'centerScaleY':
				obj.centerY = findCenter(obj)[1]
				SE = `vy=.91^t*${(p.y - obj.centerY) * .1}`
				command =
						`particleex normal minecraft:${obj.particleName} ~${p.x} ~${obj.centerY} ~${p.z} ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
			case 'centerScaleZ':
				obj.centerZ = findCenter(obj)[2]
				SE = `vz=.91^t*${(p.z - obj.centerZ) * .1}`
				command =
						`particleex normal minecraft:${obj.particleName} ~${p.x} ~${p.y} ~${obj.centerZ} ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
				break;
			case 'centerShow':
				SE = `(vx,vy,vz)=(.91^t*${p.x * .1 * obj.distance},.91^t*${p.y * .1 * obj.distance},.91^t*${p.z * .1 * obj.distance})`
				command =
						`particleex normal minecraft:${obj.particleName} ~ ~ ~ ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
			case 'toCenter':
				SE = `(vx,vy,vz)=(-.91^t*${p.x * .9},-.91^t*${p.y * .9},-.91^t*${p.z * .91})`
				command =
						`particleex normal minecraft:${obj.particleName} ~${p.x * 11} ~${p.y * 11} ~${p.z * 11} ${red} ${green} ${blue} ${ahpla} 0 0 0 0 0 0 1 ${obj.age * 20} "${SE}"`
				break;
			default: console.error('no find SEType');
		}

		commands += command + '\n'

		// seeingDebug
		if (i == 0) {
			let t = new SeeingDebug()
			$('.SeeDebugBoard p').text(t.test(command)).showScale(500);
		}
	}

	download(obj.name, commands, 'mcfunction');

	
}