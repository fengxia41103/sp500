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
            graphType: type
        }
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

        // Render graph by chart type
        if (graphType === "pie"){
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
                            {this.props.countryCode}
                        </h3>
                        <GraphBox containerId={containerId}
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
        } else if (graphType === "table"){
            return (
            <div>
                <h3>
                    {this.props.countryCode}
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
                    {this.props.countryCode}
                </h3>

                <GraphTypeBox
                    current={this.state.graphType}
                    setGraphType={this.setGraphType}
                    {...this.props} />

                <GraphBox containerId={containerId}
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
        var options = types.map(function(t){
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

var GraphBox = React.createClass({
    makeViz: function(){
        var config = {
            "id": "category",
            "color": "category",
            "text": "text",
            "legend": false,
            "y": "value",
            "x": "year",
            "time": "year",
            "size": this.props.graphType=="line"?"":"value",
            "shape": {
                 interpolate: "basis"
            },
            "footer": {
                position: "top",
                value: this.props.footer
            }
        };

        // Draw graph
        this.viz = d3plus.viz()
            .container("#"+this.props.containerId)
            .config(config)
            .data(this.props.data)
            .type(this.props.graphType)
            .draw();
    },
    componentDidMount: function(){
        // Initialize graph
        this.makeViz();

        // Set up data updater
        var that = this;
        this.debounceUpdate = _.debounce(function(data){
            that.viz.data(data);
            that.viz.draw();
        }, 500);

        // Set up graph type updater
        this.debounceGraphTypeUpdate = _.debounce(function(type){
            that.viz.type(type);
            that.viz.size(type=="line"?"":"value");
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

        // If type changed
        var currentType = this.props.graphType && this.props.graphType.valueOf();
        if (currentType != null && this.preType !== currentType){
            this.preType = currentType;

            // Update graph data
            if (this.viz && this.debounceGraphTypeUpdate){
                this.debounceGraphTypeUpdate(this.props.graphType);
            }
        }

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
        var fields = this.props.data.map(function(d){
            var randomKey = randomId();
            return (
                <tr key={randomKey}><td>
                    {d.text}
                </td><td>
                    {d.year}
                </td><td>
                    {d.value}
                </td></tr>
            );
        });

        return (
        <div>
            <figure id={this.props.containerId}>
                <figcaption>{this.props.title}</figcaption>
            <table className="table table-responsive table-striped">
                <tbody>
                {fields}
                </tbody>
            </table>
            </figure>
        </div>
        );
    }
});

module.exports = GraphFactory;
