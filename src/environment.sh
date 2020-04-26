#!/bin/sh

# ネットワークの設定

SERVER_ADDRESS="192.168.11.200"
SERVER_PORT="5050"
CLIENT_ADDRESS="192.168.11.201"
CLIENT_PORT="62620"

## サーバーの定数

# 部屋の光の状態
SERVER_FILE_ROOM_LIGHT="DATA_ROOM_LIGHT.txt"

# 部屋のモーション情報
SERVER_FILE_ROOM_MOTION="DATA_ROOM_MOTION.txt"

# 部屋の温度
SERVER_FILE_ROOM_TEMPERATURE="DATA_ROOM_TEMPERATURE.txt"

# セカンドライフ上のオブジェクトのURL
SERVER_FILE_SECONDLIFE_OBJECT_URL="DATA_SECONDLIFE_OBJECT_URL.txt"

## クライアントの定数

# 音を鳴らす場合
# 無料効果音で遊ぼう！
# https://taira-komori.jpn.org/index.html
CLIENT_PLAYSOUND_FILE="https://taira-komori.jpn.org/sound/game01/crrect_answer3.mp3"

# GPIO
CLIENT_GPIO_POWER="17"
CLIENT_GPIO_IR="13"
CLIENT_GPIO_MOTION="19"

# 監視タイミング
CLIENT_INTERVAL_TIMER_SEC="5"

# モーション用監視タイミング
CLIENT_MOTION_INTERVAL_TIMER_SEC="3"

# 一致回数


return 0
