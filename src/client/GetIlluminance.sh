#!/bin/sh

# シェルスクリプトがある場所をカレントディレクトリにする
cd `dirname $0`

. "../environment.sh"

# BH1750 を使って照度を取得する

# pi@raspberrypi:~ $ i2cdetect -y 1
#      0  1  2  3  4  5  6  7  8  9  a  b  c  d  e  f
# 00:          -- -- -- -- -- -- -- -- -- -- -- -- --
# 10: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 20: -- -- -- 23 -- -- -- -- -- -- -- -- -- -- -- --
# 30: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 40: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 50: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 60: -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --
# 70: -- -- -- -- -- -- -- --

# 参考
# https://qiita.com/satorukun/items/a6c67e3e5fd67edf1800


# Power On
i2cset -y 1 0x23 0x01 c

# 1回測定 H-Resolutuion Mode 0010_0000 (120ms)
# 測定終了後パワーダウン状態になる
i2cset -y 1 0x23 0x20 c
sleepenh 0.2 > /dev/null

HEX_2BYTE=`i2cget -y 1 0x23 0x00 w | tr "a-z" "A-Z"`
HEX_1=`echo ${HEX_2BYTE} | cut -c 3-4`
HEX_2=`echo ${HEX_2BYTE} | cut -c 5-6`
DEC=`echo "obase=10;ibase=16;${HEX_2}${HEX_1}" | bc`

IL_F=`echo "scale=1;${DEC}/1.2" | bc`
IL_I=`expr ${DEC} / 1`

echo "${IL_F}"

return "${IL_I}"