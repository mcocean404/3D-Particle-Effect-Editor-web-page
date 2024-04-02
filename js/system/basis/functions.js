export function download(name, content, after) {
	const file = new File([content], name + "." + after, {
		type: "text/plain",
	});

	const tmpLink = document.createElement("a");
	const objectUrl = URL.createObjectURL(file); // 此处应该是 file 而不是 downfile

	tmpLink.href = objectUrl;
	tmpLink.download = file.name.toLowerCase(); // 此处应该是 file.name 而不是 downfile.name
	document.body.appendChild(tmpLink);
	tmpLink.click();

	document.body.removeChild(tmpLink);
	URL.revokeObjectURL(objectUrl);
}

export function copyHandle(content) { // 指令复制
	if (content != undefined) {
		let copy = (e) => {
			e.preventDefault()
			e.clipboardData.setData('text/plain', content)

			document.removeEventListener('copy', copy)
		}
		document.addEventListener('copy', copy)
		document.execCommand("Copy");
		// alert("复制成功");
	} else {}
}

export function hexToRgb(hex) { // HEX 转换 RGB
	// 去除十六进制颜色值中的#号
	// console.log(hex)
	hex = hex.replace("#", "");

	// 将十六进制颜色值分割成红、绿、蓝三个通道的值
	var r = parseInt(hex.substring(0, 2), 16);
	var g = parseInt(hex.substring(2, 4), 16);
	var b = parseInt(hex.substring(4, 6), 16);

	// 返回RGB颜色值
	return { r: r, g: g, b: b };
}

export function rgbToHex(r, g, b) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);

    if (r.length == 1) {
        r = "0" + r;
    }
    if (g.length == 1) {
        g = "0" + g;
    }
    if (b.length == 1) {
        b = "0" + b;
    }

    return "#" + r + g + b;
}

export function isAlgebra(str) { // 代数：【没有符号 & 不能仅为数字 & 首字母是数字】
	return /^[^0-9][a-zA-Z0-9]*$/.test(str);
}

export function exportToMineraft() {
	let fileCount = 0;

	let commands = "";

	// 遍历 command
	for (let i = 0; i < global.Objects.length; i++) {

		if (global.Objects[i].mcfunction != true) break;

		global.Objects[i].toMinecraftCommand();

		let name = "# " + global.Objects[i].name + "\n";
		let command = global.Objects[i].command + '\n';

		commands += name + command;
	}

	if (commands != "") {
		download("fourier" + fileCount, commands, 'mcfunction');
	} else {
		alert("请先创建一个函数");
	}

	fileCount++;
}

export function xRotate(point, angle) {
	var y = point.y;
	var z = point.z;
	point.y = y * Math.cos(angle) - z * Math.sin(angle);
	point.z = y * Math.sin(angle) + z * Math.cos(angle);
	return point;
}
export function yRotate(point, angle) {
	var x = point.x;
	var z = point.z;
	point.x = x * Math.cos(angle) + z * Math.sin(angle);
	point.z = -x * Math.sin(angle) + z * Math.cos(angle);
	return point;
}
export function zRotate(point, angle) {
	var x = point.x;
	var y = point.y;
	point.x = x * Math.cos(angle) - y * Math.sin(angle);
	point.y = x * Math.sin(angle) + y * Math.cos(angle);
	return point;
}

export function getLastLower(str) {
	let lastChar = str.charAt(str.length - 1); // 获取最后一个字符
	let lastCharLower = lastChar.toLowerCase(); // 转换为小写
	return lastCharLower;
}
export function findCenter(obj) {
	let centerX = obj.points[0][1] * obj.initScale;
	let centerY = obj.points[0][2] * obj.initScale;
	let centerZ = obj.points[0][3] * obj.initScale;
	for (let i = 0; i < obj.points.length; i++) {
		if (obj.centerX < obj.points[i][1]) obj.centerX = obj.points[i][1] * obj.initScale
		if (obj.centerY < obj.points[i][2]) obj.centerY = obj.points[i][2] * obj.initScale
		if (obj.centerZ < obj.points[i][3]) obj.centerZ = obj.points[i][3] * obj.initScale
	}
	
	return [centerX, centerY, centerZ]
}

// 载荷颜色
export function loadColor(self) {
	
	let color, text;
	if (self.countParticles < 10000) {
		color = "#00aa00";
		text = "流畅";
	} else if (self.countParticles < 50000) {
		color = "#ff8c00"
		text = "一般";
	} else if (self.countParticles >= 50000) {
		color = "#ff5500"
		text = "负荷较高";
	}
	let rgb = hexToRgb(color);
	$(`#item${self.id} #particles`).html(self.countParticles +
			`<span style="color:rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1);">（${text}）</span>`)
		.css('color', color);
}

// 是数值的字符串
export function isNumericString(str) {
	return /^\d+$/.test(str);
}

export function containsEnglish(str) {
	return /[a-zA-Z]/.test(str);
}

export function playSound(id) {
    document.getElementById(id).play()
}

