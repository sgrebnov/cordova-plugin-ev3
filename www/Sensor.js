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

var Promise = require('./Promise'),
    Connection = require('./Connection'),
    ByteCodes = require('./ByteCodes'),
    Command = require('./Command'),
    BitConverter = require('./BitConverter');

var Sensor = function (port, transport) {
    if (typeof port == 'undefined') {
        throw new Error('port is not defined. Use SensorEnum.SENSOR__X ...');
    }

    if (typeof transport == 'undefined') {
        throw new Error('transport is not defined.');
    }

    this.port = port;
    this.transport = transport;
    // default mode is SensorMode.Mode0;
    this.mode = 0;
}

Sensor.prototype.getType = function () {
    var cmd = Command.createDirect(true, 2, 0);
    cmd.writeUint8(ByteCodes.InputDevice);
    cmd.writeUint8(ByteCodes.InputSubCodes.GetTypeMode);
    cmd.writeUint8(0);
    cmd.writeUint8(this.port);
    cmd.writeUint8(0 + 96); // global
    cmd.writeUint8(1 + 96); // global

    return this.transport.sendAsync(cmd).then(function(reply) {
        return reply[3];
    });
}

Sensor.prototype.getMode = function () {
    var cmd = Command.createDirect(true, 2, 0);
    cmd.writeUint8(ByteCodes.InputDevice);
    cmd.writeUint8(ByteCodes.InputSubCodes.GetTypeMode);
    cmd.writeUint8(0);
    cmd.writeUint8(this.port);
    cmd.writeUint8(0 + 96); // global
    cmd.writeUint8(1 + 96); // global

    return this.transport.sendAsync(cmd).then(function (reply) {
        return reply[4];
    });
}

Sensor.prototype.readRaw = function () {
    var cmd = Command.createDirect(true, 4, 0);
    cmd.writeUint8(ByteCodes.InputDevice);
    cmd.writeUint8(ByteCodes.InputSubCodes.GetRaw);
    cmd.writeUint8(0);
    cmd.writeUint8(this.port);
    cmd.writeUint8(0 + 96);

    return this.transport.sendAsync(cmd).then(function (reply) {
        return BitConverter.readInt32(reply, 3);
    });
}

Sensor.prototype.readSi = function () {
    var cmd = Command.createDirect(true, 4, 0);
    cmd.writeUint8(ByteCodes.InputReadSI);
    cmd.writeUint8(0);
    cmd.writeUint8(this.port);
    cmd.writeUint8(131); // ConstantParameterType.Value
    cmd.writeUint16(0);
    cmd.writeUint16(0);
    cmd.writeUint8(this.mode);
    cmd.writeUint8(0+96);

    return this.transport.sendAsync(cmd).then(function (reply) {
        return BitConverter.readFloat32(reply, 3);
    });
}

Sensor.prototype.setMode = function(mode) {
    var me = this;
    var cmd = Command.createDirect(true, 4, 0);
    cmd.writeUint8(ByteCodes.InputReadSI);
    cmd.writeUint8(0);
    cmd.writeUint8(this.port);
    cmd.writeUint8(131); // ConstantParameterType.Value
    cmd.writeUint16(0);
    cmd.writeUint16(0);
    cmd.writeUint8(mode);
    cmd.writeUint8(0 + 96); // global

    return this.transport.sendAsync(cmd).then(function (reply) {
        me.mode = mode;
    });
}

Sensor.prototype.read = Sensor.prototype.readSi;

Sensor.prototype.getMinMax = function () {
    var cmd = Command.createDirect(true, 8, 0);
    cmd.writeUint8(ByteCodes.InputDevice);
    cmd.writeUint8(ByteCodes.InputSubCodes.GetMinMax);
    cmd.writeUint8(0);
    cmd.writeUint8(this.port);
    cmd.writeUint8(0 + 96);
    cmd.writeUint8(4 + 96);
    return this.transport.sendAsync(cmd).then(function (reply) {
        var min = BitConverter.readFloat32(reply, 3);
        var max = BitConverter.readFloat32(reply, 7);
        return { min: min, max: max };
    });
}

// support of single subscriber only
Sensor.prototype.subscribeValueChanged = function (callback, scope, pollInterval) {

    // make sure all other subscribers are cleared
    this.unsubscribeValueChanged();

    pollInterval = pollInterval || 1000; // every 1s

    var currValue = null;
    var sensor = this;

    this.sensorPollingHandler = setInterval(function () {
        sensor.read().then(function (value) {
            // value has been changed
            if (currValue == null || currValue != value) {
                currValue = value;
                if (scope)
                    callback.call(scope, sensor, currValue);
                else
                    callback(currValue);
            }
        });
    }, pollInterval);
}

Sensor.prototype.unsubscribeValueChanged = function () {
    if (this.sensorPollingHandler) {
        clearInterval(this.sensorPollingHandler);
        this.sensorPollingHandler = null;
    }
}

module.exports = Sensor;