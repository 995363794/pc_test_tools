var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://47.101.199.165'); //连接到服务端
var testDeviceName = "706_a7600"


client.on('connect', function () {
    console.log(`connext is ok`)
    client.subscribe(`pc_test_tools/network_stability_test/downLink/${testDeviceName}`);
    // client.subscribe(`pc_test_tools/network_stability_test/upLink/${testDeviceName}`);
});

client.on('message', function (topic, message) {
    var data = JSON.parse(message)
    console.log(new Date().toLocaleString(), ":", topic, ":", data);
    if (data.downLinkCount != undefined) {
        client.publish(`pc_test_tools/network_stability_test/upLink/${testDeviceName}`, JSON.stringify({ ack: 1, upCount: data.downLinkCount }))
    }
    // if (topic.indexOf("properties/8") != -1) {
    //     console.log(JSON.parse(message))
    // }
});
