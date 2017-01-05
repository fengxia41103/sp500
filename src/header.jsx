// header.js
import React from "react";

require("./stylesheets/header.sass");


var Header = React.createClass({
  render () {
    return (
      <div className="myheader">
      <video playsInline autoPlay muted loop poster="/images/polina.jpg" id="bgvid">
             <source src="/downloads/polina.webm" type="video/webm" />
             <source src="/downloads/polina.mp4" type="video/mp4" />
      </video>
      <div className="container">
        <h1>World Snapshot</h1>
            <p>Make . Life . Better</p>
      </div>
      </div>
    );
  }
});

module.exports = Header;
