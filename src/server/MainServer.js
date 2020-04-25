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

const exec = require("child_process").exec;
const http = require("http");
const url = require("url");
const server = http.createServer();

/**
 * @param {string} ip
 * @param {string} name 
 * @param {import("querystring").ParsedUrlQuery} query 
 */
const analysis = function(ip, name, query) {
	if(name === "favicon.ico") {
		return 0;
	}
	if(name === "SecondLife") {
		if(query["type"] === "playSound") {
			exec("curl " + client_address + "playSound");
		}
		else if(query["type"] === "powerOn") {
			exec("curl " + client_address + "power?type=on");
		}
		else if(query["type"] === "powerOff") {
			exec("curl " + client_address + "power?type=off");
		}
	}
	if(/^192\.168\./.test(ip)) {
		if((name === "RoomState") && query["value"] !== undefined) {
			if(query["type"] === "light") {
				exec("echo " + query["value"] + " > " + file_room_light);
			}
			else if(query["type"] === "motion") {
				exec("echo " + query["value"] + " > " + file_room_motion);
			}
			else if(query["type"] === "temperature") {
				exec("echo " + query["value"] + " > " + file_room_temperature);
			}
		}
	}
	return 0;
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
