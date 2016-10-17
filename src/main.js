// main.js
require("materialize-loader");
require("./stylesheets/my.css");

import React from "react";
import ReactDom from "react-dom";
var Header = require("./header");
var Footer = require("./footer");
var RootBox = require("./country.jsx");

var Page = React.createClass({
  render () {
    return (
      <div>
        <RootBox />
        <Header />
        <Footer />
      </div>
    );
  }
});

ReactDom.render(<Page />, document.getElementById("app"));
