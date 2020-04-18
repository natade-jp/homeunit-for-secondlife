#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

. "../environment.sh"

# 音を再生する
amixer cset numid=3 1

FILENAME=`basename "${CLIENT_PLAYSOUND_FILE}"`

if [ ! -e "./${FILENAME}" ]; then
	wget "${CLIENT_PLAYSOUND_FILE}"
fi

mpg321 "./${FILENAME}"

exit 0
