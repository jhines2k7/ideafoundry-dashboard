import localforage from 'localforage/dist/localforage'

export default class Storage {
    static set(events) {
        localforage.setItem('ideafoundry', events).catch(function(err) {
            console.log(err);
        });
    }

    static get() {
        return localforage.getItem('ideafoundry').then( (events) => {
            if(events === null) {
                events = [];
            }

            console.log('Returned from storage', events);
            return events;
        }).catch(function(err) {
            console.log(err);
        });
    }
}