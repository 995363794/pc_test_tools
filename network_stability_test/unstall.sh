#!/bin/bash
PROJECT_PATH="/opt/test/pc_test_tools/network_stability_test"

#Enable systemd services
echo 'Disable service'
pushd ${PROJECT_PATH}/service
find . -type f -name  "*.service"| awk -F '/' '{print $2}'|xargs -n 1 sudo systemctl disable 
popd

#Create project directory
echo "remove ${PROJECT_PATH}"
sudo rm -rf ${PROJECT_PATH}
