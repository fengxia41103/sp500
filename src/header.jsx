// header.js
import React from "react";

require("./stylesheets/header.sass");


var Header = React.createClass({
  render () {
    return (
      <div className="myheader">
      <div className="container">
        <h1>World Snapshot</h1>
            <p>Make . Life . Better</p>
      </div>
      </div>
    );
  }
});

module.exports = Header;
