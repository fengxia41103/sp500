import React from 'react';
import Dygraph from 'dygraphs';

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
var DygraphsGraphBox = React.createClass({
  _makeViz: function() {
    // Reformat query data to datatable consumable forms.
    var data = this._updateGraphData(this.props.unifiedData);
    var type = this._mapChartType(this.props.graphType);
    var id = this.props.containerId;
    var headers = this.props.unifiedData.categories;
    headers.unshift("x");

    var legendFormatter = function (data) {
      if (data.x == null) {
        // This happens when there's no selection and {legend: 'always'} is set.
        return '<br>' + data.series.map(function(series) { return series.dashHTML + ' ' + series.labelHTML }).join('<br>');
      }

      var html = this.getLabels()[0] + ': ' + data.xHTML;
      data.series.forEach(function(series) {
        if (!series.isVisible) return;
        var labeledData = series.labelHTML + ': ' + series.yHTML;
        if (series.isHighlighted) {
          labeledData = '<b>' + labeledData + '</b>';
        }
        html += '<br>' + series.dashHTML + ' ' + labeledData;
      });
      return html;
    }

    // Chart options
    var options = {
      labels: headers,
      legend: "always",
      colors: ["rgb(51,204,204)",
               "rgb(255,100,100)",
               "#00DD55",
               "rgba(50,50,200,0.4)"],
      xlabel: 'Year',
      ylabel: 'Value',
      highlightSeriesOpts: { strokeWidth: 2 },
      legend: 'always',
      //legendFormatter: legendFormatter
    };

    // Render chart
    this.containerId = id;
    this.chart = new Dygraph(id, data, options);
  },
  _mapChartType: function(askingType) {
    // Map container box GraphType state values to proper chart types
    switch (askingType) {
      case 'line':
        return 'line';
      default:
        return askingType;
    }
  },
  _updateGraphData: function(data) {
    // data: is a 2D array, [[1970, val 1, val 2,..], [1971, val3, val 4],...]
    // First transpose this matrix so the now it becomes
    // [[1970, 1971, ...], [val1, val3, ....]]
    return data.datatable.map(function(d){
      d[0] = parseInt(d[0]);
      return d;
    })
  },
  componentDidMount: function() {
    // Initialize graph
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
  componentWillUnmount: function() {
    if (this.chart != "undefined" && this.chart != null){
      this.chart.destroy();
    }
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
          <figcaption >
            {this.props.title}
          </figcaption>
          <div
            id={this.props.containerId}
            style={{minHeight: "500px"}} />
        </figure>
      </div>
    );
  }
});

module.exports = DygraphsGraphBox;
