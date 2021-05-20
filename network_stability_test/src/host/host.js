var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://47.101.199.165'); //连接到服务端

var successPackCount = 0;
var allPackCount = 0;
var oneSuccessPackCount = 0;
var oneAllPackCount = 0;

var testDeviceName = "706_a7600"
const { crc16modbus } = require('crc');
const config = require('config');
const port = config.get('netwoek_stability_test-modbusSetting').port;
const option = config.get('netwoek_stability_test-modbusSetting').option;
const SerialPort = require('serialport');
const device = new SerialPort(port, option);


var downLinkFlag = 1;

var runFlag = 1;
var lodUpLinkData;

client.on('connect', function () {
    console.log(`connext is ok`)
    client.subscribe(`pc_test_tools/network_stability_test/upLink/${testDeviceName}`);
    // client.subscribe(`pc_test_tools/network_stability_test/downLink/${testDeviceName}`);
});

client.on('message', function (topic, message) {
    // console.log(new Date().toLocaleString(), ":", topic);
    // try {
    //     console.log(JSON.parse(message))
    // } catch (error) {
    //     console.log(error)
    // }
    if (topic.indexOf(`upLink/${testDeviceName}`) != -1) {
        try {
            var data = JSON.parse(message);
            lodUpLinkData = data;
            // console.log(data)
            // console.log(allPackCount)
            if (data.ack == 1 && data.upCount == allPackCount) {
                successPackCount += 1;
                oneSuccessPackCount += 1;
            }
        } catch (error) {
            console.log(error)
        }
    }
});

function STB1_on() {
    let crc = Buffer.alloc(2);
    payload = Buffer.from([0x01, 0x05, 0x00, 0x01, 0xff, 0x00]);
    crc.writeUInt16LE(crc16modbus(payload), 0);
    device.write(Buffer.concat([payload, crc]));
}

function STB1_off() {
    let crc = Buffer.alloc(2);
    payload = Buffer.from([0x01, 0x05, 0x00, 0x01, 0x00, 0x00]);
    crc.writeUInt16LE(crc16modbus(payload), 0);
    device.write(Buffer.concat([payload, crc]));
}

setInterval(() => {
    if (downLinkFlag == 1) {
        allPackCount += 1;
        oneAllPackCount += 1;
        client.publish("pc_test_tools/network_stability_test/downLink/706_a7600", JSON.stringify({ downLinkCount: allPackCount }))
    }
}, 1000);

setInterval(() => {
    console.log(`lodUpLinkData.upCount :${lodUpLinkData.upCount}`)
    if (lodUpLinkData.upCount == allPackCount) {
        runFlag = 1;
    } else if ((oneAllPackCount - oneSuccessPackCount) >= 100) {
        runFlag = 0;
    }
    console.log(`${new Date().toLocaleString()} all pack:${allPackCount} ,success pack:${successPackCount} ,percentage of success: ${successPackCount * 100 / allPackCount}% ,${oneAllPackCount},${oneSuccessPackCount}`)
}, 10000);

setInterval(() => {
    if (runFlag == 1) {
        STB1_off();
        oneSuccessPackCount = 0;
        oneAllPackCount = 0;

        downLinkFlag = 0;
        console.log(`${new Date().toLocaleString()} off `)
        setTimeout(() => {
            STB1_on();
            console.log(`${new Date().toLocaleString()} on `)
            setTimeout(() => {
                downLinkFlag = 1;
            }, 1000 * 60 * 3);//3分钟 开机延迟
        }, 1000 * 60 * 2);//2分钟 放电延迟
    }
}, 1000 * 60 * 10);//10分钟 断电循环周期
