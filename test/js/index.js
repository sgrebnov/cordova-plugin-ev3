/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    onSuccess: function () {
        console.log('success');
    },

    onError: function (err) {
        navigator.notification.alert("Error: " + err);
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        app.robot = new Lego.EV3();
        
        app.robot.connect().then(function () {
            navigator.notification.alert("Successfully connected!");
        }, app.onError);
        
        document.getElementById('btnForward').addEventListener('click', function () {
            app.robot.motorA.setSpeed(-20).then(app.onSuccess, app.onError);
        });
        document.getElementById('btnBackward').addEventListener('click', function () {
            app.robot.motorA.setSpeed(20).then(app.onSuccess, app.onError);
        });
        document.getElementById('btnStop').addEventListener('click', function () {
            app.robot.motorA.stop().then(app.onSuccess, app.onError);
        });
        document.getElementById('btnLeft').addEventListener('click', function () {
            app.robot.messaging.send('m1', 'left').then(app.onSuccess, app.onError);
        });
        document.getElementById('btnRight').addEventListener('click', function () {
            app.robot.messaging.send('m1', 'right').then(app.onSuccess, app.onError);
        });
        document.getElementById('btnStraight').addEventListener('click', function () {
            app.robot.messaging.send('m1', 'straight').then(app.onSuccess, app.onError);
        });
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};