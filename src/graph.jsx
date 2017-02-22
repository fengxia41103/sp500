import React from 'react';
import d3plus from 'd3plus';
import * as ReactBootstrap from 'react-bootstrap';

import D3PlusGraphBox from "./graph-d3.jsx";
import GoogleGraphBox from "./graph-googlechart.jsx";
import GraphDatatable from "./graph-table.jsx";
import HighchartGraphBox from "./graph-highchart.jsx";
import MetricsGraphBox from "./graph-metrics.jsx";
import ChartJSGraphBox from "./graph-chartjs.jsx";
import PlotlyGraphBox from "./graph-plotly.jsx";
import DygraphsGraphBox from "./graph-dygraphs.jsx";

import WbIndicatorInfo from "./wb-indicator-info.jsx"

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
var GraphFactory = React.createClass({
  getInitialState: function() {
    var type = (typeof this.props.type === "undefined" || !this.props.type) ? "bar" : this.props.type;
    return {
      graphType: type,
      graphEngine: "D3", // possible values: [D3, Google, Highchart, Metrics]
    }
  },
  setGraphEngine: function(newEngine) {
    this.setState({
      graphEngine: newEngine
    });
  },
  setGraphType: function(newType) {
    this.setState({
      graphType: newType
    });
  },
  render: function() {
    var data = this.props.data;
    var graphType = this.state.graphType;

    // Validate data set
    if (typeof data == "undefined" || data === null || data.length == 0) {
      return null;
    }

    // Country code is an array
    var countries = this.props.countryCode.join("/");

    // Render graph by chart type
    if (graphType == "pie") {
      // Regroup by year
      var tmp = {};
      for (var i = 0; i < data.length; i++) {
        var year = data[i].year;
        if (tmp.hasOwnProperty(year)) {
          tmp[year].push(data[i])
        } else {
          tmp[year] = [data[i]];
        }
      }

      // One pie chart per year's data
      var graphs = [];
      for (year in tmp) {
        var containerId = randomId();
        var title = [this.props.title, year].join(" -- ");

        graphs.push(
          <div key={randomId()} style={{display:"inline-block"}}>
            <h3>
              {countries}
            </h3>
            <D3PlusGraphBox
                containerId={containerId}
                graphType={graphType}
                {...this.props}
                data={tmp[year]}
                title={title}/>
          </div>
        );
      }
      return (
        <div className="my-multicol-2">
          {graphs}
          <div className="divider" />
        </div>
      );
    } else if (graphType == "table") {
      return (
        <div>
          <h3>
            {countries}
          </h3>

          <GraphConfigBox
              graphType={this.state.graphType}
              setGraphType={this.setGraphType}
              graphEngine={this.state.graphEngine}
              setGraphEngine={this.setGraphEngine}
              {...this.props} />

        {/* Indicator info */}
          <WbIndicatorInfo
              {...this.props}/>
          
          <GraphDatatable {...this.props} />
          <div className="divider" />
        </div>
      );
    } else { // Default graphs
      // container id
      var containerId = randomId();

      return (
        <div>
          <h3>
            {countries}
          </h3>

          {/* Graph configurations */}
          <GraphConfigBox
              graphType={this.state.graphType}
              setGraphType={this.setGraphType}
              graphEngine={this.state.graphEngine}
              setGraphEngine={this.setGraphEngine}
              {...this.props} />

          {/* Indicator info */}
          <WbIndicatorInfo
              {...this.props}/>

          {/* Graphs */}
          <GraphBox
              containerId={containerId}
              graphType={this.state.graphType}
              graphEngine={this.state.graphEngine}
              {...this.props} />

          <div className="divider" />
        </div>
      );
    }

    // Default
    return null;
  }
});

var GraphBox = React.createClass({
  render: function() {
    var engine = this.props.graphEngine.toLowerCase();
    switch (engine) {
      case "google":
        return (
          <div>
            <GoogleGraphBox {...this.props} />
          </div>
        );
      case "highchart":
        return (
          <div>
            <HighchartGraphBox {...this.props} />
          </div>
        );
      case "metrics":
        return (
          <div>
            <MetricsGraphBox {...this.props} />
          </div>
        );
      case "chartjs":
        return (
          <div>
            <ChartJSGraphBox {...this.props} />
          </div>
        );
      case "plotly":
        return (
          <div>
            <PlotlyGraphBox {...this.props} />
          </div>
        );
      case "dygraphs":
        return (
          <div>
            <DygraphsGraphBox {...this.props} />
          </div>
        );

      case "d3plus":
      default:
        return (
          <div>
            <D3PlusGraphBox {...this.props} />
          </div>
        );
    }
  }
});

var GraphConfigBox = React.createClass({
  render: function() {
    var randomKey = randomId();
    return (
      <div className="right" style={{zIndex:999}}>
        <ReactBootstrap.DropdownButton title="config" id={randomKey}>
          <ReactBootstrap.MenuItem>
            <GraphEngineBox
                current={this.props.graphEngine}
                setGraphEngine={this.props.setGraphEngine}
                {...this.props} />
          </ReactBootstrap.MenuItem>

          <ReactBootstrap.MenuItem>
            <GraphTypeBox
                current={this.props.graphType}
                setGraphType={this.props.setGraphType}
                {...this.props} />
          </ReactBootstrap.MenuItem>
        </ReactBootstrap.DropdownButton>
      </div>
    );
  }
});

var GraphTypeBox = React.createClass({
  render: function() {
    var current = this.props.current;
    var setGraphType = this.props.setGraphType;
    var types = ["bar", "line", "table"];
    const options = types.map((t) => {
      var highlight = classNames(
        "waves-effect waves-light",
        "chip", {
          'teal lighten-2 grey-text text-lighten-4': current == t
        }
      );
      return (
        <li key={t}
            className={highlight}
            onClick={setGraphType.bind(null,t)}>
          {t}
        </li>
      );
    });

    return (
      <div>
        <h5>Graph Type</h5>
        <div className="divider"></div>
        <ul>
          {options}
        </ul>
      </div>
    );
  }
});

var GraphEngineBox = React.createClass({
  render: function() {
    var current = this.props.current;
    var setGraphEngine = this.props.setGraphEngine;
    var types = [
      "D3Plus",
      "Google",
      "Highchart",
      "Metrics",
      "ChartJS",
      "Plotly",
      "Dygraphs"];
    const options = types.map((t) => {
      var highlight = classNames(
        "waves-effect waves-light",
        "chip", {
          'teal lighten-2 grey-text text-lighten-4': current == t
        }
      );
      return (
        <li key={t}
            className={highlight}
            onClick={setGraphEngine.bind(null,t)}>
          {t}
        </li>
      );
    });

    return (
      <div>
        <h5>Engine</h5>
        <div className="divider"></div>
        <ul>
          {options}
        </ul>
      </div>
    );
  }
});

module.exports = GraphFactory;
