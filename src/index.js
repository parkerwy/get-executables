require('jquery');
const os = require('os');

function download() {
    console.log('download called.');
    var url = $('#url').val();
    console.log(url);
    var host = $('#proxyHost').val();
    var port = $('#proxyPort').val();
    var user = $('#proxyUser').val();
    var password = $('#proxyPassword').val();
    var proxy = `http://${user}:${password}@${host}:${port}`;
    console.log(proxy);
    requestWithProxy(url, proxy);
}

function requestWithProxy(url, proxy) {
    var filename = url.split('/').pop().split('#')[0].split('?')[0];
    var saveAs = `${os.homedir()}/Desktop/${filename}`;
    console.log(saveAs);
}
