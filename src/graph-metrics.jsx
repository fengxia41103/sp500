import React from 'react';
import MetricsGraphics from 'react-metrics-graphics';

var _ = require('lodash');
var classNames = require('classnames');


var randomId = function() {
  return "MY" + (Math.random() * 1e32).toString(12);
};


//****************************************
//
//    Common graph containers
//
//****************************************
var MetricsGraphBox = React.createClass({
  _makeViz: function() {
    // Reformat query data to datatable consumable forms.
    var data = this.props.data;

    // Render chart
    MG.data_graphic({
        title: "",
        description: "Source: "+this.props.footer,
        data: data,
        full_width: true,
        full_height: true,
        target: "#"+this.props.containerId,
        x_accessor: 'year',
        y_accessor: 'value'
    });
  },
  _mapChartType: function(askingType) {
    // Map container box GraphType state values to Google chart types
    switch (askingType) {
      case 'bar':
        return 'column';
      default:
        return askingType;
    }
  },
  componentDidMount: function() {
    // Initialize graph
    // Apply funnel after window is present
    this._makeViz();

    // Set up data updater
    var that = this;
    this.debounceUpdate = _.debounce(function(data) {
      var datatable = that._updateGraphData(data);
      that.chart.update({
        series: datatable.series
      })
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce(function(type) {
      that.chart.update({
        chart: {
          type: that._mapChartType(type)
        }
      })
    }, 500);
  },
  componentWillUnmount: function() {
    this.chart.destroy();
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

module.exports = MetricsGraphBox;
