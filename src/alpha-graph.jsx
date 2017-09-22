import React from 'react';
import GraphFactory from "./graph.jsx";
import AjaxContainer from "./ajax.jsx";

var _ = require('lodash');

var AlphaGraph = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      key: '4W4899YHR2QYOFQ2' // fxia1@lenovo.com
    }
  },
  getUrl: function(symbol, configs) {
    // Build API url
    var baseUrl = "https://www.alphavantage.co/query?";
    var query = [];

    // NOTE: key, val order is reversed!!
    // see https://lodash.com/docs/4.17.4#forEach
    _.each(configs, function(val, key){
      query.push(key+'='+val);
    })
    return baseUrl + query.join('&');
  },
  handleUpdate: function(data) {
    var cleaned = this._cleanData(data);
    this.setState({
      data: cleaned
    });
  },
  _cleanData: function(data) {
    if (typeof data === "undefined" || data === null) {
      return [];
    } else {
      // This is completely depending on the returned
      // data format. For AlphaVantage data, it's a dict
      // with a variable key which depends on the function in use!
      var tmp = [];
      _.each(data[this.props.datakey], function(val,key){
        var d_in_milseconds = new Date(key);
        var v = 0.0;
        switch (this.props.series){
          case 'open':
            if (val.hasOwnProperty('1. open')){
              v = val['1. open'];
            }
            break;
          case 'high':
            if (val.hasOwnProperty('2. high')){
              v = val['2. high'];
            }
            break;
          case 'low':
            if (val.hasOwnProperty('3. low')){
              v = val['3. low'];
            }
            break;
          case 'close':
            if (val.hasOwnProperty('4. close')){
              v = val['4. close'];
            }
            break;
          default:
            if (val.hasOwnProperty(this.props.series)){
              v = val[this.props.series];
            }
            break
        }

        tmp.push([d_in_milseconds.getTime(), parseFloat(v)]);
      });
      return _.reverse(tmp);
    }
  },
  render: function() {
    // If symbol changed, update data
    var changed = false;
    var currentValue = this.props.symbol;
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;
      var api = this.getUrl(currentValue, {
        symbol: currentValue,
        'function': this.props.function,
        outputsize: this.props.outputsize,
        apikey: this.state.key,
      });

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
            categories={this.props.function}
            data={this.state.data}
            footer={footer}
            title={this.props.function}
            {...this.props}/>
      </div>
    );
  }
});

module.exports = AlphaGraph;
