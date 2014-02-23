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

module.exports = {};

function roundFloat (val) {
    return Math.round(val * 100) / 100;
}

BitConverter = {};

BitConverter.readFloat32 = function (arr, offset){
    var ab = new ArrayBuffer(4),
            dataView = new DataView(ab);
    for (idx = 0; idx < 4; idx++) {
        dataView.setUint8(idx, arr[idx + offset]);
    };

    var value = dataView.getFloat32(0, true); // littleEndian
    return roundFloat(value);
}

BitConverter.readInt32 = function (arr, offset) {
    var ab = new ArrayBuffer(4),
            dataView = new DataView(ab);
    for (idx = 0; idx < 4; idx++) {
        dataView.setUint8(idx, arr[idx + offset]);
    };

    return dataView.getInt32(0, true); // littleEndian
}

module.exports = BitConverter;