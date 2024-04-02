import { renderer, camera } from '../../main.js'
import * as keyDown from './key/keyEvent.js'
export class Window {
	constructor() {
		this.resize();
	}
	resize() {
		$(window).resize(() => {
			let width = $(".canvas-container").width();
			let height = $(".canvas-container").height();
			renderer.setSize(width, height);
			camera.aspect  = width / height;
			camera.updateProjectionMatrix();
		});
	}
}
// 启动窗口事件
let start_window_event = new Window();