#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

. "../environment.sh"

switchIR() {
    ./GPIO.sh ${CLIENT_GPIO_IR} output high
    sleep 0.5
    ./GPIO.sh ${CLIENT_GPIO_IR} output low
	return 0
}

switchIR

return 0
