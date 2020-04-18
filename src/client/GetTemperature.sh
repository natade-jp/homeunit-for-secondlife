#!/bin/sh

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

HEX_2BYTE=`i2cget -y 1 0x48 0x00 w | tr "a-z" "A-Z"`
HEX_1=`echo ${HEX_2BYTE} | cut -c 3-4`
HEX_2=`echo ${HEX_2BYTE} | cut -c 5-6`
DEC_1=`echo "obase=10;ibase=16;${HEX_2}${HEX_1}" | bc`
DEC_2=`expr ${DEC_1} / 8`
TEMPF=`echo "scale=1;${DEC_2}/16.0" | bc`
TEMPD=`expr ${DEC_2} / 16`

echo "${TEMPF}"

# 参考
# https://qiita.com/0118takuUW/items/22cdf368256f2732782c

return "${TEMPD}"
