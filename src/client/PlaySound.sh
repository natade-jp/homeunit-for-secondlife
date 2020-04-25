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

# 音を再生する
amixer cset numid=3 1

FILENAME=`basename "${CLIENT_PLAYSOUND_FILE}"`

if [ ! -e "./${FILENAME}" ]; then
	wget "${CLIENT_PLAYSOUND_FILE}"
fi

sox "./${FILENAME}" -d > /dev/null

exit 0
