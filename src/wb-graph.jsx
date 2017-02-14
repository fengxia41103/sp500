import React from 'react';
import GraphFactory from "./graph.jsx";
import AjaxContainer from "./ajax.jsx";

var _ = require('lodash');

var WbGraphContainer = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      unifiedData: [],
      start: "1960",
      end: "2015"
    }
  },
  getUrl: function(countryCode, indicator) {
    // Build DHS API url
    var baseUrl = "http://api.worldbank.org/v2/en/countries/";
    var tmp = [countryCode, "indicators", indicator].join("/");
    var query = "?date=" + this.state.start + ":" + this.state.end + "&format=json&per_page=1000";
    return baseUrl + tmp + query;
  },
  handleUpdate: function(data) {
    var cleaned = _.concat(this.state.data, this._cleanData(data[1]));
    var unified = this._unifiedData(cleaned);

    this.setState({
      data: cleaned,
      unifiedData: unified
    });
  },
  _cleanData: function(data) {
    // WB data cleanse function.
    // Here we are to normalize API data into a data format
    // that is uniform for consumption internally.
    if (typeof data === "undefined" || data === null) {
      return [];
    } else {
      var tmp = [];
      for (var i = 0; i < data.length; i++) {
        var country = data[i].country.id;

        // Original data can be null or 0,
        // Do NOT skip! Set null to 0.
        var value = 0;
        if (data[i].value !== null) {
          value = parseFloat(data[i].value);
          // Internal data format is a dict.
          tmp.push({
            uniqueKey: country + i,
            country: country,
            year: data[i].date,
            value: value,
            category: country,
            text: [country, data[i].date].join('-') // Label for each data point
          })

        }
      }

      // Sort data by "date" field
      return _.sortBy(tmp, 'year');
    }
  },
  _unifiedData: function(data) {
    // Unifiy data set to fiill null or zero value for missing data.
    // Not all countries have data for all the years. And even available
    // years don't necessarily lineup nicely. So here we convert data array
    // into a two dimensional array with columues:  Year, country A, country B....
    // and each row is value: [Year, country A value, country B value,....].
    // This format was first designed to generate Google datatable for its chart engine.
    // I think it should also be the base format for other engines.
    var d = d3.nest()
              .key(function(d) {
                return d.year
              })
              .key(function(d) {
                return d.category
              })
              .entries(data);

    // Get all categories. This is necessary so we can handle
    // missing values. Otherwise, there will be row
    // that has less values than the number of columns.
    var categories = _.keys(_.countBy(data, function(item) {
      return item.category;
    }));

    // Convert format from a flat two-dimension array
    // to a table with columns: year, category 1, category 2, ...
    var datatable = new Array();
    _.forEach(d, function(byYear) {
      var year = byYear.key;
      var values = [];

      var byCategory = _.groupBy(byYear.values, function(item) {
        return item.key;
      });

      _.forEach(categories, function(cat) {
        if (byCategory.hasOwnProperty(cat)) {
          _.forEach(byCategory[cat], function(item) {
            _.forEach(item.values, function(val) {
              values.push(val.value);
            })
          });
        } else {
          values.push(null);
        }
      });
      datatable.push(_.flatten([year, values]));
    });

    // Catregories: list of countries
    // databable: 2D array, each row is [Year, country A value, contry B value, ...]
    return {
      categories: categories,
      datatable: datatable
    }
  },
  render: function() {
    // If country code changed, update data
    var changed = false;
    var currentValue = this.props.countryCode && this.props.countryCode.valueOf();
    if (currentValue != null && this.preValue !== currentValue) {
      this.preValue = currentValue;

      // Iterate through requested countries
      var indicator = this.props.indicator;
      const ajaxReqs = this.props.countryCode.map((c) => {
        var api = this.getUrl(c, indicator);
        return (
          <AjaxContainer
              key={c}
              handleUpdate={this.handleUpdate}
              apiUrl={api}/>
        );
      });

      return (
        <div>
          {ajaxReqs}
        </div>
      );
    }

    // Render graphs
    var footer = "Source: The World Bank";
    return (
      <div>
        {/* Graph */}
        <GraphFactory
            data={this.state.data}
            unifiedData={this.state.unifiedData}
            footer={footer}
            {...this.props}/>
      </div>
    );
  }
});

module.exports = WbGraphContainer;
