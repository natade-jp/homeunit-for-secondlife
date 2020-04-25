const File = require("../lib/File.js");
const env = File.getEnvironmentFile("../environment.sh");

// @ts-ignore
const client_port = parseFloat(env["CLIENT_PORT"]);

const PowerSwitch = require("./PowerSwitch.js");
const PlaySound = require("./PlaySound.js");
const RoomState = require("./RoomState.js");

/**
 * API
 * @typedef {Object} APIObject
 * @property {string} name 関数名
 * @property {string} [type] 引数
 * @property {function} start 呼ばれたときに実行する
 */

/**
 * サーバー用クラス
 */
class WebServer {

	/**
	 * @param {number} port 
	 */
	constructor(port) {
		this.port = port;
		this.http = require("http");
		this.url = require("url");
		this.server = this.http.createServer();

		/**
		 * @type {APIObject[]}
		 */
		this.function_map = [];

		const that = this;

		/**
		 * @param {import("http").IncomingMessage} req 
		 * @param {import("http").ServerResponse} res 
		 */
		const onRequest = function(req, res) {
			const ip = (req.connection.remoteAddress || req.socket.remoteAddress).replace(/.+:/g, "");
			const url_parse = that.url.parse(req.url, true);
			res.writeHead(200, {"Content-Type" : "text/plain"});
			const filename = url_parse.path.split(/[\\/?#]/);
			if(filename.length > 1) {
				res.write(""+ that.analysis(ip, filename[1], url_parse.query));
			}
			res.end();
		};
		this.server.on("request", onRequest);
		this.server.listen(this.port);
	}

	/**
	 * @param {APIObject} function_data 
	 */
	addFunction(function_data) {
		this.function_map.push(function_data);
	}

	/**
	 * @param {string} ip
	 * @param {string} name 
	 * @param {import("querystring").ParsedUrlQuery} query 
	 */
	analysis(ip, name, query) {
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

// Webサーバー作成
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

const power = new PowerSwitch();
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

// 部屋の状態を監視開始
const room_state = new RoomState();
room_state.start();
