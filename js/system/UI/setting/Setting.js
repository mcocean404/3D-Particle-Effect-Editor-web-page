import { Button } from "./Button.js"


class Setting {
	constructor() {
		this.initTheme();
		this.settingButton();
		this.mediaQuery()
	}

	static {
		// 启动昼夜主题自动切换
		let startSetting = new Setting();
	}

	// 主题切换
	initTheme() {
		// 自动
		// 创建一个媒体查询，用于检测系统主题
		var darkThemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

		// 初始化时调用一次回调函数，获取当前系统主题
		handleThemeChange(this, darkThemeMediaQuery);

		// 监听系统主题变化的事件
		darkThemeMediaQuery.addListener(handleThemeChange);

		// 定义一个回调函数，用于处理系统主题变化的事件
		function handleThemeChange(self, e) {
			if (e.matches) {
				// 系统主题切换到暗色模式
				console.log("系统主题切换到暗色模式");
				set.theme = "night";
				$('#theme').attr("href", "css/night.css");
			} else {
				// 系统主题切换到亮色模式
				console.log("系统主题切换到亮色模式");
				set.theme = "day";
			}
			self.night_or_day(set.theme);
		}

		// 手动
		$('.handTheme').click(() => {
			if (set.theme == 'day') {
				set.theme = 'night';
			} else {
				set.theme = 'day';
				set.luminescence = false
			}
			this.night_or_day(set.theme);
		});
	}

	night_or_day(theme) {
		if (theme == 'night') { // night
			$(".toNight").text("日间模式");
		} else { // day
			$(".toNight").text("夜间模式");
		}
		$('#theme').attr("href", "css/" + theme + ".css");
	}

	settingButton() {
		
		// 圆周旋转
		let circularMotion = new Button('圆周旋转', 'circularMotion', set.circularMotion, () => {
			set.circularMotion = !circularMotion.booler;
		});
		
		
		// 泛光
		let luminescence = new Button('发光效果', 'luminescence', set.luminescence, () => {
			set.luminescence = !luminescence.booler;
			if (set.luminescence) {
				// this.night_or_day('night');
			} else {
				// this.night_or_day('day');
			}
		});

		// 单机输入框全选内容
		// $(".controller").click((e) => {
		// 	if (e.target.tagName == "INPUT") {
		// 		$(e.target).select();
		// 	}
		// });
	}
	
	mediaQuery(e) {
		if (window.innerWidth > 500) {
			// 当设备宽度大于500时执行的事件
			console.log('设备宽度大于500');
			// 执行其他操作
			$('.more').hide();
		} else {
			// 当设备宽度小于等于500时执行的事件
			$('.more').show();
			console.log('设备宽度小于等于500');
			// 执行其他操作
			$(".more").click(() => {
				$('.state').toggle(200);
	
				global.mediaMode = global.mediaMode == "phone" ? "PC" : "phone";
				if (global.mediaMode == "phone") {
					$('.more').text('...');
				} else {
					$('.more').text('-');
				}
			});
		}
	}
}
