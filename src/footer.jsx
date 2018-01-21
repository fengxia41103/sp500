// footer.js
import React from "react";


var Footer = React.createClass({
  render () {
    return (
      <footer className="page-footer blue-grey darken-2">
        <div className="container">
          <h5>Data source</h5>
          <ul>
            <li>
              <a href="https://www.alphavantage.co/documentation/">
                Alpha Vantage
              </a>
            </li>
          </ul>
        </div>
        <div className="footer-copyright">
          <div className="container">
            <i className="fa fa-copyright"></i>2018 PY Consulting Ltd.
            <span className="grey-text text-lighten-4 right">
              Made by <a href="http://fengxia.co">Feng Xia</a> @
              <a href="https://github.com/fengxia41103/sp500">source</a>
            </span>
          </div>
        </div>
      </footer>
    );
  }
});

module.exports = Footer;
