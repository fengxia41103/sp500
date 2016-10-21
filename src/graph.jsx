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
    render: function(){
        var data = this.props.data;

        // Validate data set
        if (typeof data == "undefined" || data === null || data.length == 0){
            return null;
        }

        // Default type
        var graphType = "";
        if (typeof this.props.type === "undefined" || !this.props.type){
            graphType = "line"; // Catch-all, if graph type is not defined!
        }else{
            graphType = this.props.type;
        }

        // Render graph by chart type
        if (graphType != "pie"){
            // container id
            var containerId = randomId();
            return (
            <div>
                <h3>
                    {this.props.countryCode}
                </h3>
                <GraphBox containerId={containerId}
                    graphType={graphType}
                    {...this.props}
                />
                <div className="divider" />
            </div>
            );
        } else if (graphType === "pie"){
            var graphs = [];
            var data = this.props.data;

            // Regroup by year
            var tmp = {};
            for (var i=0; i<data.length;i++){
                var year = data[i].name;
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
        }

        // Default
        return null;
    }
});

var GraphBox = React.createClass({
    makeViz: function(){
        var config = {
            "id": "category",
            "color": "category",
            "text": "category",
            "legend": false,
            "y": "value",
            "x": "name",
            "time": "name",
            "size": this.props.graphType=="line"?"":"value",
            "shape": {
                 interpolate: "basis"
            },
            "footer": {
                position: "top",
                value: "Data source: USAID DHS Program"
            }
        };

        //
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

module.exports = GraphFactory;
