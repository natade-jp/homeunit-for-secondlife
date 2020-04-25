const File = require("../lib/File.js");
const env = File.getEnvironmentFile("../environment.sh");

// @ts-ignore
const server_address = "http://" + env["SERVER_ADDRESS"] + ":" + env["SERVER_PORT"] + "/";
// @ts-ignore
const timer_ms = parseFloat(env["CLIENT_INTERVAL_TIMER_SEC"]) * 1000;

const SendData = require("../lib/SendData.js");
const GetMotion = require("./GetMotion.js");
const ExecShellScript = require("./ExecShellScript.js");

const to_server = new SendData(server_address);

let light_value = NaN;
/**
 * 部屋の明るさ
 */
const get_light = new ExecShellScript(
	"PowerLight.sh",
	function callback(new_value) {
		if(isNaN(new_value)) {
			return;
		}
		if(light_value === new_value) {
			return;
		}
		light_value = new_value;
		to_server.send("RoomState?type=light&value=" + light_value);
	}
);

const motion_obj = new GetMotion();
let motion_value = NaN;
/**
 * 動体検知
 */
const get_motion = function() {
	const new_value = motion_obj.getValue();
	if(isNaN(new_value)) {
		return;
	}
	if(motion_value === new_value) {
		return;
	}
	motion_value = new_value;
	to_server.send("RoomState?type=motion&value=" + motion_value);
};

let temperature_value = NaN;
/**
 * 気温
 */
const get_temperature = new ExecShellScript(
	"GetTemperature.sh",
	function callback(new_value) {
		if(isNaN(new_value)) {
			return;
		}
		if(temperature_value === new_value) {
			return;
		}
		temperature_value = new_value;
		to_server.send("RoomState?type=temperature&value=" + temperature_value);
	}
);

/**
 * 定期実行用関数
 */
const interval_function = function() {
	get_light.exec("ison");
	get_motion();
	get_temperature.exec();
}

/**
 * 部屋の状態を調査する
 */
class RoomState {
	
	constructor() {
		this.interval_timer = null;
	}

	/**
	 * 監視を開始する
	 */
	start() {
		if(this.interval_timer === null) {
			this.interval_timer = setInterval(interval_function, timer_ms);
		}
	}

	/**
	 * 監視を停止する
	 */
	stop() {
		if(this.interval_timer !== null) {
			clearInterval(this.interval_timer);
			this.interval_timer = null;
		}
	}

}

module.exports = RoomState;
