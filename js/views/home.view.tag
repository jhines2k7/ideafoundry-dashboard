<home>
    <h1>Idea Foundry - Columbus Dashboard</h1>
    <h3>{ viewModel.eventSourceState }</h3>

    <ul>
        <li each={ e, i in viewModel.events }>
            <div>{ e }</div>
        </li>
    </ul>

    <script>
        import postal from 'postal/lib/postal.lodash'

        this.viewModel = {
            events: [],
            eventSourceState: 'CONNECTING'
        };

        subscribe(channel, topic) {
            let subscription = postal.subscribe({
                channel: channel,
                topic: topic,
                callback: function(data, envelope) {
                    this.viewModel.events = data.events;
                    this.viewModel.eventSourceState = data.eventSourceState;

                    this.update(this.viewModel);

                }.bind(this)
            });

            return subscription;
        };

        this.subscribe('async', 'ideafoundry.update.events');
        this.subscribe('async', 'ideafoundry.update.eventSourceState');
    </script>
</home>