const File = require("../lib/File.js");
const env = File.getEnvironmentFile("../environment.sh");

// @ts-ignore
const client_address = "http://" + env["CLIENT_ADDRESS"] + ":" + env["CLIENT_PORT"] + "/";
// @ts-ignore
const server_port = parseFloat(env["SERVER_PORT"]);

// jsファイルが置いてある場所
const curdir = __dirname;
// @ts-ignore
const file_room_light = curdir + "/" + env["SERVER_FILE_ROOM_LIGHT"];
// @ts-ignore
const file_room_motion = curdir + "/" + env["SERVER_FILE_ROOM_MOTION"];
// @ts-ignore
const file_room_temperature = curdir + "/" + env["SERVER_FILE_ROOM_TEMPERATURE"];
// @ts-ignore
const file_secondlife_object_url = curdir + "/" + env["SERVER_FILE_SECONDLIFE_OBJECT_URL"];

const SendData = require("../lib/SendData.js");
const to_client = new SendData(client_address);

const exec = require("child_process").exec;
const http = require("http");
const url = require("url");
const server = http.createServer();

/**
 * @param {string} ip
 * @param {string} name 
 * @param {import("querystring").ParsedUrlQuery} query
 * @returns {string}
 */
const analysis = function(ip, name, query) {
	if(name === "favicon.ico") {
		return "0";
	}
	if(name === "SecondLife") {
		// SecondLife?type=playSound
		if(query["type"] === "playSound") {
			to_client.send("playSound");
		}
		// SecondLife?type=powerOn
		else if(query["type"] === "powerOn") {
			to_client.send("power?type=on");
		}
		// SecondLife?type=powerOff
		else if(query["type"] === "powerOff") {
			to_client.send("power?type=off");
		}
		// SecondLife?type=lightOnOff
		else if(query["type"] === "lightOnOff") {
			to_client.send("light?type=onoff");
		}
		else if(query["type"] === "get") {
			// SecondLife?type=get&data=light
			if(query["data"] === "light") {
				const text = File.loadTextFile(file_room_light);
				if(text) {
					return text.replace(/[\r\n ]/g, "");
				}
			}
			// SecondLife?type=get&data=motion
			else if(query["data"] === "motion") {
				const text = File.loadTextFile(file_room_motion);
				if(text) {
					return text.replace(/[\r\n ]/g, "");
				}
			}
			// SecondLife?type=get&data=temperature
			else if(query["data"] === "temperature") {
				const text = File.loadTextFile(file_room_temperature);
				if(text) {
					return text.replace(/[\r\n ]/g, "");
				}
			}
		}
		else if(query["type"] === "set") {
			// SLからURLを受け取る
			// SecondLife?type=set&url=http://xxx
			if((query["url"] !== undefined) && (typeof query["url"] === "string")) {
				const url = decodeURIComponent(query["url"]);
				File.saveTextFile(file_secondlife_object_url, url);
			}
		}
	}
	// ローカルネットワーク
	if(/^192\.168\./.test(ip)) {
		if((name === "RoomState") && query["value"] !== undefined) {
			/**
			 * @type {string}
			 */
			// @ts-ignore
			const value = query["value"];
			// RoomState?type=light&value=x
			if(query["type"] === "light") {
				File.saveTextFile(file_room_light, value);
				// もしSLのオブジェクトのURLがある場合は、SLへ明るさを渡す
				if(File.isFile(file_secondlife_object_url)) {
					const secondlife_object_url = File.loadTextFile(file_secondlife_object_url);
					const to_slobj = new SendData(secondlife_object_url);
					to_slobj.send("?" + value);
				}
			}
			// RoomState?type=motion&value=x
			else if(query["type"] === "motion") {
				File.saveTextFile(file_room_motion, value);
			}
			// RoomState?type=temperature&value=x
			else if(query["type"] === "temperature") {
				File.saveTextFile(file_room_temperature, value);
			}
		}
	}
	return "0";
};

/**
 * @param {import("http").IncomingMessage} req 
 * @param {import("http").ServerResponse} res 
 */
const onRequest = function(req, res) {
	const ip = (req.connection.remoteAddress || req.socket.remoteAddress).replace(/.+:/g, "");
	const url_parse = url.parse(req.url, true);
	res.writeHead(200, {"Content-Type" : "text/plain"});
	const filename = url_parse.path.split(/[\\/?#]/);
	if(filename.length > 1) {
		res.write(""+ analysis(ip, filename[1], url_parse.query));
	}
	res.end();
};

server.on("request", onRequest);
server.listen(server_port);
