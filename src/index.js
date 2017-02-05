require('angular');
require('angular-animate');
require('angular-aria');
require('angular-material');
const os = require('os');
const fs = require('fs');
const request = require('request');
const Config = require('electron-config');
const config = new Config();


var app = angular.module('App', ['ngMaterial']);

app.controller('FormController', function FormController($scope) {
    $scope.data = {};

    $scope.reset = function () {
        $scope.data.url = null;
        $scope.data.proxyPassword = null;
        $scope.loadConfig();
    }

    $scope.loadConfig = function () {
        $scope.data.proxyHost = config.get('proxy.host');
        $scope.data.proxyPort = config.get('proxy.port');
        $scope.data.proxyUsername = config.get('proxy.username');
    }

    $scope.saveConfig = function () {
        config.set('proxy.host', $scope.data.proxyHost);
        config.set('proxy.port', $scope.data.proxyPort);
        config.set('proxy.username', $scope.data.proxyUsername);
    }

    $scope.validate = function () {
        return true;
    }


    $scope.download = function () {
        if ($scope.validate()) {
            var d = $scope.data;
            var proxy = `http://${d.proxyUsername}:${d.proxyPassword}@${d.proxyHost}:${d.proxyPort}`;
            var filename = d.url.split('/').pop().split('#')[0].split('?')[0];
            var saveAs = `${os.homedir()}/Desktop/${filename}`;
            console.log(`download [${d.url}] as [${saveAs}] via proxy [${proxy}]`);
            var r = request.defaults({
                'proxy': proxy
            });
            r.get(d.url)
                .on('response', function (response) {
                    var status = response.statusCode;
                    var type = response.headers['content-type'];
                    var length = response.headers['content-length'];
                    console.log(`Status [${status}], Content Type [${type}], Content Length [${length}]`);
                })
                .pipe(fs.createWriteStream(saveAs));

            $scope.saveConfig();
        }
    }

    $scope.reset();
});