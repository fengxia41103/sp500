import React from 'react';
import ReactDOM from 'react-dom';
import d3plus from 'd3plus';
import AjaxContainer from "./ajax.jsx";
import SymbolBox from "./symbol.jsx";

var _ = require('lodash');
var classNames = require('classnames');

var randomId = function() {
  return "DHS" + (Math.random() * 1e32).toString(12);
};

var RootBox = React.createClass({
  getInitialState: function() {
    return {
      symbol: null,
    }
  },
  setSymbol: function(sym) {
    // Update country code selections
    // and re-initialize the graphs
    this.setState({
      symbol: sym,
    }, function() {
      // Initial showing
      this._generateGraphs();
    });
  },
  _generateGraphs: function() {

  },

  render: function() {
    return (
      <div className="container">
        <SymbolBox
            setItem={ this.setSymbol }
            activeItem={ this.state.symbol } />
      </div>
    );
  }
});

module.exports = RootBox;
