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
sleep 0.2

HEX_2BYTE=`i2cget -y 1 0x23 0x00 w | tr "a-z" "A-Z"`
LOW_BYTE=`echo ${HEX_2BYTE} | cut -c 3-4`
HIGH_BYTE=`echo ${HEX_2BYTE} | cut -c 5-6`
DEC=`echo "obase=10;ibase=16;${HIGH_BYTE}${LOW_BYTE}" | bc`
IL_F=`echo "scale=1;${DEC}/1.2" | bc`
IL_I=`echo ${IL_F} | sed -r "s/\.[0-9]+//"`
if [ -z "${IL_I}" ]; then
	IL_F="0${IL_F}"
	IL_I="0"
fi

echo "${IL_F}"

exit 0
