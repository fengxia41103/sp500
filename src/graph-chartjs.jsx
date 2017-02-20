import React from 'react';
import Chart from 'chart.js';

var _ = require('lodash');
var classNames = require('classnames');

var randomId = function() {
  return "MY" + (Math.random() * 1e32).toString(12);
};

var randomColorGenerator = function () { 
    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
};

//****************************************
//
//    Common graph containers
//
//****************************************
var ChartJSGraphBox = React.createClass({
  _makeViz: function() {
    // Destroy old one if exists
    if (this.chart != "undefined" && this.chart != null){
      this.chart.destroy();
    }

    // Reformat query data to datatable consumable forms.
    var data = this._updateGraphData(this.props.unifiedData);

    // Chart options
    var options ={
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      },
      responsive: true,
      title:{
        display: true,
        text: this.props.title, // title text
      },
      animation:{
        animateScale:true
      }
    }

    // Render chart
    var id = this.props.containerId;
    this.chart = new Chart(id, {
      type: this.props.graphType,
      data: {
        labels: data.categories,
        datasets: data.series
      },
      options: options
    });
    
  },
  _updateGraphData: function(data) {
    // data: is a 2D array, [[1970, val 1, val 2,..], [1971, val3, val 4],...]
    // First transpose this matrix so the now it becomes
    // [[1970, 1971, ...], [val1, val3, ....]]
    var transposed = _.zip.apply(_, data.datatable);

    var formattedData = data.categories.map(function(country, index) {
      return {
        label: country,
        data: transposed[index + 1],
        fillColor: randomColorGenerator(),
        strokeColor: randomColorGenerator(),
        pointColor: randomColorGenerator(),
        backgroundColor: randomColorGenerator(),        
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        
      }
    });

    return {
      categories: transposed[0],
      series: formattedData
    }
  },
  componentDidMount: function() {
    // Initialize graph
    this._makeViz();

    // Set up data updater
    var that = this;
    this.debounceUpdate = _.debounce(function(data) {
      that.chart.data = that._updateGraphData(data);
      that.chart.update();
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce(function(type) {
      that._makeViz();
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
        <figure>
          <canvas
            id={this.props.containerId}
              style={{minHeight: "500px"}}>
          </canvas>
          <figcaption >
            {this.props.title}
          </figcaption>
        </figure>
      </div>
    );
  }
});

module.exports = ChartJSGraphBox;
