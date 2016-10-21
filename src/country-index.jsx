import React from 'react';

var classNames = require('classnames');

var CountryIndex = React.createClass({
    render: function(){
        // Build A-Z index
        var alphabet = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split("");
        var current = this.props.current;
        var setIndex = this.props.setIndex;
        var index = alphabet.map(function(letter){
            var highlight = classNames(
                "waves-effect waves-light",
                {"active": current==letter}
            );
            var anchor = "#"+letter;
            return (
                <li key={letter}
                    className={highlight}
                    onClick={setIndex.bind(null,letter)}>
                       <a href={anchor}>{letter}</a>
                </li>
            );
        });

        // Render
        return (
        <div>
            <nav className="hide-on-med-and-down">
                <div className="nav-wrapper">
                <ul className="left">
                    {index}
                </ul>
                </div>
            </nav>

            <div className="fixed-action-btn click-to-toggle"
            style={{bottom:"20vh"}}>
                <a className="btn-floating btn-large light-blue">
                    <i className="fa fa-book"></i>
                </a>
                <ul className="my-multicol-3">
                    {index}
                </ul>
            </div>

        </div>
        );
    }
});

module.exports = CountryIndex;
