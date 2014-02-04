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

var commandSequenceNumber = 0;

var Command = function (systemCommand) {
    this.buf = [];
    this.writeUint16(++commandSequenceNumber); // command id

    if (typeof systemCommand != 'undefined') {
        this.writeUint8(129);
        this.writeUint8(systemCommand);
    }
    else { // direct command
        this.writeUint8(128);
        this.writeUint16(0); // global memory
    }
}

Command.prototype.writeUint8 = function(val) {
    val = val & 0xFF;
    this.buf.push(val);
}

Command.prototype.writeUint16 = function(val) {
    this.writeUint8(val & 0xFF);
    this.writeUint8((val >> 8) & 0xFF);
}

Command.prototype.writeSByteLong = function(val) {
    this.writeUint8(129);
    this.writeUint8((256+val) & 0xFF);
}

Command.prototype.writeString = function (str) {
    for (var i = 0; i < str.length; i++) {
        this.buf.push(str.charCodeAt(i));
    }
    this.buf.push(0); // must be null terminated string
}

module.exports = Command;