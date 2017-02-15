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
  _makeViz: function() {
    var data = this.props.data;
    var type = this.props.graphType;
    var containerId = this.props.containerId;

    // Render chart
    return MG.data_graphic({
      title: "",
      chart_type:type,
      description: "",
      data: data,
      full_width: true,
      full_height: true,
      target: "#"+containerId,
      small_width_threshold: 1200,
      rotate_x_labels: 45,
      x_accessor: 'year',
      y_accessor: 'value'
    });
  },
  componentDidMount: function() {
    // Initialize graph
    // Apply funnel after window is present
    this._makeViz();

    // Set up data updater
    var that = this;
    this.debounceUpdate = _.debounce(function(data) {
      that._makeViz();
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce(function(type) {
      that._makeViz();
    }, 500);
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

    // If type changed
    var currentType = this.props.graphType && this.props.graphType.valueOf();
    if (currentType != null && this.preType !== currentType) {
      this.preType = currentType;

      // Update graph data
      if (this.debounceGraphTypeUpdate) {
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
