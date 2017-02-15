import React from 'react';
import MG from "metrics-graphics";

var _ = require('lodash');
var classNames = require('classnames');

//****************************************
//
//    Common graph containers
//
//****************************************
var MetricsGraphBox = React.createClass({
  _updateGraphData: function(data){
    var transposed = _.zip.apply(_, data.datatable);

    if (transposed.length < 3){ // at least [[year..], [vals..]]
      return this.props.data;
    }else{
      var newData = [];
      var years = transposed[0];
      for(var i = 1; i<transposed.length; i++){
        var tmp = _.zip(years, transposed[i]);
        tmp = _.forEach(tmp, function(val, index){
          tmp[index] = {
            year: val[0],
            value: val[1]
          }
        })
        newData.push(tmp);
      }
      return newData;
    }
  },
  _makeViz: function() {
    var data = this._updateGraphData(this.props.unifiedData);
    var type = this.props.graphType;
    var containerId = this.props.containerId;

    // Update options
    // Note: we do NOT render bar chart using MetricsGraphics
    this.options.chart_type = "line";
    this.options.data = data;
    this.options.target = "#"+containerId;
    this.options.legend = this.props.unifiedData.categories;

    // Render chart
    MG.data_graphic(this.options);
  },
  componentDidMount: function() {
    // Graph options
    this.options = {
      title: "",
      description: "",
      full_width: true,
      full_height: true,
      rotate_x_labels: 45,
      area: false,
      x_accessor: 'year',
      y_accessor: 'value',
      legend_target: 'div#custom-color-key',
      colors: ['blue', 'rgb(255,100,43)', '#CCCCFF'],
      aggregate_rollover: true
    }

    // Initialize graph
    // Apply funnel after window is present
    this._makeViz();

    // Set up data updater
    var that = this;
    this.debounceUpdate = _.debounce(function(data) {
      that._makeViz();
    }, 1000);

  },
  render: function() {
    // If data changed
    var currentValue = (this.props.data != null) && this.props.data.length;
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      // Update graph data
      if (this.debounceUpdate) {
        this.debounceUpdate(this.props.data);
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
