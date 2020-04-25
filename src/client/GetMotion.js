const File = require("../lib/File.js");
const env = File.getEnvironmentFile("../environment.sh");

// @ts-ignore
const timer_ms = parseFloat(env["CLIENT_MOTION_INTERVAL_TIMER_SEC"]) * 1000;

const ExecShellScript = require("./ExecShellScript.js");

/**
 * @type {number[]}
 */
let motion_value_array = [];

let value_motion = NaN;

/**
 * 動体検知
 */
const get_motion = new ExecShellScript(
	"GetMotion.sh",
	function callback(value) {
		if(value === undefined) {
			return;
		}
		motion_value_array.push(value);
		if(motion_value_array.length < 10) {
			return;
		}
		const new_value = motion_value_array.shift();
		for(let i = 0; i < motion_value_array.length; i++) {
			if(motion_value_array[i] !== new_value) {
				return;
			}
		}
		// 連続一致している。
		value_motion = new_value;
	}
);

// 動体検知クラス
class GetMotion {
	constructor() {
		const interval = function() {
			get_motion.exec();
		};
		this.timer = setInterval(interval, timer_ms);
	}
	getValue() {
		return value_motion;
	}
}

module.exports = GetMotion;
