// header.js
import React from "react";

require("./stylesheets/header.sass");


var Header = React.createClass({
  render () {
    return (
      <div className="btn myhighlight">
        My Header
      </div>
    );
  }
});

module.exports = Header;
