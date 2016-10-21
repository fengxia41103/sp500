import React from 'react';
import AjaxContainer from "./ajax.jsx";

var WbIndicators = React.createClass({
    getInitialState: function(){
        this.api = "http://api.worldbank.org/v2/indicators?format=json&per_page=17000";
        return null;
    },
    render: function(){
        var indicators = this.props.indicators;

        // Update data
        if (typeof indicators=="undefined" || (indicators && indicators.length < 1)){
            return (
                <AjaxContainer
                    apiUrl={this.api}
                    handleUpdate={this.props.handleUpdate} />
            );
        }

        // Render
        return null;
    }
});

module.exports = WbIndicators;
