const ExecShellScript = require("./ExecShellScript.js");
const power_light = new ExecShellScript("PowerLight.sh");

// 光をオン／オフするクラス
class PowerLight {

	constructor() {
		this.start_time_ms	= 0;
		this.stop_time_ms	= 5000;
	}

	onoff() {
		// 5秒間は無視する
		const now_time_ms = new Date().getTime();
		const delta_time_ms = now_time_ms - this.start_time_ms;
		if(delta_time_ms >= this.stop_time_ms) {
			power_light.exec("onoff");
		}
	}

}

module.exports = PowerLight;
