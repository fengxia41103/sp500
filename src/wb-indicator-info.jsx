import React from 'react';
import * as ReactBootstrap from 'react-bootstrap';
import AjaxContainer from "./ajax.jsx";

var Modal = require('react-bootstrap').Modal;
var Button = require('react-bootstrap').Button;

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
      info: [],
      showInfo: false
    }
  },
  setInfo: function(data){
    this.setState({
      info: data[1][0].sourceNote,
      org: data[1][0].sourceOrganization
    });
  },
  toggle: function() {
    this.setState({ showInfo: !this.state.showInfo });
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
        <i className="fa fa-ellipsis-v left" onClick={this.toggle}/>
        {this.state.showInfo?
         (<div className="card blue-grey darken-1" onClick={this.toggle}>
           <div className="card-content white-text">
             <h5 className="card-title">Detail</h5>

             <p style={{whiteSpace:"normal"}}>
               {this.state.info}
             </p>
             <p>
               <small className="left-align">
                 <em>{this.state.org}</em>
               </small>
             </p>
             <div className="card-action right-align">
               <span className="btn" onClick={this.toggle}>Close</span>
             </div>
           </div>
         </div>
         ):null}

      </div>
    );
  }
});

module.exports = WbIndicatorInfo;
