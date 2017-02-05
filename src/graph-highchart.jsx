import React from 'react';

var _ = require('lodash');
var classNames = require('classnames');
//import WayPoint from 'react-waypoint';

var randomId = function() {
  return "MY" + (Math.random() * 1e32).toString(12);
};

// Load highcharts
var Highcharts = require('highcharts');
var addFunnel = require('highcharts/modules/funnel');

//****************************************
//
//    Common graph containers
//
//****************************************
var HighchartGraphBox = React.createClass({
  _makeViz: function() {
    // Reformat query data to datatable consumable forms.
    var data = this._updateGraphData(this.props.unifiedData);

    // Chart options
    var options = {
      chart: {
        type: this._mapChartType(this.props.graphType)
      },
      title: {
        text: this.props.title
      },
      subtitle: {
        text: this.props.footer
      },
      xAxis: {
        categories: data.categories, // x axis  are Years
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Value'
        }
      },
      tooltip: {
        headerFormat: '<h5 class="page-header">{point.key}</h5><table class="table table-striped">',
        pointFormat: '<tr><td><b>{series.name}</b></td>' +
          '<td>{point.y:,.0f}</td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: data.series
    }

    // Render chart
    this.chart = new Highcharts['Chart'](
      this.props.containerId,
      options
    );
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
  _updateGraphData: function(data) {
    // data: is a 2D array, [[1970, val 1, val 2,..], [1971, val3, val 4],...]
    // First transpose this matrix so the now it becomes [[1970, 1971, ...], [val1, val3, ....]]
    var transposed = _.zip.apply(_, data.datatable);

    var highchartData = data.categories.map(function(country, index) {
      return {
        name: country,
        data: transposed[index + 1]
      }
    });

    return {
      categories: transposed[0],
      series: highchartData
    }
  },
  componentDidMount: function() {
    // Initialize graph
    // Apply funnel after window is present
    Highcharts.setOptions({
      lang: {
        thousandsSep: ","
      }
    });
    addFunnel(Highcharts);
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
        <figure id={this.props.containerId} style={{minHeight:"500px"}}>
          <figcaption>{this.props.title}</figcaption>
        </figure>
      </div>
    );
  }
});

module.exports = HighchartGraphBox;