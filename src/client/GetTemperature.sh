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

# ADT7410 を使って温度を取得する

# pi@raspberrypi:~ $ i2cdetect -y 1
#      0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
# 00:          -- -- -- -- -- -- -- -- -- -- -- -- --
# 10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 20: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 40: -- -- -- -- -- -- -- -- 48 -- -- -- -- -- -- --
# 50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 70: -- -- -- -- -- -- -- --

# 参考
# https://qiita.com/0118takuUW/items/22cdf368256f2732782c

HEX_2BYTE=`i2cget -y 1 0x48 0x00 w | tr "a-z" "A-Z"`
LOW_BYTE=`echo ${HEX_2BYTE} | cut -c 3-4`
HIGH_BYTE=`echo ${HEX_2BYTE} | cut -c 5-6`
DEC=`echo "obase=10;ibase=16;${HIGH_BYTE}${LOW_BYTE}" | bc`
TEMP_F=`echo "scale=1;${DEC}/128.0" | bc`
TEMP_I=`echo ${TEMP_F} | sed -r "s/\.[0-9]+//"`
if [ -z "${TEMP_I}" ]; then
	TEMP_F="0${TEMP_F}"
	TEMP_I="0"
fi

echo "${TEMP_F}"

exit 0
