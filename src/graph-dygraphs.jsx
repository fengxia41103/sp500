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
    // Create a clean sheet
    this._destroyViz();

    // Reformat query data to datatable consumable forms.
    var data = this._updateGraphData(this.props.unifiedData);
    var type = this._mapChartType(this.props.graphType);
    var id = this.props.containerId;
    var headers = ["x"].concat(this.props.unifiedData.categories);

    var legendFormatter = function (data) {
      var legends = data.series.forEach(function(series) {
        if (!series.isVisible) return;

        var highlight = ""; 
        if (series.isHighlighted) {
          highlight = "pink darken-3"
        }
        var legendLine = (
          <tr><td className={highlight}>
            {series.labelHTML}
          </td><td>
            {series.yHTML}
          </td></tr>
        );
      });

      // Legend render
      return (
        <table className="table table-responsive table-hover">
          {legends}
        </table>
      );
    }
    
    var legendFormatter2 = function (data) {
      if (data.x == null) {
        // This happens when there's no selection and {legend: 'always'} is set.
        return '<br>' + data.series.map(function(series){
          return series.dashHTML + ' ' + series.labelHTML
        }).join('<br>');
      }

      var html = this.getLabels()[0] + ': ' + data.xHTML;
      data.series.forEach(function(series) {
        if (!series.isVisible) return;
        var labeledData = series.labelHTML + ': ' + series.yHTML;
        if (series.isHighlighted) {
          labeledData = '<span class="pink darken-3 white-text">' + labeledData + '</span>';
        }
        html += '<br>' + series.dashHTML + ' ' + labeledData;
      });
      return html;
    }

    // Darken a color
    var darkenColor = function(colorStr) {
      // Defined in dygraph-utils.js
      var color = Dygraph.toRGB_(colorStr);
      color.r = Math.floor((255 + color.r) / 2);
      color.g = Math.floor((255 + color.g) / 2);
      color.b = Math.floor((255 + color.b) / 2);
      return 'rgb(' + color.r + ',' + color.g + ',' + color.b + ')';
    }
    
    // This function draws bars for a single series. See
    // multiColumnBarPlotter below for a plotter which can draw multi-series
    // bar charts.
    var barChartPlotter = function (e) {
      var ctx = e.drawingContext;
      var points = e.points;
      var y_bottom = e.dygraph.toDomYCoord(0);

      ctx.fillStyle = darkenColor(e.color);

      // Find the minimum separation between x-values.
      // This determines the bar width.
      var min_sep = Infinity;
      for (var i = 1; i < points.length; i++) {
        var sep = points[i].canvasx - points[i - 1].canvasx;
        if (sep < min_sep) min_sep = sep;
      }
      var bar_width = Math.floor(2.0 / 3 * min_sep);

      // Do the actual plotting.
      for (var i = 0; i < points.length; i++) {
        var p = points[i];
        var center_x = p.canvasx;

        ctx.fillRect(center_x - bar_width / 2, p.canvasy,
                     bar_width, y_bottom - p.canvasy);

        ctx.strokeRect(center_x - bar_width / 2, p.canvasy,
                       bar_width, y_bottom - p.canvasy);
      }
    }

    // Multiple column bar chart
    var multiColumnBarPlotter = function(e) {
      // We need to handle all the series simultaneously.
      if (e.seriesIndex !== 0) return;

      var g = e.dygraph;
      var ctx = e.drawingContext;
      var sets = e.allSeriesPoints;
      var y_bottom = e.dygraph.toDomYCoord(0);

      // Find the minimum separation between x-values.
      // This determines the bar width.
      var min_sep = Infinity;
      for (var j = 0; j < sets.length; j++) {
        var points = sets[j];
        for (var i = 1; i < points.length; i++) {
          var sep = points[i].canvasx - points[i - 1].canvasx;
          if (sep < min_sep) min_sep = sep;
        }
      }
      var bar_width = Math.floor(2.0 / 3 * min_sep);

      var fillColors = [];
      var strokeColors = g.getColors();
      for (var i = 0; i < strokeColors.length; i++) {
        fillColors.push(darkenColor(strokeColors[i]));
      }

      for (var j = 0; j < sets.length; j++) {
        ctx.fillStyle = fillColors[j];
        ctx.strokeStyle = strokeColors[j];
        for (var i = 0; i < sets[j].length; i++) {
          var p = sets[j][i];
          var center_x = p.canvasx;
          var x_left = center_x - (bar_width / 2) * (1 - j/(sets.length-1));

          ctx.fillRect(x_left, p.canvasy,
                       bar_width/sets.length, y_bottom - p.canvasy);

          ctx.strokeRect(x_left, p.canvasy,
                         bar_width/sets.length, y_bottom - p.canvasy);
        }
      }
    }
    
    // Chart options
    var options = {
      labels: headers,
      legend: "always",
      xlabel: 'Year',
      highlightSeriesOpts: { strokeWidth: 2 },
      legendFormatter: legendFormatter2
    };

    switch(type){
      case "bar":
        if (headers.length > 2 ){
          // Multi bar charts
          options.plotter = multiColumnBarPlotter;
        }else{
          options.plotter = barChartPlotter;
        }
    }

    // Render chart
    this.containerId = id;
    this.chart = new Dygraph(id, data, options);
  },
  _mapChartType: function(askingType) {
    // Map container box GraphType state values to proper chart types
    return askingType;
  },
  _updateGraphData: function(data) {
    // data: is a 2D array, [[1970, val 1, val 2,..], [1971, val3, val 4],...]
    // First transpose this matrix so the now it becomes
    // [[1970, 1971, ...], [val1, val3, ....]]
    var formatted = data.datatable.map(function(d){
      d[0] = parseInt(d[0]);
      return d;
    });
    return formatted;
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
