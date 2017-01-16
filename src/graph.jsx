import React from 'react';
import d3plus from 'd3plus';
import * as ReactBootstrap from 'react-bootstrap';

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
            graphEngine: "D3", // possible values: [D3, Google, Highchart]
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

                <GraphConfigBox
                  graphType={this.state.graphType}
                  setGraphType={this.setGraphType}
                  graphEngine={this.state.graphEngine}
                  setGraphEngine={this.setGraphEngine}
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

                <GraphConfigBox
                  graphType={this.state.graphType}
                  setGraphType={this.setGraphType}
                  graphEngine={this.state.graphEngine}
                  setGraphEngine={this.setGraphEngine}
                  {...this.props} />
                <GraphBox
                  containerId={containerId}
                  graphType={this.state.graphType}
                  graphEngine={this.state.graphEngine}
                  {...this.props} />

                <div className="divider" />
            </div>
            );
        }

        // Default
        return null;
    }
});

var GraphBox = React.createClass({
  render: function(){
    switch(this.props.graphEngine){
      case "Google":
        return (
          <div>
          <GoogleGraphBox {...this.props} />
          </div>
        );

      case "D3":
      default:
        return (
          <div>
          <D3PlusGraphBox {...this.props} />
          </div>
        );
    }
  }
});

var GraphConfigBox = React.createClass({
  render: function(){
    var randomKey = randomId();
    return (
      <div className="right" style={{zIndex:999}}>
        <ReactBootstrap.DropdownButton title="config" id={randomKey}>
          <ReactBootstrap.MenuItem>
            <GraphEngineBox
              current={this.props.graphEngine}
              setGraphEngine={this.props.setGraphEngine}
              {...this.props} />
          </ReactBootstrap.MenuItem>

          <ReactBootstrap.MenuItem>
            <GraphTypeBox
              current={this.props.graphType}
              setGraphType={this.props.setGraphType}
              {...this.props} />
           </ReactBootstrap.MenuItem>
         </ReactBootstrap.DropdownButton>
      </div>
      );
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
                "chip",
                {'teal lighten-2 grey-text text-lighten-4': current==t}
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
            <h5>Graph Type</h5>
            <div className="divider"></div>
            <ul>
              {options}
            </ul>
          </div>
        );
    }
});

var GraphEngineBox = React.createClass({
    render: function(){
        var current = this.props.current;
        var setGraphEngine = this.props.setGraphEngine;
        var types = ["D3","Google"];
        const options = types.map((t) => {
            var highlight = classNames(
                "waves-effect waves-light",
                "chip",
                {'teal lighten-2 grey-text text-lighten-4': current==t}
            );
            return (
                <li key={t}
                    className={highlight}
                    onClick={setGraphEngine.bind(null,t)}>
                       {t}
                </li>
            );
        });

        return (
          <div>
            <h5>Engine</h5>
            <div className="divider"></div>
            <ul>
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
      // Reformat query data to datatable consumable forms.
      var data = this._updateGraphData(this.props.data);

      // Chart options
      var options = {
        title: this.props.title,
        subtitle: this.props.footer,
        legend: "bottom",
        width: "100%",
        height: 500,
        backgroundColor: "transparent", // Must have!
        chartArea:{
          width: "100%",
          height: "80%"
        }
      };

      // Render chart
      this.chart = new google.visualization.ChartWrapper({
        chartType: this._mapChartType(),
        dataTable: this._updateGraphData(this.props.data),
        options: options,
        containerId: this.props.containerId
      });
      this.chart.draw();
    },
    _mapChartType: function(){
      // Map container box GraphType state values to Google chart types
      switch(this.props.graphType){
        case 'bar':
          return 'ColumnChart';
        case 'line':
          return 'LineChart';
      }
    },
    _updateGraphData: function(data){
      // Return a new Google Datatable
      var d = d3.nest()
        .key(function(d){return d.year})
        .key(function(d){return d.category})
        .entries(data);

      // Get all categories. This is necessary so we can handle
      // missing values. Otherwise, there will be row
      // that has less values than the number of columns.
      var categories = _.keys(_.countBy(data, function(item){
        return item.category;
      }));

      // Convert format from a flat two-dimension array
      // to a table with columns: year, category 1, category 2, ...
      var datatable = new Array();
      _.forEach(d, function(byYear){
        var year = byYear.key;
        var values = [];

        var byCategory = _.groupBy(byYear.values, function(item){
          return item.key;
        });

        _.forEach(categories, function(cat){
          if (byCategory.hasOwnProperty(cat)){
            _.forEach(byCategory[cat], function(item){
              _.forEach(item.values, function(val){
                values.push(val.value);
              })
            });
          }else{
            values.push(null);
          }
        });
        datatable.push(_.flatten([year,values]));
      });

      // Convert formatted data to google DataTable
      categories.unshift('Year');
      var formattedData = {
        categories: categories,
        datatable: datatable
      };

      // Create a new data table
      var myDataTable = new google.visualization.DataTable();

      // Data table headers
      _.forEach(formattedData.categories,function(cat){
        if (cat == 'Year'){
          myDataTable.addColumn('string',cat);
        }else {
          myDataTable.addColumn('number',cat);
        }
      });

      // Data table data
      myDataTable.addRows(formattedData.datatable);

      return myDataTable;
    },
    componentDidMount: function(){
      // Initialize graph
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(this.makeViz);

        // Set up data updater
        var that = this;
        this.debounceUpdate = _.debounce(function(data){
          var datatable = that._updateGraphData(data);
          that.chart.setDataTable(datatable);
          that.chart.draw();
        }, 1000);

        // Set up graph type updater
        this.debounceGraphTypeUpdate = _.debounce(function(type){
          that.chart.setChartType(that._mapChartType(type));
          that.chart.draw();
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
