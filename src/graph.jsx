import React from 'react';
import d3plus from 'd3plus';
import * as ReactBootstrap from 'react-bootstrap';

import HighchartGraphBox from "./graph-highchart.jsx";

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
var GraphFactory = React.createClass({
  render: function() {
    var data = this.props.data;

    // Validate data set
    if (typeof data == "undefined" || data === null || data.length == 0) {
      return null;
    }

      // container id
    var containerId = randomId();

    return (
      <div className="row">
        <h3>
          {this.props.symbol}
        </h3>

        {/* Graphs */}
        <HighchartGraphBox
            containerId={containerId}
            {...this.props} />

        <div className="divider" />
      </div>
    );

    // Default
    return null;
  }
});

module.exports = GraphFactory;
