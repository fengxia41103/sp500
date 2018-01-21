import React from 'react';
import GraphFactory from "./graph.jsx";
import AjaxContainer from "./ajax.jsx";
import FormBox from "./forms.jsx";

var createReactClass = require('create-react-class');

var _ = require('lodash');
var classNames = require('classnames');
var randomId = function() {
 return "MY" + (Math.random() * 1e32).toString(12);
};


var AlphaBox = createReactClass({
  getInitialState: function() {
    return {
      forms: {
        "series": {
          label: "Price point",
          value: "close",
          datatype:"text",
          options:"open,high,low,close",
        }
      },
      graphs:[{
        func: "TIME_SERIES_DAILY_ADJUSTED",
        datakey: "Time Series (Daily)",
        is_indicator: false,
        configs: {
          series_type: "close"
        }
      },{
        func: "TIME_SERIES_WEEKLY",
        datakey: "Weekly Time Series",
        is_indicator: false,
        configs: {
          series_type: "close"
        }
      },{
        func: "TIME_SERIES_MONTHLY",
        datakey: "Monthly Time Series",
        is_indicator: false,
        configs: {
          series_type: "close"
        }
      },{
        func: "SMA",
        datakey: "Technical Analysis: SMA",
        configs: {
          interval: "daily",
          series_type: "close",
          time_period: 60,
        }
      },{
        func: "EMA",
        datakey: "Technical Analysis: EMA",
        configs: {
          interval: "daily",
          series_type: "close",
          time_period: 60,
        }
      },{
        func: "WMA",
        datakey: "Technical Analysis: WMA",
        configs: {
          interval: "daily",
          series_type: "close",
          time_period:60
        }
      },{
        func: "DEMA",
        datakey: "Technical Analysis: DEMA",
        configs: {
          interval: "daily",
          series_type: "close",
          time_period: 60
        }
      },{
        func: "TEMA",
        datakey: "Technical Analysis: TEMA",
        configs: {
          interval: "daily",
          series_type: "close",
          time_period: 60
        }
      },{
        func: "TRIMA",
        datakey: "Technical Analysis: TRIMA",
        configs: {
          interval: "daily",
          series_type: "close",
          time_period: 60
        }
      },{
        func: "KAMA",
        datakey: "Technical Analysis: KAMA",
        configs: {
          interval: "daily",
          series_type: "close",
          time_period: 60
        }
      },{
        func: "MAMA",
        datakey: "Technical Analysis: MAMA",
        configs: {
          interval: "daily",
          series_type: "close",
          fastlimit: 0.01,
          slowlimit: 0.01
        }
      },{
        func: "T3",
        datakey: "Technical Analysis: T3",
        configs: {
          interval: "daily",
          series_type: "close",
          time_period: 60
        }
      },{
        func: "TEMA",
        datakey: "Technical Analysis: TEMA",
        configs: {
          interval: "daily",
          series_type: "close",
          time_period: 60
        }
      },{
        func: "MACD",
        datakey: "Technical Analysis: MACD",
        configs: {
          interval: "daily",
          series_type: "close",
          fastperiod: 12,
          slowperiod:26,
          signalperiod:9
        }
        /* },{
         *   func: "MACDEXT",
         *   datakey: "Technical Analysis: MACDEXT",
         *   configs: {
         *     interval: "daily",
         *     series_type: "close",
         *     fastperiod: 12,
         *     slowperiod:26,
         *     signalperiod:9,
         *     fastmatype: 0,
         *     slowmatype: 0,
         *     signalmatype: 0
         *   }
         * },{
         *   func: "STOCH",
         *   datakey: "Technical Analysis: STOCH",
         *   configs: {
         *     interval: "daily",
         *     fastkperiod: 5,
         *     slowkperiod: 3,
         *     slowdperiod: 3,
         *     slowkmatype: 0,
         *     slowdmatype: 0
         *   }
         * },{
         *   func: "STOCHF",
         *   datakey: "Technical Analysis: STOCHF",
         *   configs: {
         *     interval: "daily",
         *     fastkperiod: 5,
         *     fastdperiod: 3
         *   }*/
      },{
        func: "RSI",
        datakey: "Technical Analysis: RSI",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close"
        }
        /* },{
         *   func: "STOCHRSI",
         *   datakey: "Technical Analysis: STOCHRSI",
         *   configs: {
         *     interval: "daily",
         *     time_period: 60,
         *     series_type: "close",
         *     fastkperiod: 5,
         *     fastdperiod: 3,
         *     fastdmatype: 0
         *   }*/
      },{
        func: "WILLR",
        datakey: "Technical Analysis: WILLR",
        configs: {
          interval: "daily",
          time_period: 60,
        }
      },{
        func: "ADX",
        datakey: "Technical Analysis: ADX",
        configs: {
          interval: "daily",
          time_period: 60,
        }
      },{
        func: "ADXR",
        datakey: "Technical Analysis: ADXR",
        configs: {
          interval: "daily",
          time_period: 60,
        }
      },{
        func: "APO",
        datakey: "Technical Analysis: APO",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close",
          fastperiod: 12,
          slowperiod: 26,
          matype: 0
        }
      },{
        func: "PPO",
        datakey: "Technical Analysis: PPO",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close",
          fastperiod: 12,
          slowperiod: 26,
          matype: 0
        }
      },{
        func: "MOM",
        datakey: "Technical Analysis: MOM",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close",
        }
      },{
        func: "BOP",
        datakey: "Technical Analysis: BOP",
        configs: {
          interval: "daily",
        }
      },{
        func: "CCI",
        datakey: "Technical Analysis: CCI",
        configs: {
          interval: "daily",
          time_period: 60
        }
      },{
        func: "CMO",
        datakey: "Technical Analysis: CMO",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close"
        }
      },{
        func: "ROC",
        datakey: "Technical Analysis: ROC",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close"
        }
      },{
        func: "ROCR",
        datakey: "Technical Analysis: ROCR",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close"
        }
        /* },{
         *   func: "AROON",
         *   datakey: "Technical Analysis: AROON",
         *   configs: {
         *     interval: "daily",
         *     time_period: 60
         *   }*/
      },{
        func: "AROONOSC",
        datakey: "Technical Analysis: AROONOSC",
        configs: {
          interval: "daily",
          time_period: 60
        }
      },{
        func: "MFI",
        datakey: "Technical Analysis: MFI",
        configs: {
          interval: "daily",
          time_period: 60
        }
      },{
        func: "TRIX",
        datakey: "Technical Analysis: TRIX",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close"
        }
      },{
        func: "ULTOSC",
        datakey: "Technical Analysis: ULTOSC",
        configs: {
          interval: "daily",
          timeperiod1: 7,
          timeperiod2: 14,
          timeperiod3: 28
        }
      },{
        func: "DX",
        datakey: "Technical Analysis: DX",
        configs: {
          interval: "daily",
          time_period: 60
        }
      },{
        func: "MINUS_DI",
        datakey: "Technical Analysis: MINUS_DI",
        configs: {
          interval: "daily",
          time_period: 60
        }
      },{
        func: "PLUS_DI",
        datakey: "Technical Analysis: PLUS_DI",
        configs: {
          interval: "daily",
          time_period: 60
        }
      },{
        func: "MINUS_DM",
        datakey: "Technical Analysis: MINUS_DM",
        configs: {
          interval: "daily",
          time_period: 60
        }
      },{
        func: "PLUS_DM",
        datakey: "Technical Analysis: PLUS_DM",
        configs: {
          interval: "daily",
          time_period: 60
        }
        /* },{
         *   func: "BBANDS",
         *   datakey: "Technical Analysis: BBANDS",
         *   configs: {
         *     interval: "daily",
         *     time_period: 60,
         *     series_type: "close",
         *     nbdevup: 2,
         *     nbdevdn: 2,
         *     matype: 0
         *   }*/
       },{
        func: "MIDPOINT",
        datakey: "Technical Analysis: MIDPOINT",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close"
        }
       },{
        func: "MIDPRICE",
        datakey: "Technical Analysis: MIDPRICE",
        configs: {
          interval: "daily",
          time_period: 60,
          series_type: "close"
        }
      },{
        func: "SAR",
        datakey: "Technical Analysis: SAR",
        configs: {
          interval: "daily",
          acceleration: 0.01,
          maximu: 0.2
        }
      },{
        func: "TRANGE",
        datakey: "Technical Analysis: TRANGE",
        configs: {
          interval: "daily",
        }
      },{
        func: "ATR",
        datakey: "Technical Analysis: ATR",
        configs: {
          interval: "daily",
          time_period: 60,
        }
      },{
        func: "NATR",
        datakey: "Technical Analysis: NATR",
        configs: {
          interval: "daily",
          time_period: 60,
        }
        /* },{
         *   func: "AD",
         *   datakey: "Technical Analysis: Chaikin A/D",
         *   configs: {
         *     interval: "daily"
         *   }*/
      },{
        func: "ADOSC",
        datakey: "Technical Analysis: ADOSC",
        configs: {
          interval: "daily",
          fastperiod: 3,
          slowperiod: 10
        }
      },{
        func: "OBV",
        datakey: "Technical Analysis: OBV",
        configs: {
          interval: "daily"
        }
      },{
        func: "HT_TRENDLINE",
        datakey: "Technical Analysis: HT_TRENDLINE",
        configs: {
          interval: "daily",
          series_type: "close"
        }
        /* },{
         *   func: "HT_SINE",
         *   datakey: "Technical Analysis: HT_SINE",
         *   configs: {
         *     interval: "daily",
         *     series_type: "close"
         *   }
         * },{
         *   func: "HT_TRENDMODE",
         *   datakey: "Technical Analysis: HT_TRENDMODE",
         *   configs: {
         *     interval: "daily",
         *     series_type: "close"
         *   }
         * },{
         *   func: "HT_DCPERIOD",
         *   datakey: "Technical Analysis: HT_DCPERIOD",
         *   configs: {
         *     interval: "daily",
         *     series_type: "close"
         *   }*/
      },{
        func: "HT_DCPHASE",
        datakey: "Technical Analysis: HT_DCPHASE",
        configs: {
          interval: "daily",
          series_type: "close"
        }
        /* },{
         *   func: "HT_PHASOR",
         *   datakey: "Technical Analysis: HT_PHASOR",
         *   configs: {
         *     interval: "daily",
         *     series_type: "close"
         *   }*/
      }]
    }
  },
  handleFieldChange: function(fieldId, value) {
    var newState = this.state.forms[fieldId];

    switch(newState.datatype){
      case "number":
        newState.value = parseFloat(value); // convert to Float
        break;
      default:
        newState.value=value;
        break;
    }

    this.setState(newState);
  },
  getFormFields: function(pickList){
    var s = this.state.forms;
    return pickList.map(function(i){
       var tmp = s[i];
       tmp.name = i;
       if (typeof tmp.value  == "undefined"){
         tmp.value = 0;
       }
      return tmp;
    });
   },

  render: function(){
    var getFormFields = this.getFormFields;
    var fields = _.flatMap(this.state.forms, function(val,key) {
      var tmp = val;
      tmp.title = key;
      tmp.fields = getFormFields([key]);
      tmp.assumptions = [];
      return tmp;
    });

    var form_data = {
      title: "Config",
      fields: fields
    }

    var tmpp = this.state.graphs.slice(0,1);
    /*     var graphs = this.state.graphs.map((m) => {*/
    var graphs = tmpp.map((m) => {
      return <AlphaGraph {...m}
                         {...this.props}/>
    });

    return (
      <div className="row">
        {graphs}
        {/* <FormBox data={form_data}
            onChange={this.handleFieldChange} /> */}
      </div>
    );
  }
});


var AlphaGraph = createReactClass({
  getInitialState: function() {
    return {
      data: [],
      meta: [],
      key: '4W4899YHR2QYOFQ2' // fxia1@lenovo.com
    }
  },
  getUrl: function(symbol, configs) {
    // Build API url
    var baseUrl = "https://www.alphavantage.co/query?";

    // NOTE: key, val order is reversed!!
    // see https://lodash.com/docs/4.17.4#forEach
    var query = _.flatMap(configs, function(val, key){
      return [key,val].join("=");
    })
    return baseUrl + query.join('&');
  },
  handleUpdate: function(data) {
    var cleaned = this._cleanData(data);
    var color = this.props.colors[this.state.data.length];

    this.setState({
      data: _.concat(this.state.data, {
        name: this.props.symbol,
        data: cleaned.data,
        color: color
      }),
      meta: cleaned.meta
    });
  },
  _cleanData: function(data) {
    if (typeof data === "undefined" || data === null) {
      return [];
    } else {
      // This is completely depending on the returned
      // data format. For AlphaVantage data, it's a dict
      // with a variable key which depends on the function in use!
      var points = data[this.props.datakey];
      var meta = data["Meta Data"];

      // Extract data we care about.
      var series = this.props.configs.series_type;
      var func = this.props.func;
      var is_indicator = this.props.is_indicator===false?false:true;

      var tmp = _.map(points, function(val, key){
        // date stamp, yyyy-mm-dd
        var d = new Date(key);

        // get data value
        var v = 0.0;
        if (is_indicator){
          if (val.hasOwnProperty(func)){
            v = val[func];
          }
        }else{
          switch (series){
            case 'open':
              if (val.hasOwnProperty('1. open')){
                v = val['1. open'];
              }
              break;
            case 'high':
              if (val.hasOwnProperty('2. high')){
                v = val['2. high'];
              }
              break;
            case 'low':
              if (val.hasOwnProperty('3. low')){
                v = val['3. low'];
              }
              break;
            case 'close':
              // NOTE: always prefere `adjusted` close
              if (val.hasOwnProperty('5. adjusted close')){
                v = val['5. adjusted close'];
              } else if (val.hasOwnProperty('4. close')){
                v = val['4. close'];
              }
              break;
            default:
              if (val.hasOwnProperty(series)){
                v = val[func];
              }
              break;
          }
        }
        return [d.getTime(), parseFloat(v)];
      });
      return {
        meta: meta,
        data: _.reverse(tmp)
      }
    }
  },
  render: function() {
    // If symbol changed, update data
    var changed = false;
    var currentValue = this.props.symbol;
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;
      var configs = this.props.configs;
      configs.symbol = currentValue;
      configs.function=this.props.func;
      configs.outputsize = "full";
      configs.apikey = this.state.key;

      var api = this.getUrl(currentValue, configs);
      return (
        <AjaxContainer
            key={currentValue}
            handleUpdate={this.handleUpdate}
            apiUrl={api}/>
      );
    }

    // Render graphs
    var title = this.state.meta['2: Indicator'];
    title = title?title:_.startCase(this.props.func);

    var footer = this.props.func;
    return (
      <div className="col l6 m12 s12">
        {/* Graph */}
        <GraphFactory
            categories={this.props.func}
            data={this.state.data}
            footer={footer}
            title={title}
            {...this.props}/>
      </div>
    );
  }
});

module.exports = AlphaBox;
