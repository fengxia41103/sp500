import React from 'react';
import ReactDOM from 'react-dom';
import d3plus from 'd3plus';

var _ = require('lodash');
var classNames = require('classnames');
import WayPoint from 'react-waypoint';

var randomId = function(){
    return "DHS"+(Math.random()*1e32).toString(12);
};

//****************************************
//
//    Common AJAX containers
//
//****************************************
var AjaxContainer = React.createClass({
    getInitialState: function(){
        return {
            loading: false
        }
    },
    getData: function(){
        if (this.state.loading){
            return null;
        }else{
            this.setState({
                loading: true
            });
        }

        // Get data
        var api = this.props.apiUrl;
        var handleUpdate = this.props.handleUpdate;
        console.log("Getting: "+api);
        fetch(api)
        .then(function(resp){
            return resp.json();
        }).then(function(json){
            if ((typeof json != "undefined") && json){
                handleUpdate(json);
            }
        });
    },
    componentWillMount: function(){
        this.debounceGetData = _.debounce(function(){
            this.getData();
        }, 500);
    },
    render: function(){
        // Get data
        if (!this.state.loading && this.debounceGetData){
            this.debounceGetData();
        }
        return null;
    }
});

//****************************************
//
//    Common graph containers
//
//****************************************
var GraphFactory = React.createClass({
    render: function(){
        var data = this.props.data;

        // Validate data set
        if (typeof data == "undefined" || data === null || data.length == 0){
            return null;
        }

        // Render graph by chart type
        if (this.props.type === "bar"){
            // container id
            var containerId = randomId();
            return (
            <div>
                <h3>
                    {this.props.countryCode}
                </h3>
                <GraphBox containerId={containerId}
                    {...this.props}
                    d3config={this.props.d3config.default}/>
                <div className="divider" />
            </div>
            );
        } else if (this.props.type === "line"){
            // container id
            var containerId = randomId();
            return (
            <div>
                <h3>
                    {this.props.countryCode}
                </h3>
                <GraphBox containerId={containerId}
                    {...this.props}
                    data={data}
                    d3config={this.props.d3config.line}
                />
                <div className="divider" />
            </div>
            );
        } else if (this.props.type === "pie"){
            var graphs = [];
            var data = this.props.data;

            // Regroup by year
            var tmp = {};
            for (var i=0; i<data.length;i++){
                var year = data[i].SurveyYear;
                if (tmp.hasOwnProperty(year)){
                    tmp[year].push(data[i])
                } else{
                    tmp[year] = [data[i]];
                }
            }

            // One pie chart per year's data
            for (year in tmp){
                var containerId = randomId();
                var title= [this.props.title, year].join(" -- ");

                graphs.push(
                    <div key={randomId()} style={{display:"inline-block"}}>
                        <h3>
                            {this.props.countryCode}
                        </h3>
                        <GraphBox containerId={containerId}
                            {...this.props}
                            data={tmp[year]}
                            d3config={this.props.d3config.default}
                            title={title}/>
                    </div>
                );
            }
            return (
                <div className="row my-multicol-2">
                    {graphs}
                    <div className="divider" />
                </div>
            );
        }

        // Default
        return null;
    }
});

var GraphBox = React.createClass({
    makeViz: function(data){
        this.viz = d3plus.viz()
            .container("#"+this.props.containerId)
            .config(this.props.d3config)
            .data(this.props.data)
            .type(this.props.type)
            .draw();
    },
    componentDidMount: function(){
        // Initialize graph
        this.makeViz(this.props.data);

        // Set up data updater
        var that = this;
        this.debounceUpdate = _.debounce(function(data){
            that.viz.data(data);
            that.viz.draw();
        }, 500);
    },
    componentWillUnmount: function(){
        this.viz = null;
    },
    render: function(){
        // If data changed
        var currentValue = this.props.data && this.props.data.valueOf();
        if (currentValue != null && this.preValue !== currentValue){
            this.preValue = currentValue;

            // Update graph data
            if (this.viz && this.debounceUpdate){
                this.debounceUpdate(this.props.data);
            }
        }

        return (
            <figure id={this.props.containerId} style={{minHeight:"500px"}}>
                <figcaption>{this.props.title}</figcaption>
            </figure>
        );
    }
});


//****************************************
//
//    Application containers
//
//****************************************
var CountryAlphabeticList = React.createClass({
    render: function(){
        var letter = this.props.letter;
        var setCountry = this.props.setCountry;
        var activeCountry = this.props.activeCountry;

        var fields = this.props.countries.map(function(c){
            var itemClass = classNames(
                'chip',
                {'teal lighten-2 grey-text text-lighten-4': activeCountry && c.iso2Code==activeCountry}
            );
            if (c.iso2Code.startsWith(letter)){
                return (
                    <div key={c.iso2Code} className={itemClass}>
                    <span onClick={setCountry.bind(null,c.iso2Code)}>
                        {c.name} ({c.iso2Code})
                    </span>
                    </div>
                );
            }
        });

        return (
            <div>
                <h3>{this.props.letter}</h3>
                {fields}
                <div className="divider"></div>
            </div>
        );
    }
});

var CountryBox = React.createClass({
    getInitialState: function(){
        return {
            data: [],
            index: "A"
        }
    },
    handleUpdate: function(data){
        // Save response data
        this.setState({
            data: data[1]
        });
    },
    getUrl: function(){
        //var api = "http://api.dhsprogram.com/rest/dhs/countries";
        var api = "http://api.worldbank.org/v2/en/countries?format=json&per_page=1000";
        return api;
    },
    setIndex: function(letter){
        this.setState({
            index: letter
        });
    },
    render: function(){
        // Build A-Z index
        var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
        var current = this.state.index;
        var setIndex = this.setIndex;
        var index = alphabet.map(function(letter){
            var highlight = current==letter?"active":"";
            return (
                <li key={letter}
                    className={highlight}
                    onClick={setIndex.bind(null,letter)}>
                    <a>{letter}</a>
                </li>
            );
        });

        // Update data
        if (typeof this.state.data=="undefined" || (this.state.data && this.state.data.length < 1)){
            var api = this.getUrl();
            return (
                <AjaxContainer
                    apiUrl={api}
                    handleUpdate={this.handleUpdate} />
            );
        }

        // Render
        return (
        <div>
            <nav>
                <div className="nav-wrapper">
                <ul className="right hide-on-med-and-down">
                {index}
                </ul>
                </div>
            </nav>
            <CountryAlphabeticList
                letter={current}
                countries={this.state.data}
                {...this.props} />
        </div>
        );
    }
});


var DhsGraphContainer = React.createClass({
    getInitialState: function(){
        return {
            data: [],
            // graph config, mostly to define based on
            // data structure saved in "data" so the graph
            // knows which property stands for what
            d3config: {
                "default": {
                    "id": "Indicator",
                    "color": "Indicator",
                    "text": "Indicator",
                    "legend": false,
                    "y": "Value",
                    "x": "SurveyYear",
                    "time": "SurveyYear",
                    "size": "Value",
                    "footer": {
                        position: "top",
                        value: "Data source: USAID DHS Program"
                    }
                },
                "line": {
                    "id": "",
                    "text": "Indicator",
                    "time": "SurveyYear",
                    "shape": {
                        interpolate: "step"
                    },
                    "y": "Value",
                    "x": "SurveyYear",
                    "footer": {
                        position: "top",
                        value: "Data source: USAID DHS Program"
                    }
                }
            }
        }
    },
    getUrl: function(countryCode, indicators){
        // Build DHS API url
        var baseUrl = "http://api.dhsprogram.com/rest/dhs/v4/data?";
        var queries = {
            "countryIds": countryCode,
            "indicatorIds": indicators.join(","),
            "perpage": 1000, // max for non-registered user

            // return fields must match what is being used in D3 graph
            "returnFields": ["Indicator","Value","SurveyYear"].join(",")
        };
        var tmp = [];
        for (var key in queries){
            var val = queries[key];
            if (val && (val.length > 0)){
                tmp.push(key + "=" + val);
            }
        }
        return baseUrl+tmp.join("&");
    },
    cleanData:function(data){
        if (typeof data === "undefined" || data === null){
            return [];
        }else {
            // Data needs to be massaged
            for (var i = 0; i<data.length; i++){
                data[i].SurveyYear = ""+data[i].SurveyYear;
            }
            return data;
        }

    },
    handleUpdate: function(data){
        this.setState({
            data: this.cleanData(data.Data)
        });
    },
    render: function(){
        // If country code changed, update data
        var changed = false;
        var currentValue = this.props.countryCode && this.props.countryCode.valueOf();
        if (currentValue != null && this.preValue !== currentValue){
            this.preValue = currentValue;
            var api = this.getUrl(this.props.countryCode, this.props.indicators);
            return (
                <AjaxContainer
                    handleUpdate={this.handleUpdate}
                    apiUrl={api} />
            );
        }

        // Render graphs
        return (
            <GraphFactory
                data={this.state.data}
                d3config={this.state.d3config}
                {...this.props}
            />
        );
    }
});

var WbGraphContainer = React.createClass({
    getInitialState: function(){
        return {
            data: [],
            d3config: {
                "default": {
                    "id": "date",
                    "color": "date",
                    "text": "date",
                    "time": "date",
                    "legend": false,
                    "y": "value",
                    "x": "date",
                    "size": "value",
                    "footer": {
                        position: "top",
                        value: "Data source: The World Bank"
                    }
                },
                "line": {
                    "id": "country",
                    "text": "date",
                    "time": "date",
                    "shape": {
                        interpolate: "basis"
                    },
                    "legend": false,
                    "y": "value",
                    "x": "date",
                    "footer": {
                        position: "top",
                        value: "Data source: The World Bank"
                    }
                }
            },
            start: "1960",
            end: "2015"
        }
    },
    getUrl: function(countryCode, indicator){
        // Build DHS API url
        var baseUrl = "http://api.worldbank.org/v2/en/countries/";
        var tmp = [countryCode, "indicators", indicator].join("/");
        var query = "?date="+this.state.start+":"+this.state.end+"&format=json&per_page=1000";
        return baseUrl+tmp+query;
    },
    handleUpdate: function(data){
        this.setState({
            data: this.cleanData(data[1])
        });
    },
    cleanData:function(data){
        if (typeof data === "undefined" || data === null){
            return [];
        }else{
            var tmp = [];
            for (var i = 0; i<data.length; i++){
                // Original data can be null or 0, skip both
                // in the final data set
                if (data[i].value !== null){
                    data[i].value = parseFloat(data[i].value);
                    if (data[i].value > 0){
                        tmp.push(data[i]);
                    }
                }
            }
            return  _.sortBy(tmp, 'date');
        }
    },
    render: function(){
        // If country code changed, update data
        var changed = false;
        var currentValue = this.props.countryCode && this.props.countryCode.valueOf();
        if (currentValue != null && this.preValue !== currentValue){
            this.preValue = currentValue;
            var api = this.getUrl(this.props.countryCode, this.props.indicator);
            return (
                <AjaxContainer
                    handleUpdate={this.handleUpdate}
                    apiUrl={api} />
            );
        }

        // Render graphs
        return (
            <GraphFactory
                data={this.state.data}
                d3config={this.state.d3config}
                {...this.props}
            />
        );
    }
});

var RootBox = React.createClass({
    getInitialState: function(){
        this.graphs = [];
        this.graphsInDisplay = [];
        return {
            countryCode: null,
            graphs: [{
                title: "Age-specific fertility rate for the three years preceding the survey, expressed per 1,000 women",
                indicators:[
                    "FE_FRTR_W_A15",
                    "FE_FRTR_W_A20",
                    "FE_FRTR_W_A25",
                    "FE_FRTR_W_A30",
                    "FE_FRTR_W_A35",
                    "FE_FRTR_W_A40",
                    "FE_FRTR_W_A45",
                ],
                type: "bar", source: "dhs"
            },{
                title:"HIV prevalence among couples",
                indicators:[
                    "HA_HPAC_B_CPP",
                    "HA_HPAC_B_CPN",
                    "HA_HPAC_B_CNP",
                    "HA_HPAC_B_CNN"
                ],
                type: "pie", source: "dhs"
            },{
                title: "GNI per capita, Atlas method (current US$)",
                indicator: "NY.GNP.PCAP.CD",
                type: "bar", source: "wb"
            },{
                title: "GDP per person employed (constant 2011 PPP $)",
                indicator: "SL.GDP.PCAP.EM.KD",
                type: "line", source: "wb"
            },{
                title: "Labor force, total",
                indicator: "SL.TLF.TOTL.IN",
                type: "line", source: "wb"
            },{
                title: "Life expectancy at birth, total (years)",
                indicator: "SP.DYN.LE00.IN",
                type: "line", source: "wb"
            },{
                title: "Inflation, GDP deflator (annual %)",
                indicator: "NY.GDP.DEFL.KD.ZG",
                type: "bar", source: "wb"
            },{
                title: "Inflation, consumer prices (annual %)",
                indicator: "FP.CPI.TOTL.ZG",
                type: "bar", source: "wb"
            },{
                title: "Real interest rate (%)",
                indicator: "FR.INR.RINR",
                type: "line", source: "wb"
            },{
                title: "Fertility rate, total (births per woman)",
                indicator: "SP.DYN.TFRT.IN",
                type: "line", source: "wb"
            },{
                title: "Population ages 0-14 (% of total)",
                indicator: "SP.POP.0014.TO.ZS",
                type: "line", source: "wb"
            },{
                title: "Population ages 15-64 (% of total)",
                indicator: "SP.POP.1564.TO.ZS",
                type: "line", source: "wb"
            },{
                title: "Health expenditure, total (% of GDP)",
                indicator: "SH.XPD.TOTL.ZS",
                type: "bar", source: "wb"
            },{
                title: "Health expenditure per capita (current US$)",
                indicator: "SH.XPD.PCAP",
                type: "bar", source: "wb"
            },{
                title: "Rural population (% of total population)",
                indicator: "SP.RUR.TOTL.ZS",
                type: "line", source: "wb"
            },{
                title: "Urban population (% of total)",
                indicator: "SP.URB.TOTL.IN.ZS",
                type: "line", source: "wb"
            },{
                title: "Population living in slums, (% of urban population)",
                indicator: "EN.POP.SLUM.UR.ZS",
                type: "bar", source: "wb"
            },{
                title: "Revenue, excluding grants (% of GDP)",
                indicator: "GC.REV.XGRT.GD.ZS",
                type: "line", source: "wb"
            },{
                title: "External debt stocks, public and publicly guaranteed (PPG) (DOD, current US$)",
                indicator: "DT.DOD.DPPG.CD",
                type: "line", source: "wb"
            },{
                title: "Bank nonperforming loans to total gross loans (%)",
                indicator: "FB.AST.NPER.ZS",
                type: "bar", source: "wb"
            },{
                title: "Bank capital to assets ratio (%)",
                indicator: "FB.BNK.CAPA.ZS",
                type: "bar", source: "wb"
            },{
                title: "Broad money growth (annual %)",
                indicator: "FM.LBL.BMNY.ZG",
                type: "line", source: "wb"
            },{
                title: "Net barter terms of trade index (2000 = 100)",
                indicator: "TT.PRI.MRCH.XD.WD",
                type: "bar", source: "wb"
            },{
                title: "Merchandise trade (% of GDP)",
                indicator: "TG.VAL.TOTL.GD.ZS",
                type: "line", source: "wb"
            },{
                title: "Exports of goods and services (% of GDP)",
                indicator: "NE.EXP.GNFS.ZS",
                type: "line", source: "wb"
            },{
                title: "Imports of goods and services (% of GDP)",
                indicator: "NE.IMP.GNFS.ZS",
                type: "line", source: "wb"
            },{
                title: "Merchandise exports (current US$)",
                indicator: "TX.VAL.MRCH.CD.WT",
                type: "line", source: "wb"
            },{
                title: "Merchandise imports (current US$)",
                indicator: "TM.VAL.MRCH.CD.WT",
                type: "line", source: "wb"
            },{
                title: "High-technology exports (% of manufactured exports)",
                indicator: "TX.VAL.TECH.MF.ZS",
                type: "line", source: "wb"
            },{
                title: "Foreign direct investment, net inflows (BoP, current US$)",
                indicator: "BX.KLT.DINV.CD.WD",
                type: "line", source: "wb"
            },{
                title: "Stocks traded, total value (% of GDP)",
                indicator: "CM.MKT.TRAD.GD.ZS",
                type: "line", source: "wb"
            },{
                title: "Stocks traded, turnover ratio of domestic shares (%)",
                indicator: "CM.MKT.TRNR",
                type: "line", source: "wb"
            },{
                title: "Expense (% of GDP)",
                indicator: "GC.XPN.TOTL.GD.ZS",
                type: "line", source: "wb"
            },{
                title: "Tax revenue (% of GDP)",
                indicator: "GC.TAX.TOTL.GD.ZS",
                type: "line", source: "wb"
            },{
                title: "Patent applications, residents",
                indicator: "IP.PAT.RESD",
                type: "line", source: "wb"
            },{
                title: "Patent applications, nonresidents",
                indicator: "IP.PAT.NRES",
                type: "line", source: "wb"
            },{
                title: "Researchers in R&D (per million people)",
                indicator: "SP.POP.SCIE.RD.P6",
                type: "bar", source: "wb"
            },{
                title: "Scientific and technical journal articles",
                indicator: "IP.JRN.ARTC.SC",
                type: "bar", source: "wb"
            },{
                title: "Research and development expenditure (% of GDP)",
                indicator: "GB.XPD.RSDV.GD.ZS",
                type: "bar", source: "wb"
            },{
                title: "CO2 emissions (metric tons per capita)",
                indicator: "EN.ATM.CO2E.PC",
                type: "line", source: "wb"
            },{
                title: "Energy use (kg of oil equivalent per capita)",
                indicator: "EG.USE.PCAP.KG.OE",
                type: "line", source: "wb"
            },{
                title: "International tourism, expenditures (% of total imports)",
                indicator: "ST.INT.XPND.MP.ZS",
                type: "line", source: "wb"
            },{
                title: "International tourism, receipts (% of total exports)",
                indicator: "ST.INT.RCPT.XP.ZS",
                type: "line", source: "wb"
            }],
            index: 0,
        }

    },
    setCountry: function(code){
        this.setState({
            countryCode: code,
            index: 1
        });

        // Re-write all graphs
        this.graphs = this.state.graphs.map(function(g){
            var id = randomId();
            if (g.source === "dhs"){
                return (
                    <DhsGraphContainer
                        key={id}
                        countryCode={code}
                        {...g}
                    />
                );
            }else if (g.source === "wb"){
                return (
                    <WbGraphContainer
                        key={id}
                        countryCode={code}
                        {...g}
                    />
                );
            }
        });
        this.graphsInDisplay = [];

        // Initial showing
        this._handleShowMore();
    },
    _handleShowMore: function(){
        var step = 5;
        var current = this.graphsInDisplay;
        current.push.apply(current, this.graphs.slice(this.state.index*step, (this.state.index+1)*step));
        this.graphsInDisplay = current;

        this.setState({
            index: this.state.index+1
        });
    },

    render: function(){
        return (
            <div>
                <article>
                <CountryBox setCountry={this.setCountry}
                            activeCountry={this.state.countryCode}/>
                </article>
                {this.graphsInDisplay}

                {this.graphsInDisplay.length < this.graphs.length?
                <div className="right-align">
                     <span className="waves-effect waves-light btn" style={{marginTop:"1em"}}
                     onClick={this._handleShowMore}>Load more</span>
                </div>
                : null}
            </div>
        );
    }
});

module.exports = RootBox;
