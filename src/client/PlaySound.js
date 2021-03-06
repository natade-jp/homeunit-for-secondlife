const ExecShellScript = require("./ExecShellScript.js");
const play_sound = new ExecShellScript("PlaySound.sh");

// 音を鳴らすクラス

class PlaySound {
	constructor() {
		this.start_time_ms	= 0;
		this.stop_time_ms	= 5000;
	}

	play() {
		// 5秒間は次の鳴動をしない。
		const now_time_ms = new Date().getTime();
		const delta_time_ms = now_time_ms - this.start_time_ms;
		if(delta_time_ms >= this.stop_time_ms) {
			play_sound.exec();
			this.start_time_ms = new Date().getTime();
		}
	}

}

module.exports = PlaySound;
