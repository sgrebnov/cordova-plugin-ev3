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

var ByteCodes = require('./ByteCodes'),
    Command = require('./Command');

var Mailbox = function(transport) {

    if (typeof transport == 'undefined') {
        throw new Error('transport is not defined.');
    }

    this.transport = transport;
};

Mailbox.prototype.send = function(mailboxName, msg) {
    var command = Command.createSystem(ByteCodes.WriteMailbox),
        data = [];
    
    command.writeUint8(mailboxName.length + 1); // null terminated string
    command.writeString(mailboxName);

    command.writeUint16(msg.length + 1); // null terminated string
    command.writeString(msg);
    
    return this.transport.sendAsync(command);
}

module.exports = Mailbox;