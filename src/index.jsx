import React from 'react';
import AjaxContainer from "./ajax.jsx";

var _ = require('lodash');
var classNames = require('classnames');
var randomId = function(){
    return "MY"+(Math.random()*1e32).toString(12);
};

//****************************************
//
//    Index containers
//
//****************************************

var IndexBox = React.createClass({
    getInitialState: function(){
        return {
            items: [],
            index: "A"
        }
    },
    setIndex: function(letter){
        this.setState({
            index: letter
        });
    },    
    setItems: function(data){
        // Save list items
        this.setState({
            items: this.props.getItems(data)
        });
    },
    render: function(){
        // Get items to list
        if (typeof this.state.items=="undefined" || (this.state.items && this.state.items.length < 1)){
            return (
                <AjaxContainer
                    apiUrl={this.props.indexItemUrl}
                    handleUpdate={this.setItems} />
            );
        }

        // Render
        return (
            <div>
                <IndexList 
                    activeIndex={this.state.index}
                    setIndex={this.setIndex} 
                    {...this.props} />

                <ItemList
                    activeIndex={this.state.index}
                    items={this.state.items}
                    {...this.props} />
            </div>
        );
    }
});

var IndexList = React.createClass({
    render: function(){
        // Build A-Z index
        var indexes = this.props.indexes;
        var activeIndex = this.props.activeIndex;
        var setIndex = this.props.setIndex;
        var isIndexActive = this.props.isIndexActive;

        var theList = indexes.map(function(letter){
            var active = classNames(
                "waves-effect waves-light",
                {"active": isIndexActive(activeIndex, letter)}
            );

            // Index can be numbers, so prepend an arbitrary letter
            var anchor = "#XYZ-"+letter;

            // Render
            return (
                <li key={letter}
                    className={active}
                    onClick={setIndex.bind(null,letter)}>
                       <a href={anchor}>{letter}</a>
                </li>
            );
        });

        // Render
        return (
            <div>
                <nav>
                    <div className="nav-wrapper">
                    <ul className="right hide-on-med-and-down">
                        {theList}
                    </ul>
                    </div>
                </nav>

                <div className="fixed-action-btn click-to-toggle"
                    style={{bottom:"20vh"}}>
                    <a className="btn-floating btn-large blue accent-4">
                        <i className="fa fa-bars"></i>
                    </a>
                    <ul>
                        {theList}
                    </ul>
                </div>
            </div>
        );
    }
});

var ItemList = React.createClass({
    render: function(){
        var activeIndex = this.props.activeIndex;
        var setItem = this.props.setItem;
        var activeItem = this.props.activeItem;
        var isItemActive = this.props.isItemActive;
        var itemMapToIndex = this.props.itemMapToIndex;
        var getItemValue = this.props.getItemValue;
        var getItemRender = this.props.getItemRender;

        var fields = this.props.items.map(function(c){
            var itemClass = classNames(
                'chip',
                {'teal lighten-2 grey-text text-lighten-4': isItemActive(activeItem, c)}
            );
            var tmpIndex = itemMapToIndex(c);
            if (tmpIndex == activeIndex){
                var randomKey = randomId();
                var val = getItemValue(c);
                var item = getItemRender(c);

                return (
                    <div key={randomKey} className={itemClass}>
                        <span onClick={setItem.bind(null,val)}>
                            {item}
                        </span>
                    </div>
                );
            }
        });

        return (
            <div>
                <h3 id={activeIndex}>{activeIndex}</h3>
                {fields}
                <div className="divider"></div>
            </div>
        );
    }
});

module.exports = IndexBox;
