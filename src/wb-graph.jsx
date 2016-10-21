import React from 'react';
import GraphFactory from "./graph.jsx";
import AjaxContainer from "./ajax.jsx";
var _ = require('lodash');

var WbGraphContainer = React.createClass({
    getInitialState: function(){
        return {
            data: [],
            start: "1960",
            end: "2015"
        }
    },
    getUrl: function(countryCode, indicator){
        // Build DHS API url
        var baseUrl = "http://api.worldbank.org/v2/en/countries/";
        var tmp = [countryCode, "indicators", indicator].join("/");
        var query = "?date="+this.state.start+":"+this.state.end+"&format=json&per_page=1000";
        return baseUrl+tmp+query;
    },
    handleUpdate: function(data){
        this.setState({
            data: this.cleanData(data[1])
        });
    },
    cleanData:function(data){
        if (typeof data === "undefined" || data === null){
            return [];
        }else{
            var tmp = [];
            for (var i = 0; i<data.length; i++){
                // Original data can be null or 0, skip both
                // in the final data set
                if (data[i].value !== null){
                    data[i].value = parseFloat(data[i].value);
                    if (data[i].value > 0){
                        tmp.push({
                            name: data[i].date,
                            value: data[i].value,
                            category: data[i].country
                        });
                    }
                }
            }
            return  _.sortBy(tmp, 'date');
        }
    },
    render: function(){
        // If country code changed, update data
        var changed = false;
        var currentValue = this.props.countryCode && this.props.countryCode.valueOf();
        if (currentValue != null && this.preValue !== currentValue){
            this.preValue = currentValue;
            var api = this.getUrl(this.props.countryCode, this.props.indicator);
            return (
                <AjaxContainer
                    handleUpdate={this.handleUpdate}
                    apiUrl={api} />
            );
        }

        // Render graphs
        var footer = "Source: The World Bank";
        return (
            <GraphFactory
                data={this.state.data}
                footer={footer}
                {...this.props}
            />
        );
    }
});

module.exports = WbGraphContainer;
