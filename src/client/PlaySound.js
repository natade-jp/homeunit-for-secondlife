
const exec = require("child_process").exec;

// jsファイルが置いてある場所
const curdir = __dirname;

// 音を鳴らすクラス
class PlaySound {
	constructor() {
		this.start_time_ms	= 0;
		this.sound_time_ms	= 5000;
	}
	play() {
		// 5秒間は次の鳴動をしない。
		const now_time_ms = new Date().getTime();
		const delta_time_ms = now_time_ms - this.start_time_ms;
		if(delta_time_ms >= this.sound_time_ms) {
			exec(curdir + "/PlaySound.sh");
			this.start_time_ms = new Date().getTime();
		}
	}
}

module.exports = PlaySound;
