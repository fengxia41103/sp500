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


module.exports =  GraphDatatable;
