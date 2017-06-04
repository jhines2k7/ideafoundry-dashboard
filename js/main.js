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

Storage.get().then( (events) => {
    let eventSource = new EventSource("http://54.198.63.196:8080/events/subscribe");

    eventSource.onmessage = function (e) {
        let appState = reduce(EventStore.events);

        appState.events.push(e.data);
        
        EventStore.add(EventStore.events, [{
            channel: 'async',
            topic: 'ideafoundry.update.events',
            data: appState
        }]);
    };

    eventSource.onopen = function (e) {
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
        } else if (e.currentTarget.readyState == EventSource.CLOSING) {
            appState.eventSourceState = 'CLOSING';
        } else if (e.currentTarget.readyState == EventSource.CLOSED) {
            appState.eventSourceState = 'CLOSED';
        }

        //eventSource.close();

        EventStore.add(EventStore.events, [{
            channel: 'async',
            topic: 'ideafoundry.update.eventSourceState',
            data: appState
        }]);
    };

    EventStore.events = events;

    router.init();
});
