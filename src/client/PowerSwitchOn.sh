#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

. "../environment.sh"

./GPIO_OUTPUT.sh ${CLIENT_GPIO_POWER} high

return 0
