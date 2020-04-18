//@ts-check

const exec = require("child_process").exec;

// jsファイルが置いてある場所
const curdir = __dirname;

/**
 * ON/OFF用のキュー。無駄にたまっている場合は解除する。
 */
class BooleanQueue {

	constructor() {
		/**
		 * @type {boolean[]}
		 */
		this.queue = [];
	}

	/**
	 * @param {boolean} x 
	 */
	enqueue(x) {
		if(this.queue.length === 0) {
			this.queue.push(x);
			return;
		}
		// 最後に積んだものがxの場合はつまない
		if(this.queue[this.queue.length - 1] === x) {
			return;
		}
		this.queue.push(x);
		// 最初が true false true なら true にまとめる 
		// 最初が false true false なら false にまとめる 
		if(this.queue.length >= 3) {
			if(this.queue[0] === this.queue[2]) {
				// 上から2個取り出す
				this.queue.pop();
				this.queue.pop();
			}
		}
	}

	dequeue() {
		if(this.queue.length === 0) {
			return null;
		}
		return this.queue.shift();
	}
}

/**
 * 電源制御系クラス
 */
class PowerSwitch {
	
	constructor() {
		const that = this;
		this.queue = new BooleanQueue();
		const anzen_off_time_ms	= 60 * 60 * 1000;
		let last_on_time_ms	= 0;
		let is_on = false;
		const interval = function() {
			{
				const now_time_ms = new Date().getTime();
				const delta_time_ms = now_time_ms - last_on_time_ms;
				// ONのまま安全時間を過ぎると、OFFになる
				if(is_on && (delta_time_ms >= anzen_off_time_ms)) {
					that.off();
				}
			}
			{
				const data = that.queue.dequeue();
				if(data === null) {
					return;
				}
				is_on = data;
				if(is_on) {
					exec(curdir + "/PowerSwitchOn.sh");
					last_on_time_ms = new Date().getTime();
				}
				else {
					exec(curdir + "/PowerSwitchOff.sh");
				}
			}
		};
		this.timer = setInterval(interval, 5000);
	}

	on() {
		this.queue.enqueue(true);
	}

	off() {
		this.queue.enqueue(false);
	}
}

// 起動時はGPIO用のファイルがない状態にする。
exec(curdir + "/PowerSwitchRemove.sh");

module.exports = PowerSwitch;
