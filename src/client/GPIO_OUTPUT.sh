#!/bin/sh

# 二重起動防止
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

# GPIOを使用できるようにする
setupGPIO() {
	local gpio_port=${1}
	local gpio_direction=${2}
	local gpio_directory=/sys/class/gpio/gpio${gpio_port}
	
	# 引数チェック
	if test "${gpio_direction}" != "in" -a "${gpio_direction}" != "out"; then
		echo "error"
		return 1
	fi
	
	# ファイルがなければ作成
	if test ! -d "${gpio_directory}"; then
		echo "${gpio_port}" > "/sys/class/gpio/export"
		sleep 0.2
		echo "${gpio_direction}" > "${gpio_directory}/direction"
		sleep 0.2
	fi
	
	return 0
}

# GPIOを除去する
removeGPIO() {
	local gpio_port=${1}
	local gpio_directory=/sys/class/gpio/gpio${gpio_port}
	
	# ファイルがあれば削除作成
	if test -d "${gpio_directory}"; then
		echo "${gpio_port}" > "/sys/class/gpio/unexport"
		sleep 0.2
	fi
	
	return 0
}

# GPIOの出力を変更する
outputGPIO() {
	local gpio_port=${1}
	local gpio_output=${2}
	local gpio_directory=/sys/class/gpio/gpio${gpio_port}
	
	# 引数チェック
	if test "${gpio_output}" != "high" -a "${gpio_output}" != "low"; then
		echo "error"
		return 1
	fi
	
	# ファイルがなければエラー
	if test ! -d "${gpio_directory}"; then
		echo "error"
		return 1
	fi
	
	if test "${gpio_output}" = "high" ; then
		echo 1 > "${gpio_directory}/value"
	else
		echo 0 > "${gpio_directory}/value"
	fi
	
	return 0
}

# 引数を代入
gpio_port=$1
gpio_output=$2

# 引数チェック
if test "${gpio_output}" != "high" -a "${gpio_output}" != "low" -a "${gpio_output}" != "remove"; then
	echo "error"
	return 1
fi

# 除去する
if test "${gpio_output}" = "remove"; then
	removeGPIO ${gpio_port}
	return 0
fi

# GPIOを出力ポートにする
setupGPIO ${gpio_port} out
if test $? -ne 0; then
	return 0
fi

# 出力ポートの値を設定する
outputGPIO ${gpio_port} ${gpio_output}
if test $? -ne 0; then
	return 0
fi

exit 0
