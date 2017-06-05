export default function reduce(events) {
    "use strict";

    return events.reduce( (state, event) => {
        if(event.topic === 'ideafoundry.update.orders') {
            state.orders = event.data.orders;
        }

        if(event.topic === 'ideafoundry.update.eventSourceState') {
            state.eventSourceState = event.data.eventSourceState
        }
        
        return state;
    }, {        
        orders: [],
        eventSourceState: 'CONNECTING'
    });
}
