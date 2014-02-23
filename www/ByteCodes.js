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

// Much thanks to MonoBrick library, http://www.monobrick.dk
module.exports = {
    OutputStop : 0xA3,
    OutputPower : 0xA4,
    OutputSpeed : 0xA5,
    OutputStart: 0xA6,

    OutputRead: 0xA8,

    InputSample: 0x97,
    InputDeviceList : 0x98,
    InputDevice : 0x99,
    InputRead : 0x9a,
    InputTest : 0x9b,
    InputReady : 0x9c,
    InputReadSI : 0x9d,
    InputReadExt : 0x9e,
    InputWrite : 0x9f,

    WriteMailbox: 158,

    InputSubCodes: {
        GetFormat : 2,
        CalMinMax : 3,
        CalDefault : 4,
        GetTypeMode : 5,
        GetSymbol : 6,
        CalMin : 7,
        CalMax : 8,
        Setup : 9,
        ClearAll : 10,
        GetRaw : 11,
        GetConnection : 12,
        StopAll : 13,
        GetName : 21,
        GetModeName : 22,
        SetRaw : 23,
        GetFigures : 24,
        GetChanges : 25,
        ClrChanges : 26,
        ReadyPCT : 27,
        ReadyRaw : 28,
        ReadySI : 29,
        GetMinMax : 30,
        GetBumps : 31
    }
};
