import React from 'react';
import ProgressBox from "./progress.jsx";

var _ = require('lodash');
var classNames = require('classnames');

var randomId = function() {
  return "CH" + (Math.random() * 1e32).toString(12);
};

var IFrameBox = React.createClass({
  getInitialState: function(){
    return {
      loaded: false
    }
  },
   _iframeOnLoad: function(){
     this.setState({
       loaded: true
     });
   },
  render: function() {
    return (
    <div>
      {!this.state.loaded?<ProgressBox />:null}
      <iframe src={this.props.src} frameBorder="0" scrolling="no" seamless="true" height="500px" width="100%" onLoad={this._iframeOnLoad}/>
    </div>
    );
  }

});

var WordcloudBox = React.createClass({
   render: function() {
     var src = "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query="+this.props.activeCountry.name+"&output=wordcloud&outputtype=native";

     // Render content
     return (
       <div>
         <h3>{this.props.activeCountry.iso2Code}</h3>
         <figure style={{minHeight:"500px"}}>
         <figcaption>
           GDELT the most popular theme in the last 24 hours
         </figcaption>

         <IFrameBox src={src}/>
         </figure>
       </div>
    );
  }
});

var NewsImageBox = React.createClass({
   render: function() {
     var src = "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query="+this.props.activeCountry.name+"&output=artimgonlycollage&outputtype=theme";

     // Render content
     return (
       <div>
         <IFrameBox src={src}/>
       </div>
    );
  }
});


var ToneTimelineBox = React.createClass({
   render: function() {
     var src = "http://api.gdeltproject.org/api/v1/search_ftxtsearch/search_ftxtsearch?query="+this.props.activeCountry.name+"&output=timeline&outputtype=tone";

     // Render content
     return (
       <div>
         <h3>{this.props.activeCountry.iso2Code}</h3>
         <figure style={{minHeight:"500px"}}>
         <figcaption>
           GDELT tone timeline
         </figcaption>
         <IFrameBox src={src}/>

         </figure>
       </div>
    );
  }
});

var GDELTBox = React.createClass({
  render: function(){
    const clouds = this.props.activeItem.map((c) => {
      return (
      <div>
        <div className="row">
          <div className="col s8">
            <WordcloudBox
               key={c.name}
               activeCountry={c}/>
        </div><div className="col s4">
            <NewsImageBox
               key={c.name}
               activeCountry={c}/>
        </div></div>
        <div className="divider"></div>

        <ToneTimelineBox
           key={c.name}
           activeCountry={c}/>
      </div>
      );
    });

    return (
      <div>
        {clouds}
        <div className="divider"></div>
      </div>
    );
  }
});

module.exports = GDELTBox;
