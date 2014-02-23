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

var MotorEnum = {
    MOTOR_A : 0,
    MOTOR_B : 1,
    MOTOR_C : 2,
    MOTOR_D : 3
};

var SensorEnum = {
    SENSOR_1: 0,
    SENSOR_2: 1,
    SENSOR_3: 2,
    SENSOR_4: 3
};

// Much thanks to MonoBrick library, http://www.monobrick.dk
var SensorType = {
    Unknown : 0,
    Touch : 16,
    Color : 29,
    UltraSonic : 30,
    Gyro : 32,
    IR : 33,
    None : 126,
}

var SensorMode = {
    Mode0: 0,
    Mode1: 1,
    Mode2: 2,
    Mode3: 3,
    Mode4: 4,
    Mode5: 5,
    Mode6: 6,
}
// Touch sensor modes
SensorMode.Touch = {
    Boolean: SensorMode.Mode0,
    Count: SensorMode.Mode1
};
// Color sensor modes
SensorMode.Color = {
    Reflection : SensorMode.Mode0, 
    Ambient  : SensorMode.Mode1,
    Color  : SensorMode.Mode2,
    Raw  : SensorMode.Mode3
}

// Ultrasonic sensor modes
SensorMode.Ultrasonic = {
    Centimeter : SensorMode.Mode0,
    Inch : SensorMode.Mode1,
    Listen : SensorMode.Mode2
}
// Gyro sensor modes
SensorMode.Gyro = {
    Angle : SensorMode.Mode0,
    AngularVelocity : SensorMode.Mode1
}
// IR sensor modes
SensorMode.IR = {
    Proximity: SensorMode.Mode0,
    Seek: SensorMode.Mode1,
    Remote: SensorMode.Mode1,
}

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