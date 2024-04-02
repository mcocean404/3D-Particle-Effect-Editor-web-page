import * as three from "./plugins/threejs/three.min.js"
import * as OrbitControls from "./plugins/threejs/OrbitControls.js"
import * as tweem from './plugins/threejs/tween.umd.js'
import * as Settting from "./system/UI/setting/Setting.js"
import * as Option from "./system/UI/Option.js"
import * as Window from "./system/UI/Window.js"
import * as sound from './system/UI/soundEffect.js'

// 创建场景对象
export let scene = new THREE.Scene();
// scene.background = new THREE.Color(0xeff4fa);

let width = $('.canvas-container').width();
let height = $('.canvas-container').height();

// 创建相机对象
export let camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
camera.position.set(-15, 10, 15);

// 创建渲染器对象
export let renderer = new THREE.WebGLRenderer({
	antialias: true,
	alpha: true
});

// renderer.setClearAlpha(0.2);
renderer.setSize(width, height);
// 将渲染器添加到页面中
$('.canvas-container').append(renderer.domElement);
// 添加网格辅助对象，用于显示刻度网格
let gridHelper = new THREE.GridHelper(50, 25, 0xececec, 0xececec);
gridHelper.material.color.set(0xBBBBBB); // 设置颜色为红色
scene.add(gridHelper);


// 创建AxesHelper对象(xyz)
let axesHelper = new THREE.AxesHelper(5);
axesHelper.position.set(0, .01, 0);
scene.add(axesHelper);

// 创建一个点作为中心点
let centerPoint = new THREE.Vector3(0, 0, 0);

// 添加鼠标控制
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 开启阻尼
controls.dampingFactor = 0.05; // 阻尼系数
controls.rotateSpeed = 0.5; // 将旋转速度调整为0.5

// 添加泛光效果
let renderScene = new THREE.RenderPass(scene, camera);
let bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85 );
bloomPass.threshold = 0;
bloomPass.strength = 1.5;
bloomPass.radius = 1;

let composer = new THREE.EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);


let angle = 0;
let radius = 35;
// 渲染场景
function animate() {
	requestAnimationFrame(animate.bind(this));
	controls.update();

	if (set.circularMotion) {
		// 让摄像机绕中心点做圆周旋转
		angle = Date.now() * 0.0003; // 获取当前时间
		camera.position.x = centerPoint.x + radius * Math.cos(angle); // 根据极坐标计算摄像机位置
		camera.position.z = centerPoint.z + radius * Math.sin(angle);
		camera.lookAt(centerPoint); // 让摄像机一直朝向中心点
	}

	// rotate
	if (global.Objects.length) {
		for (let i = 0; i < global.Objects.length; i++) {
			if (
				global.Objects[i] == 0 ||
				global.Objects[i].rotateSpeed == 0 ||
				global.Objects[i].type != "function"
			) break;

			global.Objects[i].particleGroup.rotation.y += global.Objects[i].rotateSpeed / 1000
			global.Objects[i].pivots.rotation.y += global.Objects[i].rotateSpeed / 1000
		}
	}
	TWEEN.update(); // 更新tween.js动画
	
	renderer.render(scene, camera);

	if (set.luminescence) {
		// 更新EffectComposer
		composer.render();
	}
}

animate();