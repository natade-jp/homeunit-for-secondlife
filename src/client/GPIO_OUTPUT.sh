#!/bin/sh

# ��d�N���h�~
pid=$$
filepath=$0
if test $pid != `pgrep -fo "${filepath}"` ; then
	return 1
fi

# GPIO���g�p�ł���悤�ɂ���
setupGPIO() {
	local gpio_port=${1}
	local gpio_direction=${2}
	local gpio_directory=/sys/class/gpio/gpio${gpio_port}
	
	# �����`�F�b�N
	if test "${gpio_direction}" != "in" -a "${gpio_direction}" != "out"; then
		echo "error"
		return 1
	fi
	
	# �t�@�C�����Ȃ���΍쐬
	if test ! -d "${gpio_directory}"; then
		echo "${gpio_port}" > "/sys/class/gpio/export"
		sleep 0.2
		echo "${gpio_direction}" > "${gpio_directory}/direction"
		sleep 0.2
	fi
	
	return 0
}

# GPIO����������
removeGPIO() {
	local gpio_port=${1}
	local gpio_directory=/sys/class/gpio/gpio${gpio_port}
	
	# �t�@�C��������΍폜�쐬
	if test -d "${gpio_directory}"; then
		echo "${gpio_port}" > "/sys/class/gpio/unexport"
		sleep 0.2
	fi
	
	return 0
}

# GPIO�̏o�͂�ύX����
outputGPIO() {
	local gpio_port=${1}
	local gpio_output=${2}
	local gpio_directory=/sys/class/gpio/gpio${gpio_port}
	
	# �����`�F�b�N
	if test "${gpio_output}" != "high" -a "${gpio_output}" != "low"; then
		echo "error"
		return 1
	fi
	
	# �t�@�C�����Ȃ���΃G���[
	if test ! -d "${gpio_directory}"; then
		echo "error"
		return 1
	fi
	
	if test "${gpio_output}" = "high" ; then
		echo 1 > "${gpio_directory}/value"
	else
		echo 0 > "${gpio_directory}/value"
	fi
	
	return 0
}

# ��������
gpio_port=$1
gpio_output=$2

# �����`�F�b�N
if test "${gpio_output}" != "high" -a "${gpio_output}" != "low" -a "${gpio_output}" != "remove"; then
	echo "error"
	return 1
fi

# ��������
if test "${gpio_output}" = "remove"; then
	removeGPIO ${gpio_port}
	return 0
fi

# GPIO���o�̓|�[�g�ɂ���
setupGPIO ${gpio_port} out
if test $? -ne 0; then
	return 0
fi

# �o�̓|�[�g�̒l��ݒ肷��
outputGPIO ${gpio_port} ${gpio_output}
if test $? -ne 0; then
	return 0
fi

exit 0
