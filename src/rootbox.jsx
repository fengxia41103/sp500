import React from 'react';
import ReactDOM from 'react-dom';
import SymbolBox from "./symbol.jsx";
import AlphaGraph from "./alpha-graph.jsx";

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
        <AlphaGraph
            symbol ={this.state.symbol}
            function="TIME_SERIES_DAILY_ADJUSTED"
            datakey="Time Series (Daily)"
            outputsize="full"
            series="open"
            interval="daily"/>
      </div>
    );
  }
});

module.exports = RootBox;
