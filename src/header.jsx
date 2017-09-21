// header.js
import React from "react";

require("./stylesheets/header.sass");


var Header = React.createClass({
  render () {
    return (
      <div className="myheader">
        <div className="container text-right">
          <h1>SP500 Snapshot</h1>
          <p>Make . Money . Better</p>
        </div>
      </div>
    );
  }
});

module.exports = Header;
