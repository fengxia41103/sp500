import React from 'react';
var _ = require('lodash');

//****************************************
//
//    Common HTMLGetter  containers
//
//****************************************
var HTMLGetterContainer = React.createClass({
    getInitialState: function(){
        return {
            loading: false
        }
    },
    getData: function(){
        if (this.state.loading){
            return null;
        }else{
            this.setState({
                loading: true
            });
        }

        // Get data
        var api = this.props.apiUrl;
        var handleUpdate = this.props.handleUpdate;
        console.log("Getting: "+api);

        // Work horse
        fetch(api)
        .then(function(resp){
            return resp.text();
        }).then(function(body){
            if ((typeof body != "undefined") && body){
                handleUpdate(body);
            }
        }).catch(function(error){
        });
    },
    componentWillMount: function(){
        this.debounceGetData = _.debounce(function(){
            this.getData();
        }, 200);
    },
    render: function(){
        // Get data
        if (!this.state.loading && this.debounceGetData){
            this.debounceGetData();
        }
        return (
           // Progress bar
           <div className="progress">
              <div className="indeterminate"></div>
           </div>
        );
    }
});

module.exports = HTMLGetterContainer;
