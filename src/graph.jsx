import React from 'react';
import d3plus from 'd3plus';

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
var GraphFactory = React.createClass({
    getInitialState: function(){
        var type = (typeof this.props.type === "undefined" || !this.props.type)? "bar":this.props.type;
        return {
            graphType: type,
            graphEngine: "d3plus", // possible values: [google, highchart]
        }
    },
    setGraphEngine: function(newEngine){
      this.setState({
        graphEngine: newEngine
      });
    },
    setGraphType: function(newType) {
        this.setState({
            graphType: newType
        });
    },
    render: function(){
        var data = this.props.data;
        var graphType = this.state.graphType;

        // Validate data set
        if (typeof data == "undefined" || data === null || data.length == 0){
            return null;
        }

        // Country code is an array
        var countries = this.props.countryCode.join("/");

        // Render graph by chart type
        if (graphType == "pie"){
            // Regroup by year
            var tmp = {};
            for (var i=0; i<data.length;i++){
                var year = data[i].year;
                if (tmp.hasOwnProperty(year)){
                    tmp[year].push(data[i])
                } else{
                    tmp[year] = [data[i]];
                }
            }

            // One pie chart per year's data
            var graphs = [];
            for (year in tmp){
                var containerId = randomId();
                var title= [this.props.title, year].join(" -- ");

                graphs.push(
                    <div key={randomId()} style={{display:"inline-block"}}>
                        <h3>
                            {countries}
                        </h3>
                        <D3PlusGraphBox containerId={containerId}
                            graphType={graphType}
                            {...this.props}
                            data={tmp[year]}
                            title={title}/>
                    </div>
                );
            }
            return (
                <div className="my-multicol-2">
                    {graphs}
                    <div className="divider" />
                </div>
            );
        } else if (graphType == "table"){
            return (
            <div>
                <h3>
                    {countries}
                </h3>

                <GraphTypeBox
                    current={this.state.graphType}
                    setGraphType={this.setGraphType}
                    {...this.props} />

                <GraphDatatable {...this.props} />
                <div className="divider" />
            </div>
            );
        } else { // Default graphs
            // container id
            var containerId = randomId();
            return (
            <div>
                <h3>
                    {countries}
                </h3>

                <GraphTypeBox
                    current={this.state.graphType}
                    setGraphType={this.setGraphType}
                    {...this.props} />

                <GoogleGraphBox containerId={containerId}
                    graphType={graphType}
                    {...this.props}
                />
                <div className="divider" />
            </div>
            );
        }

        // Default
        return null;
    }
});

var GraphTypeBox = React.createClass({
    render: function(){
        var current = this.props.current;
        var setGraphType = this.props.setGraphType;
        var types = ["bar","line","table"];
        const options = types.map((t) => {
            var highlight = classNames(
                "waves-effect waves-light",
                "flabel",
                {"myhighlight": current==t}
            );
            return (
                <li key={t}
                    className={highlight}
                    onClick={setGraphType.bind(null,t)}>
                       {t}
                </li>
            );
        });

        return (
            <div>
                <ul className="right">
                {options}
                </ul>
            </div>
        );
    }
});

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

var GraphDatatable = React.createClass({
    render: function(){
      const fields = this.props.data.map((d) => {
            var randomKey = randomId();
            return (
                <tr key={randomKey}><td>
                    {d.year}
                </td><td>
                    {d.value}
                </td><td>
                    {d.country}
                </td></tr>
            );
        });

        return (
        <div>
            <figure id={this.props.containerId}>
                <figcaption>{this.props.title}</figcaption>
            <table className="table table-responsive table-striped">
                <thead>
                    <th>Year</th>
                    <th>Value</th>
                    <th>Country</th>
                </thead>
                <tbody>
                {fields}
                </tbody>
            </table>
            </figure>
        </div>
        );
    }
});

var GoogleGraphBox = React.createClass({
    makeViz: function(){
      var options = {
        chart: {
          title: this.props.title,
          subtitle: this.props.footer
        },
        width: "100%",
        height: 500
      };

      var data = new google.visualization.DataTable();
      data.addColumn('number', 'Day');
      data.addColumn('number', 'Guardians of the Galaxy');
      data.addColumn('number', 'The Avengers');
      data.addColumn('number', 'Transformers: Age of Extinction');

      data.addRows([
        [1,  37.8, 80.8, 41.8],
        [2,  30.9, 69.5, 32.4],
        [3,  25.4,   57, 25.7],
        [4,  11.7, 18.8, 10.5],
        [5,  11.9, 17.6, 10.4],
        [6,   8.8, 13.6,  7.7],
        [7,   7.6, 12.3,  9.6],
        [8,  12.3, 29.2, 10.6],
        [9,  16.9, 42.9, 14.8],
        [10, 12.8, 30.9, 11.6],
        [11,  5.3,  7.9,  4.7],
        [12,  6.6,  8.4,  5.2],
        [13,  4.8,  6.3,  3.6],
        [14,  4.2,  6.2,  3.4]
      ]);
      this.chart = new google.charts.Line(document.getElementById(this.props.containerId));
      this.chart.draw(data, options);
    },
    _updateGraphData: function(data){
      // Return a new Google Datatable
      var d = d3.nest()
        .key(function(d){return d.year})
        .key(function(d){return d.country})
        .key(function(d){return d.category})
        .entries(data);

      var datatable = new Array();
      var categories = ['Year'];
      _.forEach(d, function(byYear){
        var year = byYear.key;
        var values = [];
        _.forEach(byYear.values, function(byCountry){
          var country = byCountry.key;
          _.forEach(byCountry.values, function(byCategory){
            var category = byCategory.key;
            categories.push(category);
            _.forEach(byCategory.values, function(item){
              values.push(item.value);
            });
          });
        });
        datatable.push(_.flatten([year,values]));
      });
      return {
          categories: _.uniq(categories),
          datatable: datatable
        };
    },
    componentDidMount: function(){
      // Initialize graph
      google.charts.load('current', {'packages':['line']});
      google.charts.setOnLoadCallback(this.makeViz);

        // Set up data updater
        var that = this;
        this.debounceUpdate = _.debounce(function(data){
          var datatable = that._updateGraphData(data);
          console.log(datatable);
        }, 1000);

        // Set up graph type updater
        this.debounceGraphTypeUpdate = _.debounce(function(type){

        }, 500);
    },
    componentWillUnmount: function(){
        this.chart = null;
    },
    render: function(){
      // If data changed
      var currentValue = (this.props.data!=null) && this.props.data.length;
      if (currentValue != null && this.preValue !== currentValue){
        this.preValue = currentValue;

        // Update graph data
        if (this.chart && this.debounceUpdate){
          this.debounceUpdate(this.props.data);
        }
      }

      // If type changed
      var currentType = this.props.graphType && this.props.graphType.valueOf();
      if (currentType != null && this.preType !== currentType){
            this.preType = currentType;

            // Update graph data
            if (this.chart && this.debounceGraphTypeUpdate){
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

module.exports = GraphFactory;
