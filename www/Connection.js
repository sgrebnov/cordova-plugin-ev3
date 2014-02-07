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

var Connection = function () { };

Connection.prototype.connectAsync = function (brickName) {
    var deferral = new Promise.Deferral();
    var onSuccess = function (res) {
        deferral.resolve(res);
    };
    var onError = function (err) {
        deferral.reject(err);
    };

    setTimeout(function () {
        try {
            bluetoothSerial.connect(brickName, onSuccess, onError);
        } catch (ex) {
            onError(ex);
        }

    }, 0);

    return deferral.promise;
};

Connection.prototype.sendAsync = function(command) {
    var deferral = new Promise.Deferral(),
        bytes = command.buf;
    
    var onError = function(err) {
        deferral.reject(err);
    };

    var onSuccess = function(res) {
        deferral.resolve(res);
    };
    // execute async
    setTimeout( function() {
        try {
            var header = [];
                header[0] = bytes.length % 256;
                header[1] = 0;// TODO: payload.length / 256

            bluetoothSerial.write(header.concat(bytes), onSuccess, onError);
        } catch (ex) {
            onError (ex);
        }
    }, 0);

    return deferral.promise;
}
module.exports = Connection;
