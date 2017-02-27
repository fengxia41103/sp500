import React from 'react';
import c3 from "c3";

requirejs.config({
    paths: {
        d3: 'https://d3js.org/d3.v4.js' // Or whatever
    }
})

var _ = require('lodash');
var classNames = require('classnames');
//import WayPoint from 'react-waypoint';

var randomId = function() {
  return "MY" + (Math.random() * 1e32).toString(12);
};

//****************************************
//
//    Common graph containers
//
//****************************************
var C3GraphBox = React.createClass({
  _makeViz: function() {
    // Create a clean sheet
    this._destroyViz();

    // Reformat query data to datatable consumable forms.
    var data = this._updateGraphData(this.props.unifiedData);

    // Chart options
    var options = {
      bindto: "#"+this.props.containerId,
      bar: {
        width: {
          ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
      },
      data: {
        x: "x",
        type: this._mapChartType(this.props.graphType),
        columns: data.series
      }
    }

    // Render chart
    require(["d3", "c3"], function(d3, c3) {
      this.chart = c3.generate(options);
    });
  },
  _mapChartType: function(askingType) {
    // Map container box GraphType state values to proper chart types
    switch (askingType) {
      case 'bar':
        return 'bar';
      default:
        return askingType;
    }
  },
  _updateGraphData: function(data) {
    // data: is a 2D array, [[1970, val 1, val 2,..], [1971, val3, val 4],...]
    // First transpose this matrix so the now it becomes
    // [[1970, 1971, ...], [val1, val3, ....]]
    var transposed = _.zip.apply(_, data.datatable);
    var formattedData = data.categories.map(function(country, index) {
      var data = transposed[index + 1];
      data.unshift(country);
      return data;
    });
    var x = transposed[0];
    x.unshift("x");
    formattedData.unshift(x);

    return {
      categories: data.categories,
      series: formattedData
    }
  },
  componentDidMount: function() {
    this._makeViz();

    // Set up data updater
    var that = this;
    this.debounceUpdate = _.debounce(function(data) {
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce(function(type) {
    }, 500);
  },
  _destroyViz: function(){
    if (this.chart != "undefined" && this.chart != null){
      this.chart.destroy();
    }
  },
  componentWillUnmount: function() {
    this._destroyViz();
  },
  render: function() {
    // If data changed
    var currentValue = (this.props.data != null) && this.props.data.length;
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      // Update graph data
      if (this.chart && this.debounceUpdate) {
        this.debounceUpdate(this.props.data);
      }
    }

    // If type changed
    var currentType = this.props.graphType && this.props.graphType.valueOf();
    if (currentType != null && this.preType !== currentType) {
      this.preType = currentType;

      // Update graph data
      if (this.chart && this.debounceGraphTypeUpdate) {
        this.debounceGraphTypeUpdate(this.props.graphType);
      }
    }

    // Render
    return (
      <div>
        <figure
            id={this.props.containerId}
            style={{minHeight: "500px"}}>
          <figcaption >
            {this.props.title}
          </figcaption>
        </figure>
      </div>
    );
  }
});

module.exports = C3GraphBox;
