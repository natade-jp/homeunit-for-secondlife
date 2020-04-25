#!/bin/sh

# GPIOを使用できるようにする
setupGPIO() {
	local gpio_port="${1}"
	local gpio_direction="${2}"
	local gpio_directory="/sys/class/gpio/gpio${gpio_port}"
	
	# 引数チェック
	if [ "${gpio_direction}" != "input" ] && [ "${gpio_direction}" != "output" ]; then
		echo "error"
		return 1
	fi

	# gpio設定用の値に変更
	if [ "${gpio_direction}" = "input" ]; then
		gpio_direction="in"
	else
		gpio_direction="out"
	fi
	
	# ファイルがなければ作成
	if [ ! -d "${gpio_directory}" ]; then
		echo "${gpio_port}" > "/sys/class/gpio/export"
		sleep 0.2

		echo "${gpio_direction}" > "${gpio_directory}/direction"
		sleep 0.2
	fi
	
	return 0
}

# GPIOを除去する
removeGPIO() {
	local gpio_port="${1}"
	local gpio_directory="/sys/class/gpio/gpio${gpio_port}"
	
	# ファイルがあれば削除作成
	if [ -d "${gpio_directory}" ]; then
		echo "${gpio_port}" > "/sys/class/gpio/unexport"
		sleep 0.2
	fi
	
	return 0
}

# GPIOの出力を変更する
outputGPIO() {
	local gpio_port="${1}"
	local gpio_output="${2}"
	local gpio_directory="/sys/class/gpio/gpio${gpio_port}"
	
	# 引数チェック
	if [ "${gpio_output}" != "high" ] && [ "${gpio_output}" != "low" ]; then
		echo "error"
		return 1
	fi
	
	# ファイルがなければエラー
	if [ ! -d "${gpio_directory}" ]; then
		echo "error"
		return 1
	fi
	
	if [ "${gpio_output}" = "high" ]; then
		echo 1 > "${gpio_directory}/value"
	else
		echo 0 > "${gpio_directory}/value"
	fi
	
	return 0
}

# GPIOの入力を表示する
inputGPIO() {
	local gpio_port="${1}"
	local gpio_directory=/sys/class/gpio/gpio${gpio_port}
	
	# ファイルがなければエラー
	if [ ! -d "${gpio_directory}" ]; then
		echo "error"
		return 1
	fi
	
	cat "${gpio_directory}/value"
	
	return 0
}

# 引数を代入
gpio_port=`echo "$1" | tr "A-Z" "a-z"`
gpio_type=`echo "$2" | tr "A-Z" "a-z"`
gpio_output=`echo "$3" | tr "A-Z" "a-z"`


# 除去する
if [ "${gpio_type}" = "remove" ]; then
	removeGPIO ${gpio_port}
	exit 0

# 出力ポートの設定
elif [ "${gpio_type}" = "output" ]; then

	# 引数チェック
	if [ "${gpio_output}" != "high" ] && [ "${gpio_output}" != "low" ]; then
		echo "error"
		exit 1
	fi

	# GPIOを出力ポートにする
	setupGPIO ${gpio_port} output
	if [ "${?}" != "0" ]; then
		echo "error"
		exit 1
	fi

	# 出力ポートの値を設定する
	outputGPIO ${gpio_port} ${gpio_output}
	if [ "${?}" != "0" ]; then
		echo "error"
		exit 1
	fi
	
# 入力ポートの設定
elif [ "${gpio_type}" = "input" ]; then

	# GPIOを入力ポートにする
	setupGPIO ${gpio_port} input
	if [ "${?}" != "0" ]; then
		echo "error"
		exit 1
	fi

	# 入力ポートの値を出力する
	inputGPIO ${gpio_port}
	if [ "${?}" != "0" ]; then
		echo "error"
		exit 1
	fi

else

	# 引数チェック
	echo "error"
	exit 1

fi

exit 0
