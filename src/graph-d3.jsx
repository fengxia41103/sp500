import React from 'react';
import d3plus from 'd3plus';
import * as ReactBootstrap from 'react-bootstrap';

var _ = require('lodash');
var classNames = require('classnames');
//import WayPoint from 'react-waypoint';

var randomId = function(){
  return "MY"+(Math.random()*1e32).toString(12);
};

//****************************************
//
//    Common graph containers
//
//****************************************

var D3PlusGraphBox = React.createClass({
  makeViz: function(){
    var config = {
      "id": "category",
      "text": "text",
      "labels": true,
      "y": "value",
      "x": "year",
      "time": "year",
      "size": this.props.graphType=="line"?"":"value",
      "shape": {
        interpolate: "basis",
        rendering: "optimizeSpeed"
      },
      "footer": {
        position: "top",
        value: this.props.footer
      }
    };

    // Draw graph
    config = _.merge(config, this._updateGraphConfig(this.props.data));
    this.viz = d3plus.viz()
                     .container("#"+this.props.containerId)
                     .config(config)
                     .data(this.props.data)
                     .type(this.props.graphType)
                     .draw();
  },
  _updateGraphConfig: function(data){
    var tmp = _.countBy(data, function(item){
      return item.category;
    });
    var cat = null;
    if (_.size(tmp) > 1){
      return {
        color: "category",
        legend: {
          align: "end",
          filters: true,
          value: true,
          text: "category",
          title: "category"
        }
      };
    }else{
      return {
        color: "uniqueKey",
        legend: false
      };
    }
  },
  componentDidMount: function(){
    // Initialize graph
    this.makeViz();

    // Set up data updater
    var that = this;
    this.debounceUpdate = _.debounce(function(data){
      var config = that._updateGraphConfig(data);
      that.viz.config(config);
      that.viz.data(data);
      that.viz.draw();
    }, 1000);

    // Set up graph type updater
    this.debounceGraphTypeUpdate = _.debounce(function(type){
      that.viz.type(type);
      that.viz.size(type=="line"?"":"value");
      that.viz.shape(type=="line"?"line":"square")

      // Update config
      var config = that._updateGraphConfig(that.props.data);
      that.viz.config(config);
      that.viz.draw();
    }, 500);
  },
  componentWillUnmount: function(){
    this.viz = null;
  },
  render: function(){
    // If data changed
    var currentValue = (this.props.data!=null) && this.props.data.length;
    if (currentValue != null && this.preValue !== currentValue){
      this.preValue = currentValue;

      // Update graph data
      if (this.viz && this.debounceUpdate){
        this.debounceUpdate(this.props.data);
      }
    }

    // If type changed
    var currentType = this.props.graphType && this.props.graphType.valueOf();
    if (currentType != null && this.preType !== currentType){
      this.preType = currentType;

      // Update graph data
      if (this.viz && this.debounceGraphTypeUpdate){
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

module.exports =  D3PlusGraphBox;
