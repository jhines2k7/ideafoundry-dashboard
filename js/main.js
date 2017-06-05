import './views/home.view'

import Storage from './storage'
import {Router} from 'director/build/director'
import riot from 'riot'
import reduce from './reducer'
import EventStore from './eventStore'
import config from './config'

let home = function() {
    "use strict";    

    document.body.appendChild(document.createElement('home'));
    riot.mount('home');
};

let router = Router({
    '/': home
});

let connectionAttempts = 0;

Storage.get().then( (events) => {
    EventStore.events = events;    

    let eventSource = new EventSource("http://localhost:8080/events/subscribe");

    eventSource.addEventListener('ideafoundry-sse', function(e) {
      let appState = reduce(EventStore.events);

        appState.orders.push(e.data);
        
        EventStore.add(EventStore.events, [{
            channel: 'async',
            topic: 'ideafoundry.update.orders',
            data: appState
        }]);
    }, false);

    eventSource.onopen = function (e) {
        connectionAttempts = 0;

        let appState = reduce(EventStore.events);

        appState.eventSourceState = 'OPEN';
        
        EventStore.add(EventStore.events, [{
            channel: 'async',
            topic: 'ideafoundry.update.eventSourceState',
            data: appState
        }]);
    };

    eventSource.onerror = function (e) {
        let appState = reduce(EventStore.events);

        if (e.currentTarget.readyState == EventSource.CONNECTING) {
            appState.eventSourceState = 'CONNECTING';
            
            if(connectionAttempts++ >= 3) {
                appState.eventSourceState = 'CONNECTION REFUSED. ATTEMPTING TO RECONNECT';
            }

            if(connectionAttempts++ === 5) {
                appState.eventSourceState = 'UNABLE TO CONNECT. CLOSING CONNECTION';
                
                eventSource.close();   
            }
        } else if (e.currentTarget.readyState == EventSource.CLOSED) {
            appState.eventSourceState = 'CLOSED';
        }    

        EventStore.add(EventStore.events, [{
            channel: 'async',
            topic: 'ideafoundry.update.eventSourceState',
            data: appState
        }]);
    };

    router.init();
});
