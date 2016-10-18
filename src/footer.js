// footer.js
import React from "react";


var Footer = React.createClass({
  render () {
    return (
      <footer className="page-footer">
          <div className="container">
            <div className="row">
            <h5>Data source</h5>
            <ul>
              <li>The World Bank</li>
              <li>USAID</li>
            </ul>
            </div>
          </div>
          <div className="footer-copyright">
            <div className="container">
            <i className="fa fa-copyright"></i>2016 PY Consulting Ltd.
            <a className="grey-text text-lighten-4 right" href="http://fengxia.co">Read more</a>
            </div>
          </div>
      </footer>
    );
  }
});

module.exports = Footer;
