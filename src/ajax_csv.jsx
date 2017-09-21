import React from 'react';
import ProgressBox from "./progress.jsx";
import Papa from 'papaparse';

var _ = require('lodash');

//****************************************
//
//    Common AJAX containers
//
//****************************************
var AjaxCsvContainer = React.createClass({
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
    Papa.parse(api, {
      download: true,
      header: true,
      complete: function(results) {
        handleUpdate(results.data);
      }
    });
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

module.exports = AjaxCsvContainer;
