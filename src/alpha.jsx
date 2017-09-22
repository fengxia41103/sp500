import React from 'react';
import GraphFactory from "./graph.jsx";
import AjaxContainer from "./ajax.jsx";
import FormBox from "./forms.jsx";

import $ from 'jquery' //this one is not needed if your eslint is disabled

var createReactClass = require('create-react-class');

var _ = require('lodash');
var classNames = require('classnames');

var AlphaBox = createReactClass({
   getInitialState: function() {
     var tmp = {
       "example msrp": {
         label: "Example MSRP",
         value: 18881,
         step: 1000
       }
     }
     return tmp;
   },
   handleFieldChange: function(fieldId, value) {
     var newState = this.state[fieldId];
     newState.value = parseFloat(value); // convert to Float
     this.setState(newState);
   },
  getFields: function(pickList){
    var s = this.state;
    return pickList.map(function(i){
       var tmp = s[i];
       tmp.name = i;
       if (typeof tmp.value  == "undefined"){
         tmp.value = 0;
       }
      return tmp;
    });
   },

  render: function(){
    var test_form = {
      title: "me",
      fields: this.getFields(['example msrp']),
      assumptions: []
    };
    return (
      <div>
        <FormBox data={test_form} onChange={this.handleFieldChange} />
      </div>
    );
  }
});

class AlphaConfig extends React.Component {
  constructor(props) {
    super(props);
  }

  render(){
    var inputs = [];
    var setSeries = this.props.setSeries;
    var series = this.props.series;
    var options = this.props.seriesOptions.split(",").map((v) => {
      var clean_v = v.trim();
      var active = classNames(
        "waves-effect btn-flat",
        {"teal lighten-2 grey-text text-lighten-4 waves-teal": clean_v===series}
      );

      return (
        <a className={active}
            onClick={setSeries.bind(null,clean_v)}>
          {clean_v} |
        </a>
      );
    });

    return (
      <div className="row">
        Pick series: {options}
      </div>
    )
  }
}


var AlphaGraph = createReactClass({
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

module.exports = AlphaBox;
