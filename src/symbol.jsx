import React from 'react';
import IndexBox from "./index.jsx";

var _ = require('lodash');
var classNames = require('classnames');

//****************************************
//
//    Symbol containers
//
//****************************************
var SymbolBox = React.createClass({
  render: function() {
    // Index list
    var indexes = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");

    // API endpoint to get list of items
    // HEADER: Symbole,Name,Sector
    var indexItemUrl = "/downloads/constituents.csv";

    // Data are items retrieved from API.
    // Depending on its format, we are to extract
    // the actual items to list.
    var getItems = function(data) {
      return data;
    };

    // Determine an index is active
    var isIndexActive = function(activeIndex, i) {
      return activeIndex && activeIndex === i;
    };

    // Determine an item is active
    var isItemActive = function(activeItem, i) {
      return activeItem && i.Symbol == activeItem;
    };

    // Map a list item to index for grouping
    var itemMapToIndex = function(i) {
      return i.Symbol.charAt(0);
    };

    // Item value
    var getItemValue = function(i) {
      //return i.Symbol;
      return i.Symbol;
    }

    // Item render display
    var getItemRender = function(i) {
      return (
        <div>
          {i.Symbol} ({i.Name})
        </div>
      );
    }

    // Render
    return (
      <div >
        <IndexBox indexes = {indexes}
                  indexItemUrl = {indexItemUrl}
                  getItems = {getItems}
                  isIndexActive = {isIndexActive}
                  isItemActive = {isItemActive}
                  itemMapToIndex = {itemMapToIndex}
                  getItemValue = {getItemValue}
                  getItemRender = {getItemRender}
                  {...this.props}/>
      </div>
    );
  }
});

module.exports = SymbolBox;
