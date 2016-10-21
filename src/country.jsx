import React from 'react';
import AjaxContainer from "./ajax.jsx";

var _ = require('lodash');
var classNames = require('classnames');

//****************************************
//
//    Country containers
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

module.exports = CountryBox;
