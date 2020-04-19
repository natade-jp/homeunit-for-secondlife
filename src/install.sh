#!/bin/sh

# I2C有効化
# sudo raspi-config
# 「8 Advanced Options」を選択
# 「A7 I2C」を選択
# 「Yes」を選択

# CUI化
# sudo raspi-config
# 「3 Boot Options」を選択
# 「B1 Desktop / CLI」を選択
# 「B2 Console Autologin Text console, automatically logged in as 'pi' user」を選択
# あとは、Finishで、RebootするとCUIで起動します。

# HDMIを指してもイヤホンジャックから音を強制的に出す
# sudo raspi-config
# 「7 Advanced Options」を選択
# 「A4 Audio」を選択
# 「1 Force 3.5mm ('headphone') jack」を選択
# あとは、Finishで、RebootするとCUIで起動します。

# apt-get を更新
sudo apt-get -y update

# raspberry pi のフォルダ名を英語に変更
sudo apt-get install -y xdg-user-dirs-gtk
LANG=C xdg-user-dirs-update --force

# sleep用
sudo apt-get install -y sleepenh

# SH加工用
sudo apt-get install -y bc
sudo apt-get install -y tr
sudo apt-get install -y cut

# node.js
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs

# i2c
sudo apt-get install -y i2c-tools

# soxの利用
sudo apt-get install -y alsa-utils sox libsox-fmt-all

# wget, curl
sudo apt-get install -y wget
sudo apt-get install -y curl

