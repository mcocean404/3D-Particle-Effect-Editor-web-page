export class Button {
	constructor(title, element, booler, CallBack) {
		this.title = title
		this.element = element;
		this.booler = booler;
		this.callBack = CallBack;

		this.init();
		this.buttonToggle(this.booler);
	}

	init() {
		set[this.element] = this.booler
		
		this.li = `<li id="${this.element}">${this.title}<i class="fa fa-toggle-off"></i></li>`
		$('.state .OFFON').append(this.li);
		
		$(`.OFFON #${this.element} i`).click(() => {
			this.buttonToggle();
			this.callBack()
		});
	}

	buttonToggle() {
		if (this.booler) {
			$(`.OFFON #${this.element} i`).removeClass("fa-toggle-off").addClass("fa-toggle-on")
		} else {
			$(`.OFFON #${this.element} i`).removeClass("fa-toggle-on").addClass("fa-toggle-off")
		}
		
		this.booler = this.booler ? false : true;
	}
}