/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

var Promise = require('./Promise');

var Connection = function() {
    
    this.ev3Channel = null;
    this.ev3Service = null;
    this.dataWriter = null;
}

Connection.prototype.connectAsync = function(brickName) {
    var deferral = new Promise.Deferral();
    var onSuccess = function(res) {
        deferral.resolve(res);
    };
    var onError = function(err) {
        deferral.resolve(err);
    }

    var me = this;

    // execute async
    setTimeout(function() {
            var rfcomm = Windows.Devices.Bluetooth.Rfcomm;
            var sockets = Windows.Networking.Sockets;
            var streams = Windows.Storage.Streams;
            var query = rfcomm.RfcommDeviceService.getDeviceSelector(rfcomm.RfcommServiceId.serialPort);

            Windows.Devices.Enumeration.DeviceInformation.findAllAsync(query)
                .then(function (pairedDevices) {

                    return new WinJS.Promise(function (complete, error, progress) {
                        for (var idx = 0; idx < pairedDevices.length; idx++) {
                            if (pairedDevices[idx].name.toLowerCase() == brickName) {
                                rfcomm.RfcommDeviceService.fromIdAsync(pairedDevices[idx].id).then(function (device) {
                                    if (device != null) {
                                        complete(device);
                                    }
                                });
                            }
                        };
                    });

                }).then(function(ev3) {
                    me.ev3Service = ev3;
                    me.ev3Channel = new sockets.StreamSocket();
                    return me.ev3Channel.connectAsync(me.ev3Service.connectionHostName, me.ev3Service.connectionServiceName, sockets.SocketProtectionLevel.plainSocket);
            }).done(
                function() { // success
                    me.dataWriter = new streams.DataWriter(me.ev3Channel.outputStream);
                    onSuccess();
                }, onError);
    },0);

    return deferral.promise;
}

Connection.prototype.sendAsync = function(command) {
    var deferral = new Promise.Deferral(),
        bytes = command.buf;
    
    var onError = function(err) {
        deferral.reject(err);
    };

    var onSuccess = function(res) {
        deferral.resolve(res);
    };

    if (this.dataWriter == null) {
        onError(new Error('Not connected'));
        return deferral.promise;
    }

    var dataWriter = this.dataWriter;
    // execute async
    setTimeout( function() {
        try {
            var header = [];
                header[0] = bytes.length % 256;
                header[1] = 0;// TODO: payload.length / 256
                dataWriter.writeBytes(header);
                dataWriter.writeBytes(bytes);
                dataWriter.storeAsync().done(onSuccess, onError);

        } catch (ex) {
            onError (ex);
        }
    }, 0);

    return deferral.promise;
}
module.exports = Connection;