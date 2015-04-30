/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
/* JBoss, Home of Professional Open Source
 * Copyright Red Hat, Inc., and individual contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var app = {
   // Application Constructor
   initialize: function () {
      this.bindEvents();
   },
   // Bind Event Listeners
   //
   // Bind any events that are required on startup. Common events are:
   // 'load', 'deviceready', 'offline', and 'online'.
   bindEvents: function () {
      document.addEventListener('deviceready', this.register, false);
   },
   // deviceready Event Handler
   //
   // The scope of 'this' is the event. In order to call the 'receivedEvent'
   // function, we must explicity call 'app.receivedEvent(...);'
   register: function () {
      if (typeof push !== 'undefined') {
        push.register(app.onNotification, successHandler, errorHandler);
      } else {
        app.clearMessages();
        app.addMessage('Push plugin not installed!');
      }

      function successHandler(deviceToken) {
        app.deviceToken = deviceToken;
        console.log("DEVICE TOKEN : " + app.deviceToken);
         app.clearMessages();
         if (document.getElementById("messages").childElementCount === 0) {
           document.getElementById("nothing").style.display = 'block';
         }
      }

      function errorHandler(error) {
         app.clearMessages();
         app.addMessage('error registering ' + error);
      }
   },
   onNotification: function (event) {
    console.log("in onNotification");
    console.log("PUSH IDENTIFIER " +  event.payload['aerogear-push-id']);
      document.getElementById('nothing').style.display = 'none';
      app.addMessage(event.alert || event.version);

      //let's do some analytics 
      var client = AeroGear.UnifiedPushClient(
        "a37a20aa-a0f9-4fa0-bcc1-1f04ce2dbaaa",
        "8aa27c7b-3990-4cdf-bb6e-af1548c1a1ec",
            event.payload['aerogear-push-id'],
            "http://192.168.1.19:8080/ag-push"
        );

        // assemble the metadata for the registration:
        var metadata = {
            deviceToken: app.deviceToken
        };

        var settings = {};

        settings.metadata = metadata;

        // perform the registration against the UnifiedPush server:
        client.registerWithPushServer( settings ).then(function() {
                        console.log("Registered with UnifiedPush server!");
                    })
                    .then(null, function(error) {
                        console.log("Error when registering with UnifiedPush server! " + error);
                        for (var property in error) {
    if (error.hasOwnProperty(property)) {
        console.log(property);
    }
    console.log(error.statusText);
    console.log(error.agXHR);
    console.log(error.data);
  }

                    });

   },
   addMessage: function (message) {
      var messages = document.getElementById("messages"),
         element = document.createElement("li");
      //for ui testing add an id for easy (fast) selecting
      element.setAttribute("id", "message" + (messages.childElementCount + 1));
      messages.appendChild(element);
      element.innerHTML = message;
   },
   clearMessages: function() {
     var waiting = document.getElementById("waiting");
     waiting.style.display = 'none';
   }
};
