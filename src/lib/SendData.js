const { exec } = require("child_process");

/**
 * 外部へデータを送信する
 */
class SendData {

	/**
	 * @param {string} url 
	 */
	constructor(url) {
		this.utl = url.replace(/\/$/g, "") + "/";
	}

	/**
	 * データを送信する
	 * @param {string} text
	 */
	send(text) {
		exec("curl \"" + this.utl + text + "\"");
	}

}

module.exports = SendData;
