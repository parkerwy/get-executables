require('jquery');
const os = require('os');
const fs = require('fs');
const request = require('request');
const Config = require('electron-config');
const config = new Config();



function loadConfig() {
    $('#proxyHost').val(config.get('proxy.host'));
    $('#proxyPort').val(config.get('proxy.port'));
    $('#proxyUser').val(config.get('proxy.username'));
    console.log('loaded default config.');
}


function download() {
    console.log('download called.');
    var url = $('#url').val();
    console.log(url);
    var host = $('#proxyHost').val();
    var port = $('#proxyPort').val();
    var user = $('#proxyUser').val();
    var password = $('#proxyPassword').val();
    if (host && port && user && password) {
        var proxy = `http://${user}:${password}@${host}:${port}`;
    } else {
        var proxy = "";
    }
    console.log(proxy);
    requestWithProxy(url, proxy);

    config.set('proxy.host', host);
    config.set('proxy.port', port);
    config.set('proxy.username', user);
}

function requestWithProxy(url, proxy) {
    var filename = url.split('/').pop().split('#')[0].split('?')[0];
    var saveAs = `${os.homedir()}/Desktop/${filename}`;
    console.log(`download [${url}] as [${saveAs}] via proxy [${proxy}]`);
    var r = request.defaults({
        //'proxy': proxy
    });
    r.get(url)
        .on('response', function(response) {
            var status = response.statusCode;
            var type = response.headers['content-type'];
            var length = response.headers['content-length'];
            console.log(`Status [${status}], Content Type [${type}], Content Length [${length}]`);
        })
        .pipe(fs.createWriteStream(saveAs));
    console.log("download completed.");
}
