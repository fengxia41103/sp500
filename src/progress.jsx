import React from 'react';

var ProgressBox = React.createClass({
    render: function(){
    return (
           <div className="progress">
               <div className="indeterminate"></div>
           </div>
    );
    }
});

module.exports = ProgressBox;