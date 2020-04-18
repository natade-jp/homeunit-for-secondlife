/**
 * File.js
 * https://github.com/natade-jp/konpeito
 * Copyright 2013-2019 natade < https://github.com/natade-jp >
 *
 * The MIT license.
 * https://opensource.org/licenses/MIT
 */

//@ts-check

const fs = require("fs");
const child_process = require("child_process");

/**
 * ファイルクラス
 */
class File {

	/**
	 * UTF-8 でテキストを書き込む
	 * @param {string} path 
	 * @param {string} text 
	 */
	static saveTextFile(path, text) {
		fs.writeFileSync(path, text, "utf-8");
	}

	/**
	 * UTF-8 with BOM でテキストを書き込む
	 * @param {string} path 
	 * @param {string} text 
	 */
	static saveTextFileWithBOM(path, text) {
		if (text.length > 0 && text.charAt(0) !== "\uFEFF") {
			fs.writeFileSync(path, "\uFEFF" + text, "utf-8");
		}
		else {
			fs.writeFileSync(path, text, "utf-8");
		}
	}

	/**
	 * BOMあり／なしに関わらず、UTF-8のテキストを読み込む
	 * @param {string} path
	 * @returns {string} テキストデータ 
	 */
	static loadTextFile(path) {
		const text = fs.readFileSync(path, "utf-8");
		if (text.length > 0 && text.charAt(0) === "\uFEFF") {
			return text.substr(1);
		}
		else {
			return text;
		}
	}

	/**
	 * 実行する
	 * @param {string} command 
	 */
	static exec(command) {
		const execSync = child_process.execSync;
		execSync(command);
	}

	/**
	 * ファイルが存在するか調べる
	 * @param {string} path 
	 * @return {boolean}
	 */
	static isExist(path) {
		try {
			fs.statSync(path);
			return true;
		}
		catch (error) {
			if(error.code === "ENOENT") {
				return false;
			} else {
				console.log(error);
			}
		}
		return false;
	}
	
	/**
	 * ディレクトリかどうか判定する
	 * @param {string} path 
	 * @return {boolean}
	 */
	static isFile(path) {
		if(!File.isExist(path)) {
			return false;
		}
		return fs.statSync(path).isFile();
	}

	/**
	 * ディレクトリかどうか判定する
	 * @param {string} path 
	 * @return {boolean}
	 */
	static isDirectory(path) {
		if(!File.isExist(path)) {
			return false;
		}
		return fs.statSync(path).isDirectory();
	}

	/**
	 * ファイルをコピーする
	 * @param {string} from 
	 * @param {string} to 
	 */
	static copy(from, to) {
		const bin = fs.readFileSync(from);
		fs.writeFileSync(to, bin);
	}

	/**
	 * ファイルを削除する
	 * @param {string} path 
	 */
	static deleteFile(path) {
		if(!File.isExist(path)) {
			return;
		}
		fs.unlinkSync(path);
	}

	/**
	 * フォルダを作成する
	 * @param {string} path 
	 */
	static makeDirectory(path) {
		if(File.isExist(path)) {
			return;
		}
		fs.mkdirSync(path);
	}

	/**
	 * ディレクトリ配下のファイルのリストを作成
	 * @param {string} path 
	 * @return {Array<string>}
	 */
	static createList(path) {
		const dir_path = path.replace(/[\\/]+$/, "");
		const load_list = fs.readdirSync(dir_path);
		const list = [];
		for(let i = 0; i < load_list.length; i++) {
			list[i] = dir_path + "/" + load_list[i];
		}
		for(let i = 0; i < list.length; i++) {
			if(File.isDirectory(list[i])) {
				const new_list = fs.readdirSync(list[i]);
				for(let j = 0; j < new_list.length; j++) {
					/**
					 * @type {string}
					 */
					const add_file = list[i] + "/" + new_list[j];
					list.push(add_file);
				}
			}
		}
		return list;
	}

	/**
	 * フォルダを削除する
	 * @param {string} path 
	 */
	static deleteDirectory(path) {
		if(!File.isDirectory(path)) {
			return;
		}
		{
			// まずはファイルのみを全消去
			const list = File.createList(path);
			for(let i = 0; i < list.length; i++) {
				if(File.isFile(list[i])) {
					File.deleteFile(list[i]);
				}
			}
		}
		// フォルダの中身が0のフォルダを繰り返し削除
		for(let i = 0; i < 10; i++) {
			const list = File.createList(path);
			for(let j = 0; j < list.length; j++) {
				if(File.createList(list[j]).length === 0) {
					fs.rmdirSync(list[j]);
				}
			}
		}
		// 最後に目的のフォルダを削除
		fs.rmdirSync(path);
	}

	/**
	 * 指定した条件のファイルのリストを作成
	 * @param {{source : string, destination : string, includes : Array<string>, excludes : Array<string>}} types 
	 * @return {Array<string>}
	 */
	static createTargetList(types) {
		
		const filelist = File.createList(types.source);

		/**
		 * @type {Array<string>}
		 */
		const target_list = [];

		for(const i in filelist) {
			let is_target = false;
			if(types.includes) {
				for(const j in types.includes) {
					if(new RegExp(types.includes[j]).test(filelist[i])) {
						is_target = true;
						break;
					}
				}
			}
			if(!is_target) {
				continue;
			}
			if(types.excludes) {
				for(const j in types.excludes) {
					if(new RegExp(types.excludes[j]).test(filelist[i])) {
						is_target = false;
						break;
					}
				}
			}
			if(!is_target) {
				continue;
			}
			target_list.push(filelist[i]);
		}

		return target_list;
	}

	/**
	 * 環境ファイルの定義値をJSONで取得する
	 * @param {String} path 
	 * @return {Object}
	 */
	static getEnvironmentFile(path) {
		const text = File.loadTextFile(path).split(/\r?\n/g);
		const output = {};
		for(let i = 0; i < text.length; i++) {
			let line = text[i];
			line = line.replace(/#.*/, "").trim();
			if(line.length === 0) {
				continue;
			}
			if(!/=/.test(line)) {
				continue;
			}
			const name = line.replace(/=.*/, "").trim();
			let data = line.replace(/[^=]+=/, "").trim();
			if(/^".*"$/.test(data)) {
				data = data.replace(/^"(.*)"$/, "$1");
			}
			output[name] = data;
		}
		return output;
	}

	/**
	 * CSVファイルを作成
	 * @param {string} text 
	 * @param {string} [separator=","]
	 * @returns {string[][]}
	 */
	static parseCSV(text, separator) {
		if(arguments.length < 2) {
			separator = ",";
		}
		// 改行コードの正規化
		text = text.replace(/\r\n?|\n/g, "\n");
		const CODE_SEPARATOR = separator.charCodeAt(0);
		const CODE_CR    = 0x0D;
		const CODE_LF    = 0x0A;
		const CODE_DOUBLEQUOTES = 0x22;
		const out = [];
		const length = text.length;
		let element = "";
		let count_rows    = 0;
		let count_columns = 0;
		let isnextelement = false;
		let isnextline    = false;
		for(let i = 0; i < length; i++) {
			let code = text.charCodeAt(i);
			// 複数行なら一気に全て読み込んでしまう(1文字目がダブルクォーテーションかどうか)
			if((code === CODE_DOUBLEQUOTES)&&(element.length === 0)) {
				i++;
				for(;i < length;i++) {
					code = text.charCodeAt(i);
					if(code === CODE_DOUBLEQUOTES) {
						// フィールドの終了か？
						// 文字としてのダブルクォーテーションなのか
						if((i + 1) !== (length - 1)) {
							if(text.charCodeAt(i + 1) === CODE_DOUBLEQUOTES) {
								i++;
								element += "\""; 
							}
							else {
								break;
							}
						}
						else {
							break;
						}
					}
					else {
						element += text.charAt(i);
					}
				}
			}
			// 複数行以外なら1文字ずつ解析
			else {
				switch(code) {
					case(CODE_SEPARATOR):
						isnextelement = true;
						break;
					case(CODE_CR):
					case(CODE_LF):
						isnextline = true;
						break;
					default:
						break;
				}
				if(isnextelement) {
					isnextelement = false;
					if(out[count_rows] === undefined) {
						out[count_rows] = [];
					}
					out[count_rows][count_columns] = element;
					element = "";
					count_columns += 1;
				}
				else if(isnextline) {
					isnextline = false;
					//文字があったり、改行がある場合は処理
					//例えば CR+LF や 最後のフィールド で改行しているだけなどは無視できる
					if((element !== "")||(count_columns !== 0)) {
						if(out[count_rows] === undefined) {
							out[count_rows] = [];
						}
						out[count_rows][count_columns] = element;
						element = "";
						count_rows    += 1;
						count_columns  = 0;
					}
				}
				else {
					element += text.charAt(i);
				}
			}
			// 最終行に改行がない場合
			if(i === length - 1) {
				if(count_columns !== 0) {
					out[count_rows][count_columns] = element;
				}
			}
		}
		return out;
	}
	
	/**
	 * CSVファイルを作成
	 * @param {string} text 
	 * @param {string} [separator=","] 
	 * @param {string} [newline="\r\n"] 
	 * @returns {string}
	 */
	static makeCSV(text, separator, newline) {
		if(arguments.length < 2) {
			separator = ",";
		}
		if(arguments.length < 3) {
			newline = "\r\n";
		}
		let out = "";
		const escape = /["\r\n,\t]/;
		if(text !== undefined) {
			for(let i = 0;i < text.length;i++) {
				if(text[i] !== undefined) {
					for(let j = 0;j < text[i].length;j++) {
						let element = text[i][j];
						if(escape.test(element)) {
							element = element.replace(/"/g, "\"\"");
							element = "\"" + element + "\"";
						}
						out += element;
						if(j !== text[i].length - 1) {
							out += separator;
						}
					}
				}
				out += newline;
			}
		}
		return out;
	}

}

module.exports = File;
