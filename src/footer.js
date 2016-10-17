// footer.js
import React from "react";

require("./stylesheets/footer.sass");
//require("stylesheets/utilities/clearfix.sass");

var Footer = React.createClass({
  render () {
    return (
      <div className="footer u-clearfix">
        Footer
      </div>
    );
  }
});

module.exports = Footer;
