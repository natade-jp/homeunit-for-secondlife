#!/bin/sh

# �V�F���X�N���v�g������ꏊ���J�����g�f�B���N�g���ɂ���
cd `dirname $0`

. "../environment.sh"

./powerSwitch.sh ${CLIENT_GPIO_POWER} remove

exit 0
