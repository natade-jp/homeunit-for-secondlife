const File = require("../lib/File.js");
const env = File.getEnvironmentFile("../environment.sh");
const exec = require("child_process").exec;

const client_port = parseFloat(env["CLIENT_PORT"]);

// js�t�@�C�����u���Ă���ꏊ
const curdir = __dirname;

// ����炷�N���X
class PlaySound {
	constructor() {
		this.start_time_ms	= 0;
		this.sound_time_ms	= 5000;
	}
	play() {
		// 5�b�Ԃ͎��̖������Ȃ��B
		const now_time_ms = new Date().getTime();
		const delta_time_ms = now_time_ms - this.start_time_ms;
		if(delta_time_ms >= this.sound_time_ms) {
			exec(curdir + "/playSound.sh");
			this.start_time_ms = new Date().getTime();
		}
	}
}

// ON/OFF�p�̃L���[�B���ʂɂ��܂��Ă���ꍇ�͉�������B
class BooleanQueue {

	constructor() {
		this.queue = [];
	}

	enqueue(x) {
		if(this.queue.length === 0) {
			this.queue.push(x);
			return;
		}
		// �Ō�ɐς񂾂��̂�x�̏ꍇ�͂܂Ȃ�
		if(x[this.queue.length - 1] === x) {
			return;
		}
		this.queue.push(x);
		// �ŏ��� true false true �Ȃ� true �ɂ܂Ƃ߂� 
		// �ŏ��� false true false �Ȃ� false �ɂ܂Ƃ߂� 
		if(this.queue.length >= 3) {
			if(this.queue[0] === this.queue[2]) {
				// �ォ��2���o��
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

// �d������n�N���X
class PowerControl {
	
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
				// ON�̂܂܈��S���Ԃ��߂���ƁAOFF�ɂȂ�
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
					exec(curdir + "/powerSwitchOn.sh");
					last_on_time_ms = new Date().getTime();
				}
				else {
					exec(curdir + "/powerSwitchOff.sh");
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

// �T�[�o�[�p�N���X
class WebServer {

	constructor(port) {
		this.port = port;
		this.http = require("http");
		this.url = require("url");
		this.server = this.http.createServer();
		this.function_map = [];

		const that = this;
		const onRequest = function(req, res) {
			const url_parse = that.url.parse(req.url, true);
			res.writeHead(200, {"Content-Type" : "text/plain"});
			const filename = url_parse.path.split(/[\\/?#]/);
			if(filename.length > 1) {
				res.write(""+ that.analysis(filename[1], url_parse.query));
			}
			res.end();
		};
		this.server.on("request", onRequest);
		this.server.listen(this.port);
	}

	addFunction(function_data) {
		this.function_map.push(function_data);
	}

	analysis(name, query) {
		if(name === "favicon.ico") {
			return 0;
		}
		for(let i = 0; i < this.function_map.length; i++) {
			const function_data = this.function_map[i];
			if(name !== function_data.name) {
				continue;
			}
			if(function_data.type && function_data.type !== query["type"]) {
				continue;
			}
			function_data.start();
		}
		return 0;
	}
}

// �N������GPIO�p�̃t�@�C�����Ȃ���Ԃɂ���B
exec(curdir + "/powerSwitchRemove.sh");

// Web�T�[�o�[�쐬
const server = new WebServer(client_port);

const playsound = new PlaySound();
server.addFunction(
	{
		name : "playSound",
		start : function() {
			playsound.play();
		}
	}
);

const power = new PowerControl();
server.addFunction(
	{
		name : "power",
		type : "on",
		start : function() {
			console.log("on");
			power.on();
		}
	}
);
server.addFunction(
	{
		name : "power",
		type : "off",
		start : function() {
			console.log("off");
			power.off();
		}
	}
);
