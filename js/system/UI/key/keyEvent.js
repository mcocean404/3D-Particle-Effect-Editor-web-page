import { append } from "../Option.js"
document.addEventListener('keydown', function(event) {
    
    // 添加 Fouier 对象 Alt + A
    if (event.altKey && event.key === 'f' || event.keyCode === 18 && event.which === 65) {
        append("Fourier");
    } else if (event.altKey && event.key === 'a' || event.keyCode === 18 && event.which === 65) {
        append("Algebra");
    } else if (event.altKey && event.key === 'm' || event.keyCode === 18 && event.which === 65) {
        append("Model");
    } else if (event.altKey && event.key === 'i' || event.keyCode === 18 && event.which === 65) {
        append("Img");
    }

    // 清除所有对象 Ctrl + Alt + C
    if (event.ctrlKey && event.altKey && (event.which === 67 || event.keyCode === 67)) {
        console.log('Ctrl + Alt + C 组合键被按下');

        let closeBtns = $('.item .delete');
        for (let i = 0; i < closeBtns.length; i++) {
            $(closeBtns[i]).trigger('click');
        }
    }

// 坐标控制
    if (event.key === 'ArrowLeft') {
        console.log('左箭头键被按下');
        // 执行相应操作
    }
    // 检测上箭头键
    else if (event.key === 'ArrowUp') {
        console.log('上箭头键被按下');
        // 执行相应操作
    }
    // 检测右箭头键
    else if (event.key === 'ArrowRight') {
        console.log('右箭头键被按下');
        // 执行相应操作
    }
    // 检测下箭头键
    else if (event.key === 'ArrowDown') {
        console.log('下箭头键被按下');
        // 执行相应操作
    }
    
    // 检测 Ctrl + Shift
    else if (event.ctrlKey && event.shiftKey) {
        console.log('Ctrl + Shift 组合键被按下');
        // 执行相应操作
    }
    
    // 检测 Ctrl + Space
    else if (event.ctrlKey && event.key === ' ') {
        console.log('Ctrl + Space 组合键被按下');
        // 执行相应操作
    }
});