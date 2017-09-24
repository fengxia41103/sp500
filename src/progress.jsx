import React from 'react';

var ProgressBox = React.createClass({
  render: function(){
    return (
      <div className="progress col l6 m6 s12">
        <div className="indeterminate"></div>
      </div>
    );
  }
});

module.exports = ProgressBox;
