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

# 引数を代入
type=`echo "$1" | tr "A-Z" "a-z"`

if [ "${type}" = "on" ] ; then
	./GPIO.sh ${CLIENT_GPIO_POWER} output high
elif [ "${type}" = "off" ] ; then
	./GPIO.sh ${CLIENT_GPIO_POWER} output low
elif [ "${type}" = "remove" ] ; then
    ./GPIO.sh ${CLIENT_GPIO_POWER} remove
fi

return 0
