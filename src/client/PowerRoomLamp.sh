#!/bin/sh

# 二重起動防止
pid=$$
filepath="${0}"
if [ $pid != `pgrep -fo "${filepath}"` ]; then
	return 1
fi

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

. "../environment.sh"

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

if [ "${type}" = "on" ] && [ `isLight` = "0" ] ; then
	switchIR
	sleep 0.5
elif [ "${type}" = "off" ] && [ `isLight` = "1" ] ; then
	switchIR
	switchIR
	switchIR
fi

return 0
