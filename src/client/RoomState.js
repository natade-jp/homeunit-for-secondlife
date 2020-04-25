const File = require("../lib/File.js");
const env = File.getEnvironmentFile("../environment.sh");

// @ts-ignore
const server_address = "http://" + env["SERVER_ADDRESS"] + ":" + env["SERVER_PORT"] + "/";
// @ts-ignore
const timer_sec = parseFloat(env["CLIENT_INTERVAL_TIMER_SEC"]);
const exec = require("child_process").exec;

// jsファイルが置いてある場所
const curdir = __dirname;

/**
 * 部屋の状態を調査する
 */
class GetStateForShellScript {

	/**
	 * @param {string} script_name 
	 * @param {function(number|undefined): void} callback 
	 */
	constructor(script_name, callback) {
		this.script_path = curdir + "/" + script_name;

		/**
		 * @param {import("child_process").ExecException | null} error 
		 * @param {string} stdout 
		 * @param {string} stderr 
		 */
		this.exec_callback = function(error, stdout, stderr) {
			if (error !== null) {
				callback(undefined);
			}
			else {
				callback(parseFloat(stdout.replace(/^[\r\n ]*|[\r\n ]*$/g, "")));
			}
		}
	}

	exec() {
		exec(this.script_path, this.exec_callback);
	}
}

let value_light = NaN;
/**
 * 部屋の明るさ
 */
const GetLight = new GetStateForShellScript(
	"GetIlluminance.sh",
	function callback(new_value) {
		if(new_value === undefined) {
			return;
		}
		const value_light_now = new_value > 0 ? 1 : 0;
		if(value_light === value_light_now) {
			return;
		}
		value_light = value_light_now;
//		exec("curl " + server_address + "RoomState?type=light&value=" + value_light);
		console.log("curl " + server_address + "RoomState?type=light&value=" + value_light);
	}
);

let value_motion = NaN;
/**
 * 動体検知
 */
const GetMotion = new GetStateForShellScript(
	"GetMotion.sh",
	function callback(new_value) {
		if(new_value === undefined) {
			return;
		}
		if(value_motion === new_value) {
			return;
		}
		value_motion = new_value;
//		exec("curl " + server_address + "RoomState?type=motion&value=" + value_motion);
		console.log("curl " + server_address + "RoomState?type=motion&value=" + value_motion);
	}
);

let value_temperature = NaN;
/**
 * 気温
 */
const GetTemperature = new GetStateForShellScript(
	"GetTemperature.sh",
	function callback(new_value) {
		if(new_value === undefined) {
			return;
		}
		if(value_temperature === new_value) {
			return;
		}
		value_temperature = new_value;
//		exec("curl " + server_address + "RoomState?type=temperature&value=" + value_temperature);
		console.log("curl " + server_address + "RoomState?type=temperature&value=" + value_temperature);
	}
);

/**
 * 定期実行用関数
 */
const interval_function = function() {
	GetLight.exec();
	GetMotion.exec();
	GetTemperature.exec();
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
			this.interval_timer = setInterval(interval_function, timer_sec);
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
