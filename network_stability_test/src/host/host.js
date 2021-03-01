var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://47.101.199.165'); //连接到服务端


var successPackCount = 0;
var allPackCount = 0;

var testDeviceName = "706_a7600"

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
            // console.log(data)
            // console.log(allPackCount)
            if (data.ack == 1 && data.upCount == allPackCount) {
                successPackCount += 1;
            }
        } catch (error) {
            console.log(error)
        }
    }
});

setInterval(() => {
    allPackCount += 1;
    client.publish("pc_test_tools/network_stability_test/downLink/706_a7600", JSON.stringify({ downLinkCount: allPackCount }))
}, 1000);

setInterval(() => {
    console.log(`${new Date().toLocaleString()} all pack num:${allPackCount} ,success pack num:${successPackCount} ,percentage of success: ${successPackCount *100/ allPackCount}% `)
}, 10000);
