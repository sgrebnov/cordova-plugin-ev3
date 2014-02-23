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
    Motor = require('./Motor'),
    Mailbox = require('./Mailbox');
    Sensor = require('./Sensor');

var MotorEnum = {};

MotorEnum.MOTOR_A = 0;
MotorEnum.MOTOR_B = 1;
MotorEnum.MOTOR_C = 2;
MotorEnum.MOTOR_D = 3;

var SensorEnum = {};

SensorEnum.SENSOR_1 = 0;
SensorEnum.SENSOR_2 = 1;
SensorEnum.SENSOR_3 = 2;
SensorEnum.SENSOR_4 = 3;

var SensorType = {}

SensorType.Unknown = 0;
SensorType.Color = 29;
SensorType.UltraSonic = 30;
SensorType.Gyro = 32;
SensorType.IR = 33;
SensorType.None = 126;

var SensorMode = {}
SensorMode.Mode0 = 0;
SensorMode.Mode1 = 1;
SensorMode.Mode2 = 2;
SensorMode.Mode3 = 3;
SensorMode.Mode4 = 4;
SensorMode.Mode5 = 5;
SensorMode.Mode6 = 6;

var EV3 = function (brickName) {
    this.brickName = brickName || 'ev3'; // uses 'ev3' by default
    this.connection = new Connection();

    // motors
    this.motorA = new Motor(MotorEnum.MOTOR_A, this.connection);
    this.motorB = new Motor(MotorEnum.MOTOR_B, this.connection);
    this.motorC = new Motor(MotorEnum.MOTOR_C, this.connection);
    this.motorD = new Motor(MotorEnum.MOTOR_D, this.connection);

    // sensors
    this.sensor1 = new Sensor(SensorEnum.SENSOR_1, this.connection);
    this.sensor2 = new Sensor(SensorEnum.SENSOR_2, this.connection);
    this.sensor3 = new Sensor(SensorEnum.SENSOR_3, this.connection);
    this.sensor4 = new Sensor(SensorEnum.SENSOR_4, this.connection);

    // misc
    this.messaging = new Mailbox(this.connection);
};

EV3.prototype.connect = function () {
    return this.connection.connectAsync(this.brickName);
};

// exports
EV3.SensorType = SensorType;
EV3.SensorMode = SensorMode;

module.exports = EV3;