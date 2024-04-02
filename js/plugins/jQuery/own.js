// jquery 自定义方法
$.fn.scale = function(timeout, scale) {

	$(this).css({
		'transition': '0s cubic-bezier(0.08, 0.3, 0,1)',
		'opacity': 0,
		'transform': 'scale(' + scale + ')'
	});

	setTimeout(() => {
		$(this).css({
			'transition': timeout + 'ms cubic-bezier(0.08, 0.3, 0,1)',
			'opacity': 1,
			'pointer-events': 'all',
			'transform': 'scale(1)'
		});
	});
	// 清除 transition
	setTimeout(() => {
		$(this).css('transition', 'none')
	}, timeout);
	return this;
};

$.fn.scaleShow = function(timeout) {
	$(this).css({
		'transition': timeout + 'ms cubic-bezier(0.08, 0.3, 0,1)',
		'opacity': 1,
		'pointer-events': 'all',
		'transform': 'scale(1)'
	});
	
	setTimeout(() => {$(this).css('transition', '0ms');}, timeout);
	return this;
};
$.fn.scaleHide = function(timeout, scale) {
	$(this).css({
		'transition': timeout + 'ms cubic-bezier(0.08, 0.3, 0,1)',
		'opacity': 0,
		'pointer-events': 'none',
		'transform': 'scale(' + scale + ')'
	});
	setTimeout(() => {$(this).css('transition', '0ms');}, timeout);
	return this;
};

$.fn.scaleXShow = function(timeout) {
	$(this).css({
		'transition': timeout + 'ms',
		'opacity': 1,
		'pointer-events': 'all',
		'transform': 'scaleX(1)'
	});
	return this;
};
$.fn.scaleXHide = function(timeout) {
	$(this).css({
		'transition': timeout + 'ms',
		'opacity': 0,
		'pointer-events': 'none',
		'transform': 'scaleX(.8)'
	});
	return this;
};

$.fn.scaleYShow = function(timeout) {
	$(this).css({
		'transition': timeout + 'ms',
		'opacity': 1,
		'pointer-events': 'all',
		'transform': 'scaleY(1)'
	});
	return this;
};
$.fn.scaleYHide = function(timeout) {
	$(this).css({
		'transition': timeout + 'ms',
		'opacity': 0,
		'pointer-events': 'none',
		'transform': 'scaleY(.8)'
	});
	return this;
};

$.fn.myFadeIn = function(timeout) {
	$(this).css({
		'transition': timeout + 'ms',
		'opacity': 1,
		'pointer-events': 'all'
	});
	return this;
}
$.fn.myFadeOut = function(timeout) {
	$(this).css({
		'transition': timeout + 'ms',
		'opacity': 0,
		'pointer-events': 'none'
	});
	return this;
}
