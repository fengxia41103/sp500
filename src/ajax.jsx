import React from 'react';
import ProgressBox from "./progress.jsx";

var _ = require('lodash');

//****************************************
//
//    Common AJAX containers
//
//****************************************
var AjaxContainer = React.createClass({
  getInitialState: function() {
    return {
      loading: false
    }
  },
  getData: function() {
    if (this.state.loading) {
      return null;
    } else {
      this.setState({
        loading: true
      });
    }

    // Get data
    var api = this.props.apiUrl;
    var handleUpdate = this.props.handleUpdate;
    console.log("Getting: " + api);

    // Work horse
    fetch(api,{
          method:"get",
          mode: 'no-cors'})
        .then(function(resp) {
          return resp.json();
      }).then(function(json) {
        if ((typeof json != "undefined") && json) {
          handleUpdate(json);
        }
      }).catch(function(error) {});
  },
  componentWillMount: function() {
    this.debounceGetData = _.debounce(function() {
      this.getData();
    }, 200);
  },
  render: function() {
    // Get data
    if (!this.state.loading && this.debounceGetData) {
      this.debounceGetData();
    }
    return (
      // Progress bar
      <ProgressBox />
    );
  }
});

module.exports = AjaxContainer;
