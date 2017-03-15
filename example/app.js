require('../src/less/input-moment.less');
require('./app.less');

var moment = require('moment');
var React = require('react');
var ReactDOM = require('react-dom');
var InputMoment = require('../src/input-moment');
var packageJson = require('../package.json');

var App = React.createClass({
  displayName: 'App',

  getInitialState() {
    return {
      m1: moment(),
      m2: moment()
    };
  },

  render() {
    return (
      <div className="app">
        <h1>{packageJson.name}</h1>
        <h2>{packageJson.description}</h2>
        <form>
          <div>
            Min
            <div className="input">
              <input
                type="text"
                value={this.state.m1.format('llll')}
                readOnly
                />
            </div>
            <InputMoment
              moment={this.state.m1}
              onChange={this.handleChange}
              onSave={this.handleSave}
              minDate={moment().subtract(1, 'month')}
              maxDate={this.state.m2}
              maxTime={this.state.m2}

              getDayExtraClasses={({ isCurrent, isSelected }) => {
                if (isCurrent && isSelected) {
                  return "day--highlighted";
                }
              }}
            />
          </div>

          <br/>

          <div>
            Max
            <div className="input">
              <input
                type="text"
                value={this.state.m2.format('llll')}
                readOnly
                />
            </div>
            <InputMoment
              moment={this.state.m2}
              onChange={this.handleChange2}
              onSave={this.handleSave}
              minDate={this.state.m1}
              minTime={this.state.m1}
              maxDate={moment().add(2, 'month')}
              />
          </div>

        </form>
      </div>
    );
  },

  handleChange(m) {
    this.setState({ m1: m });
  },

  handleChange2(m) {
    this.setState({ m2: m });
  },

  handleSave() {
    console.log('saved');
  }
});

ReactDOM.render(<App/>, document.getElementById('app'));
