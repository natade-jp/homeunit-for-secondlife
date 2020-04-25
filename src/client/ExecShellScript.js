
const { exec, execSync } = require("child_process");

// jsファイルが置いてある場所
const curdir = __dirname;

/**
 * 指定したシェルスクリプトを実行する
 */
class ExecShellScript {

	/**
	 * @param {string} script_name シェルスクリプト
	 * @param {function(number|undefined): void} [callback] 実行後に呼ばれる関数
	 */
	constructor(script_name, callback) {
		this.script_path = curdir + "/" + script_name;

		/**
		 * @param {import("child_process").ExecException | null} error 
		 * @param {string} stdout 
		 * @param {string} stderr 
		 */
		this.exec_callback = function(error, stdout, stderr) {
			if(callback !== undefined) {
				if (error !== null) {
					callback(undefined);
				}
				else {
					callback(parseFloat(stdout.replace(/^[\r\n ]*|[\r\n ]*$/g, "")));
				}
			}
		}
	}

	/**
	 * 実行する
	 * @param {string} [parm] 引数
	 */
	exec(parm) {
		if(parm === undefined) {
			exec(this.script_path, this.exec_callback);
		}
		else {
			exec(this.script_path + " " + parm, this.exec_callback);
		}
	}
}

module.exports = ExecShellScript;
