import React from 'react';
import AjaxContainer from "./ajax.jsx";
import CountryIndex from "./country-index.jsx";

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
                <h3 id={this.props.letter}>{this.props.letter}</h3>
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
            <CountryIndex current={this.state.index}
                setIndex={this.setIndex} />

            <CountryAlphabeticList
                letter={this.state.index}
                countries={this.state.data}
                {...this.props} />
        </div>
        );
    }
});

module.exports = CountryBox;
