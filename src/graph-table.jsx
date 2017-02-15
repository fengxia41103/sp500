import React from 'react';

var _ = require('lodash');
var classNames = require('classnames');
//import WayPoint from 'react-waypoint';

var randomId = function() {
  return "MY" + (Math.random() * 1e32).toString(12);
};

//****************************************
//
//    Common graph containers
//
//****************************************

var GraphDatatable = React.createClass({
  render: function() {
    const headers = this.props.unifiedData.categories.map((h) => {
      return (
        <th key={randomId()}>
          {h}
        </th>
      )
    });
    const fields = this.props.unifiedData.datatable.map((rows) => {
      var randomKey = randomId();
      const values = rows.map( (val) => {
        return (
          <td key={randomId()}>
            {val}
          </td>
        );
      });
      return (
        <tr key={randomKey}>
          {values}
        </tr>
      );
    });

    return (
      <div>
        <figure id={this.props.containerId}>
          <figcaption>{this.props.title}</figcaption>
          <table className="table table-responsive table-striped">
            <thead>
              <th>Year</th>
              {headers}
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

module.exports = GraphDatatable;
