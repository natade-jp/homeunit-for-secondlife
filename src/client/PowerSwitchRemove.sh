#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

. "../environment.sh"

./powerSwitch.sh ${CLIENT_GPIO_POWER} remove

return 0
