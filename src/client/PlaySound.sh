#!/bin/sh

# �V�F���X�N���v�g������ꏊ���J�����g�f�B���N�g���ɂ���
cd `dirname $0`

. "../environment.sh"

# �����Đ�����
amixer cset numid=3 1

FILENAME=`basename "${CLIENT_PLAYSOUND_FILE}"`

if [ ! -e "./${FILENAME}" ]; then
	wget "${CLIENT_PLAYSOUND_FILE}"
fi

mpg321 "./${FILENAME}"

exit 0
