import React from 'react';
import AjaxContainer from "./ajax.jsx";

var _ = require('lodash');
var classNames = require('classnames');
//import WayPoint from 'react-waypoint';

var randomId = function() {
  return "MY" + (Math.random() * 1e32).toString(12);
};

var WbIndicatorInfo = React.createClass({
  getInitialState: function(){
    this.api = "http://api.worldbank.org/v2/indicators/";
    return {
      info: null
    }
  },
  render: function(){
    if (this.info === null){
    }
    // Render
    return (

    );
  }
});

module.exports = WbIndicatorInfo;
