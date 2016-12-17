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
            data: _.concat(this.state.data, this.cleanData(data[1]))
        });
    },
    cleanData:function(data){
        // WB data cleanse function.
        // Here we are to normalize API data into a data format
        // that is uniform for consumption internally.
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
                       // Internal data format is a dict.
                       tmp.push({
                           year: data[i].date,
                           value: data[i].value,
                           category: data[i].country.value,
                           text: data[i].country.value+"-"+data[i].date // Label for each data point
                       });
                    }
                }
            }

            // Sort data by "date" field
            return  _.sortBy(tmp, 'year');
        }
    },
    render: function(){
        // If country code changed, update data
        var changed = false;
        var currentValue = this.props.countryCode && this.props.countryCode.valueOf();
        if (currentValue != null && this.preValue !== currentValue){
            this.preValue = currentValue;

            // Iterate through requested countries
            var indicator = this.props.indicator;
            const ajaxReqs = this.props.countryCode.map((c) => {
              var api = this.getUrl(c, indicator);
              return (
                <AjaxContainer
                    key={c}
                    handleUpdate={this.handleUpdate}
                    apiUrl={api} />
              );
            });

            return (
              <div>
                {ajaxReqs}
              </div>
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
