#!/bin/sh

# 二重起動防止
pid=$$
filepath="${0}"
if [ $pid != `pgrep -fo "/bin/sh ${filepath}"` ]; then
	return 1
fi

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

. "../environment.sh"

# HITACH IRT01KB2 を試用した赤外線操作可能な蛍光灯ランプを操作する

switchIR() {
	./GPIO.sh ${CLIENT_GPIO_IR} output high
	sleep 0.5
	./GPIO.sh ${CLIENT_GPIO_IR} output low
	sleep 0.5
	return 0
}

isLight() {
	IL=`./GetIlluminance.sh`
	if [ `echo "$IL < 1.0" | bc` -eq 1 ] ; then
		echo "0"
	else
		echo "1"
	fi
	return 0
}

# 引数を代入
type=`echo "$1" | tr "A-Z" "a-z"`

# 電気が消えている場合にONにしたいときは、1回赤外線操作する
if [ "${type}" = "on" ] && [ `isLight` = "0" ] ; then
	switchIR
	sleep 0.5
# 電気が付いているときにOFFにしたいときは、3回赤外線操作する
elif [ "${type}" = "off" ] && [ `isLight` = "1" ] ; then
	switchIR
	switchIR
	switchIR
elif [ "${type}" = "ison" ] ; then
	isLight
fi

return 0
