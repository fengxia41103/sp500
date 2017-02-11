import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import AjaxContainer from "./ajax.jsx";

var _ = require('lodash');
var classNames = require('classnames');
//import WayPoint from 'react-waypoint';

var randomId = function() {
  return "MY" + (Math.random() * 1e32).toString(12);
};

var WbIndicatorInfo = React.createClass({
  getInitialState: function(){
    this.api = "http://api.worldbank.org/v2/indicators/"+this.props.indicator+"?format=json";
    return {
      info: []
    }
  },
  setInfo: function(data){
    this.setState({
      info: data[1][0].sourceNote
    });
  },
  render: function(){
    // Get items to list
    if (typeof this.state.info=="undefined" || (this.state.info && this.state.info.length < 1)){
      return (
        <AjaxContainer
            apiUrl={this.api}
            handleUpdate={this.setInfo} />
      );
    }

    // Render
    return (
      <div>
        <h5>Indicator</h5>
        <div className="divider" />
        <div style={{whiteSpace:"normal"}}>
          <p>{this.state.info}</p>
        </div>
      </div>
    );
  }
});

module.exports = WbIndicatorInfo;
