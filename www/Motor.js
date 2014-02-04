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
    ByteCodes = require('./ByteCodes'),
    Command = require('./Command');

var outputBitfields = [0x01, 0x02, 0x04, 0x08];

var Motor = function(port, transport) {
    if (typeof port == 'undefined') {
        throw new Error('motorIdx is not defined. Use MotorEnum.MOTOR_X ...');
    }

    if (typeof transport == 'undefined') {
        throw new Error('transport is not defined.');
    }

    this.port = port;
    this.transport = transport;
}

Motor.prototype.setSpeed = function(value) {
    var command = new Command(),
        portBitField = outputBitfields[this.port];

    command.writeUint8(ByteCodes.OutputSpeed);
    command.writeUint8(0); 
    command.writeUint8(portBitField);
    command.writeSByteLong(value);
    command.writeUint8(ByteCodes.OutputStart);
    command.writeUint8(0);
    command.writeUint8(portBitField);
    
    return this.transport.sendAsync(command);
}

Motor.prototype.setPower = function(value) {
    var command = new Command(),
        portBitField = outputBitfields[this.port];

    command.writeUint8(ByteCodes.OutputPower);
    command.writeUint8(0); 
    command.writeUint8(portBitField);
    command.writeSByteLong(value);

    command.writeUint8(ByteCodes.OutputStart);
    command.writeUint8(0);
    command.writeUint8(portBitField);

    return this.transport.sendAsync(command);
}

Motor.prototype.stop = function (breakAfterStop) {
    if (typeof breakAfterStop == 'undefined') {
        breakAfterStop = 0;
    }

    var command = new Command(),
        portBitField = outputBitfields[this.port];

    command.writeUint8(ByteCodes.OutputStop);
    command.writeUint8(0);
    command.writeUint8(portBitField);
    command.writeUint8(breakAfterStop);

    return this.transport.sendAsync(command);
}

module.exports = Motor;