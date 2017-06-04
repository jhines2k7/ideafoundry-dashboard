export default function reduce(events) {
    "use strict";

    return events.reduce( (state, event) => {
        if(event.topic === 'ideafoundry.update.events') {
            state.events = event.data.events;
        }

        if(event.topic === 'ideafoundry.update.eventSourceState') {
            state.eventSourceState = event.data.eventSourceState
        }
        
        return state;
    }, {        
        events: [],
        eventSourceState: 'CONNECTING'
    });
}
