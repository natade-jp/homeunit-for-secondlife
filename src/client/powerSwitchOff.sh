#!/bin/sh

# �V�F���X�N���v�g������ꏊ���J�����g�f�B���N�g���ɂ���
cd `dirname $0`

. "../environment.sh"

./GPIO_OUTPUT.sh ${CLIENT_GPIO_POWER} low

exit 0
