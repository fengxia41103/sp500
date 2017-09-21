import React from 'react';
import GraphFactory from "./graph.jsx";
import AjaxContainer from "./ajax.jsx";

var _ = require('lodash');

var AlphaGraph = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      key: '4W4899YHR2QYOFQ2'
    }
  },
  getUrl: function(symbol, configs) {
    // Build API url
    var baseUrl = "https://www.alphavantage.co/query?";
    var query = [];
    _.each(configs, function(key,val){
      query.push(key+'='+val);
    })
    return baseUrl + query.join('&');
  },
  handleUpdate: function(data) {
    var cleaned = _.concat(this.state.data, this._cleanData(data));
    var unified = this._unifiedData(cleaned);
    console.log(cleaned);
    this.setState({
      data: cleaned,
    });
  },
  _cleanData: function(data) {
    // WB data cleanse function.
    // Here we are to normalize API data into a data format
    // that is uniform for consumption internally.
    if (typeof data === "undefined" || data === null) {
      return [];
    } else {
      return data;
    }
  },
  render: function() {
    // If symbol changed, update data
    var changed = false;
    var currentValue = this.props.symbol && this.props.symbol.valueOf();
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;
      var api = this.getUrl(currentValue, {
        symbol: currentValue,
        'function': 'TIME_SERIES_DAILY_ADJUSTED',
        outputsize: 'compact',
        apikey: this.state.key,
        datakey: 'Time Series (Daily)'
      })
      return (
        <AjaxContainer
            key={currentValue}
            handleUpdate={this.handleUpdate}
            apiUrl={api}/>
      );
    }

    // Render graphs
    var footer = "Source: AlphaVantage";
    return (
      <div>
        {/* Graph */}
        <GraphFactory
            data={this.state.data}
            footer={footer}
            {...this.props}/>
      </div>
    );
  }
});

module.exports = AlphaGraph;
