import React from 'react';
import ReactDOM from 'react-dom';
import SymbolBox from "./symbol.jsx";
import AlphaBox from "./alpha.jsx";

var _ = require('lodash');
var classNames = require('classnames');

var randomId = function() {
  return "DHS" + (Math.random() * 1e32).toString(12);
};

var RootBox = React.createClass({
  getInitialState: function() {
    return {
      symbol: null,
      outputsize: "compact",
    }
  },
  setSymbol: function(sym) {
    // Update country code selections
    // and re-initialize the graphs
    this.setState({
      symbol: sym,
    }, function() {
      // Initial showing
      this._generateGraphs(sym);
    });
  },
  _generateGraphs: function(symbol) {
  },
  render: function() {
    var symbol = this.state.symbol;
    return (
      <div className="container">
        <SymbolBox
            setItem={ this.setSymbol }
            activeItem={ this.state.symbol } />
        <AlphaBox symbol={this.state.symbol} />
      </div>

    );
  }
});

module.exports = RootBox;
