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
    this.graphs = [{
      func: "TIME_SERIES_DAILY_ADJUSTED",
      datakey: "Time Series (Daily)",
      configs: {
        series_type: "open,high,low,close"
      }
      /* },{
       *   func: "TIME_SERIES_WEEKLY",
       *   datakey: "Weekly Time Series",
       *   configs: {
       *     series_type: "open,high,low,close"
       *   }
       * },{
       *   func: "TIME_SERIES_MONTHLY",
       *   datakey: "Monthly Time Series",
       *   configs: {
       *     series_type: "open,high,low,close"
       *   }
       * },{
       *   func: "SMA",
       *   datakey: "Technical Analysis: SMA",
       *   configs: {
       *     interval: "1min, 5min, 15min, 30min, 60min, daily, weekly, monthly",
       *     time_period: 10,
       *     series_type: "open,high,low,close"
       *   }
       * },{
       *   func: "EMA",
       *   datakey: "Technical Analysis: EMA",
       *   configs: {
       *     interval: "1min, 5min, 15min, 30min, 60min, daily, weekly, monthly",
       *     time_period: 60,
       *     series_type: "open,high,low,close"
       *   }
       * },{
       *   func: "WMA",
       *   datakey: "Technical Analysis: WMA",
       *   configs: {
       *     interval: "1min, 5min, 15min, 30min, 60min, daily, weekly, monthly",
       *     series_type: "open,high,low,close"
       *   }
       * },{
       *   func: "DEMA",
       *   datakey: "Technical Analysis: DEMA",
       *   configs: {
       *     interval: "1min, 5min, 15min, 30min, 60min, daily, weekly, monthly",
       *     series_type: "open,high,low,close"
       *   }*/
    }];

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
      this._generateGraphs();
    });
  },
  _generateGraphs: function() {
  },

  render: function() {
    var symbol = this.state.symbol;
    var alphas = this.graphs.map((g) => {
      // draw graph
      return(
        <AlphaBox
            symbol={symbol}
            function={g.func}
            datakey={g.datakey}
            configs={g.configs} />
      );
    })
    return (
      <div className="container">
        <SymbolBox
            setItem={ this.setSymbol }
            activeItem={ this.state.symbol } />
        { alphas }
      </div>

    );
  }
});

module.exports = RootBox;
