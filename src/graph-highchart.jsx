import React from 'react';

var _ = require('lodash');
var classNames = require('classnames');
//import WayPoint from 'react-waypoint';

var randomId = function() {
  return "MY" + (Math.random() * 1e32).toString(12);
};

// Load highcharts
var Highcharts = require('highcharts/highstock');
var addFunnel = require('highcharts/modules/funnel');

//****************************************
//
//    Common graph containers
//
//****************************************
var HighchartGraphBox = React.createClass({
  _makeViz: function() {
    // Reformat query data to datatable consumable forms.
    var data = this.props.data;

    // Chart options
    var options = {
      chart: {
        type: "line"
      },
      title: {
        text: this.props.title
      },
      subtitle: {
        text: this.props.footer
      },
      xAxis: {
        crosshair: true
      },
      yAxis: {
        title: {
          text: this.props.series
        }
      },
      tooltip: {
        headerFormat: '<h5 class="page-header">{point.key}</h5><table class="table table-striped">',
        pointFormat: '<tr><td><b>{series.name}</b></td>' +
                     '<td>{point.y:,.2f}</td></tr>',
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
      rangeSelector: {
        selected: 1
      },
      series: [{
        name: this.props.symbol,
        data: data
      }]
    }

    // Render chart
    this.chart = new Highcharts.StockChart(
      this.props.containerId,
      options
    );
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
      that.chart.update({
        series: data
      })
    }, 1000);

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

    // Render
    return (
      <div>
        <figure
            id={this.props.containerId}
            style={{minHeight: "80vh"}}>
          <figcaption >
            {this.props.title}
          </figcaption>
        </figure>
      </div>
    );
  }
});

module.exports = HighchartGraphBox;
