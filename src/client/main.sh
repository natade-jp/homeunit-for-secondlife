#!/bin/sh

# カレントディレクトリを設定
cd `dirname $0`

# サーバーを起動させる
node "./RoomServer.js" &

exit 0
