import React from 'react';

var _ = require('lodash');
var classNames = require('classnames');
var randomId = function() {
 return "MY" + (Math.random() * 1e32).toString(12);
};

var FormInput = React.createClass({
  handleChange: function(event) {
    var text = event.target.value;
    this.props.onChange(this.props.id, text);
  },
  render: function(){
    var inputStyle = {
      float: "left"
    };

    // default data type is "number"
    var datatype = this.props.datatype?this.props.datatype:"number";
    var input = null;
    var pattern = "["+this.props.options.split(",").join("|")+"]";
    switch(datatype){
      case "number":
        var negativeHighlight = this.props.value > 0 ? "": "myhighlight";
        var max = this.props.max? this.props.max:"";
        var min = this.props.min? this.props.min:"0";
        var step = this.props.step? this.props.step: "1";

        input = (
          <input type="number"
                 className={negativeHighlight}
                 placeholder={this.props.value}
                 max={max} min={min} step={step}
                 value={this.props.value}
                 onChange={this.handleChange} />
        );
        break;

      default:
        input = (
          <input type="text"
                 className="validate"
                 placeholder={this.props.value}
                 value={this.props.value}
                 pattern={pattern}
                 onChange={this.handleChange} />
        );
        break;
    }

    return (
      <div className="input-field col s6">
        <label className="active">
          {this.props.label}
        </label>
        {input}
       </div>
    );
  }
});
var FormValueDisplay = React.createClass({
  render: function(){
    var negativeHighlight = this.props.value >= 0 ? "": "myhighlight";

    return (
      <div className="input-field col s6">
        <label className="active">
          {this.props.label}
        </label>
        <input disabled type="number"
               className="{negativeHighlight}"
               value={this.props.value.toFixed(2)} />
      </div>
    );
  }
});

var FormHeader = React.createClass({
  handleClick: function(event) {
    this.props.handleClick();
  },
  render: function(){
    var switchClass = classNames("fa", {
      "fa-angle-double-up": this.props.showFields,
      "fa-angle-double-down": !this.props.showFields
    });

    return (
      <div className="row my-resume-header"
           onClick={this.handleClick}>
        <div className="col s11">
          <h4 className="nocount">{this.props.title}</h4>
        </div>
        <div  className="right-align col s1"
              data-toggle="tooltip"
              title="Click to expand and collapse">
          <br />
          <i className={switchClass}></i>
        </div>
      </div>
    );
  }
});


var AssumptionBox = React.createClass({
  render: function(){
    if (typeof this.props.fields == "undefined"){
      return null;
    }

    // Render when there is assumptions
    var fields = this.props.fields.map(function(field){
      var value = parseFloat(field.value).toFixed(2);
      var negativeHighlight = value >= 0 ? "": "myhighlight";

      return (
        <tr><td>
          {field.label}
        </td><td>
          <span className={negativeHighlight}>
            {value}
          </span>
        </td></tr>
      );
    });

    if (fields.length>0){
      var id = randomId();
      return (
        <div>
          <h6 className="myhighlight nocount">
            Assumptions
          </h6>
          <table className="table bordered striped highlgiht">
            <tbody>
              <tr>
                <th>Item</th>
                <th>Value</th>
              </tr>
              {fields}
            </tbody>
          </table>
        </div>
      );
    }
    return null;
  }
});

var FormBox = React.createClass({
  getInitialState: function(){
    return {showFields: false};
  },
  handleClick: function(){
    this.setState({
      showFields: !this.state.showFields, // toggle
    });
  },
  render: function(){
    // Input fields
    var formFields = [];
    if (typeof this.props.data.fields != "undefined"){
      formFields = this.props.data.fields.map(function(field) {
        // This is the magic line to make the state update
        // in sync with parent's state
        field.onChange = this.props.onChange;

        field.id = field.name;
        return <FormInput key={field.name}
                          {...field} />
      }, this);
    }
    // Value displays
    var valueFields = [];
    if (typeof this.props.data.values != "undefined"){
      valueFields = this.props.data.values.map(function(field) {
        field.id = field.name;
        return <FormValueDisplay key={field.name}
                                 {...field} />
      }, this);
    }

    // All fields
    var fields = this.state.showFields?(
      <div>
        <p></p>
        <h6 className="myhighlight nocount">
          Adjustments
        </h6>
        <div style={{marginBottom:"2em"}}
             className="row">
          {valueFields}
          {formFields}
        </div>
      </div>
    ): null;


    var assumptions = this.state.showFields?
                      <AssumptionBox fields={this.props.data.assumptions} />:null;

    // Render
    return (
      <div>
        <FormHeader title={this.props.data.title}
                    showFields={this.state.showFields}
                    handleClick={this.handleClick} />

        {assumptions }
        {fields}
      </div>
    );
  }
});

module.exports = FormBox;
