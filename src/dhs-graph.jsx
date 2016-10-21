import React from 'react';
import GraphFactory from "./graph.jsx";
import AjaxContainer from "./ajax.jsx";
var _ = require('lodash');

var DhsGraphContainer = React.createClass({
    getInitialState: function(){
        return {
            data: []
        }
    },
    getUrl: function(countryCode, indicators){
        // Build DHS API url
        var baseUrl = "http://api.dhsprogram.com/rest/dhs/v4/data?";
        var queries = {
            "countryIds": countryCode,
            "indicatorIds": indicators.join(","),
            "perpage": 1000, // max for non-registered user

            // return fields must match what is being used in D3 graph
            "returnFields": ["Indicator","Value","SurveyYear"].join(",")
        };
        var tmp = [];
        for (var key in queries){
            var val = queries[key];
            if (val && (val.length > 0)){
                tmp.push(key + "=" + val);
            }
        }
        return baseUrl+tmp.join("&");
    },
    cleanData:function(data){
        if (typeof data === "undefined" || data === null){
            return [];
        }else {
            var tmp = [];

            // Data needs to be massaged
            for (var i = 0; i<data.length; i++){
                tmp.push({
                    name: ""+data[i].SurveyYear,
                    value: data[i].Value,
                    category: data[i].Indicator
                });
            }
            return tmp;
        }

    },
    handleUpdate: function(data){
        this.setState({
            data: this.cleanData(data.Data)
        });
    },
    render: function(){
        // If country code changed, update data
        var changed = false;
        var currentValue = this.props.countryCode && this.props.countryCode.valueOf();
        if (currentValue != null && this.preValue !== currentValue){
            this.preValue = currentValue;
            var api = this.getUrl(this.props.countryCode, this.props.indicators);
            return (
                <AjaxContainer
                    handleUpdate={this.handleUpdate}
                    apiUrl={api} />
            );
        }

        // Render graphs
        var footer = "Source: USAID DHS Program";
        return (
            <GraphFactory
                data={this.state.data}
                footer={footer}
                {...this.props}
            />
        );
    }
});

module.exports = DhsGraphContainer;
