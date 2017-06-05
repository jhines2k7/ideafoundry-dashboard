<home>
    <h1>Idea Foundry - Columbus Dashboard</h1>
    <h3>{ viewModel.eventSourceState }</h3>

    <ul>
        <li each={ viewModel.orders }>
            <div>
                <h2>Name: { attributes.customer_name }</h2>
                <h2>Description: { attributes.description }</h2>
                <h2>Order Date: { attributes.created_at }</h2>
                <h2>Verification Code: { attributes.verification_code }</h2>
            </div>        
        </li>
    </ul>

    <style>
        li {
            margin-bottom: 10px;
        }
    </style>

    <script>
        import postal from 'postal/lib/postal.lodash'

        this.viewModel = {
            orders: [],
            eventSourceState: 'CONNECTING'
        };

        subscribe(channel, topic) {
            let subscription = postal.subscribe({
                channel: channel,
                topic: topic,
                callback: function(data, envelope) {
                    this.viewModel.orders = data.orders;
                    this.viewModel.eventSourceState = data.eventSourceState;

                    this.update(this.viewModel);

                }.bind(this)
            });

            return subscription;
        };

        this.subscribe('async', 'ideafoundry.update.orders');
        this.subscribe('async', 'ideafoundry.update.eventSourceState');
    </script>
</home>