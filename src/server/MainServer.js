const File = require("../lib/File.js");
const env = File.getEnvironmentFile("../environment.sh");
const client_address = "http://" + env["CLIENT_ADDRESS"] + ":" + env["CLIENT_PORT"] + "/";
const server_port = parseFloat(env["SERVER_PORT"]);

const exec = require("child_process").exec;
const http = require("http");
const url = require("url");
const server = http.createServer();

const analysis = function(name, query) {
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
	return 0;
};

const onRequest = function(req, res) {
	const url_parse = url.parse(req.url, true);
	res.writeHead(200, {"Content-Type" : "text/plain"});
	const filename = url_parse.path.split(/[\\/?#]/);
	if(filename.length > 1) {
		res.write(""+ analysis(filename[1], url_parse.query));
	}
	res.end();
};

server.on("request", onRequest);
server.listen(server_port);
