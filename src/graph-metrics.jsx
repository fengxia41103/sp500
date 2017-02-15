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

    // Render chart
    MG.data_graphic({
      title: "",
      chart_type:type,
      description: "",
      data: data,
      full_width: true,
      full_height: true,
      target: "#"+containerId,
      rotate_x_labels: 45,
      area: false,
      x_accessor: 'year',
      y_accessor: 'value',
      legend: this.props.unifiedData.categories
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
