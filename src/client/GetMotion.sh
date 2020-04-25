#!/bin/sh

# 二重起動防止
pid=$$
filepath="${0}"
if [ $pid != `pgrep -fo "/bin/sh ${filepath}"` ]; then
	exit 1
fi

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

. "../environment.sh"

./GPIO.sh ${CLIENT_GPIO_MOTION} input

if [ $? != 0 ] ; then
	exit 1
fi

exit 0
