let soundElements = {
    click: `<audio src="assets/sounds/click.wav" id="click"></audio>`,
    cancel: `<audio src="assets/sounds/cancel.wav" id="cancel"></audio>`,
    show: `<audio src="assets/sounds/show.wav" id="show"></audio>`,
    loaded: `<audio src="assets/sounds/loaded.wav" id="loaded"></audio>`,
}

let keys = Object.keys(soundElements);
for (let i = 0; i < keys.length; i++) {
    $('body').append(soundElements[keys[i]]);
}