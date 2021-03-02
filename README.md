# pc_test_tools

## 1. network stability test tools 

网络稳定性测试工具

### 使用方法:
```
host部署在本地服务器上面

slave部署在被测试PC上面
```
### 测试原理:
```
host部署在本地服务器上面，通过MQTT发送指定消息到slave端。slave端收到数据后恢复host端。host端进行发包收包计数，并进行统计和打印。
```
### 部署方法:
```
被测机:
    sudo ./install.sh
    systemctl start network_stability_test-slave.service
    systemctl enable network_stability_test-slave.service
公网服务器 or 测试机:
    sudo ./install.sh
    systemctl start network_stability_test-host.service
    systemctl enable network_stability_test-host.service
```

### 查看日志
```
sudo journalctl -u *.service
```
