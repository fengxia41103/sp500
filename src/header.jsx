// header.js
import React from "react";

require("./stylesheets/header.sass");


var Header = React.createClass({
  render () {
    return (
      <div className="myheader blue-grey darken-2">
        <div className="container text-right">
          <h1 className="myhighlight">
            SP500 Snapshot
          </h1>
          <p className="myhighlight">
            Make . Money . Better
          </p>
        </div>
      </div>
    );
  }
});

module.exports = Header;
