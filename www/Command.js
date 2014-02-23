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

var Command = function (isReplyRequired, commandType) {
    this.buf = [];
    this.isReplyRequired = isReplyRequired || false;
    this.id = ++commandSequenceNumber;
    
    this.writeUint16(this.id);
    this.writeUint8(commandType);
}


Command.createDirect = function (isReplyRequired, globalSize, localSize) {
    var cmd = new Command(isReplyRequired, isReplyRequired ? 0 : 128);

    globalSize = globalSize || 0;
    localSize = localSize || 0;

    cmd.writeUint8(globalSize & 0xFF);
    cmd.writeUint8((localSize << 2) | (globalSize >> 8));

    return cmd;
}

Command.createSystem = function (systemCommand) {
    var cmd = new Command(false, 129);
    cmd.writeUint8(systemCommand);
    return cmd;
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
