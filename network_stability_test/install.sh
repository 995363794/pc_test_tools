#!/bin/bash
PROJECT_PATH="/opt/test/pc_test_tools"


# Create project directory
echo "Create project directory: ${PROJECT_PATH}"
if [ !  -d ${PROJECT_PATH} ]; then
    echo "Create success!"
    mkdir -p ${PROJECT_PATH}
else
    echo "Directory is existed!"
fi

# Install npm modules
sudo cp -R ${PWD}/* ${PROJECT_PATH}
pushd ${PROJECT_PATH}
sudo npm install
popd

# Copy terminal to /usr/bin
sudo cp ${PWD}/agent-temi /usr/bin

#Move systemd files to /etc/systemd/system
sudo rm -rf ${PROJECT_PATH}/service/*
sudo cp -rf ${PWD}/service/shaoXing* ${PROJECT_PATH}/service

# sudo cp -rf ${PROJECT_PATH}/service/* /etc/systemd/system

# #Enable systemd services
# echo 'Enable service'
# pushd ${PROJECT_PATH}/service
# find . -type f -name  "*.service"| awk -F '/' '{print $2}'|xargs -n 1 sudo systemctl enable
# popd
