var cx = require('classnames');
var moment = require('moment');
var React = require('react');
var Calendar = require('./date');
var Time = require('./time');

import * as DefaultTimeComponents from "./time/components";

module.exports = React.createClass({
  displayName: 'InputMoment',

  getInitialState() {
    return {
      tab: 0
    };
  },

  getDefaultProps() {
    return {
      prevMonthIcon: 'ion-ios-arrow-left',
      nextMonthIcon: 'ion-ios-arrow-right',
      TimeHoursControl: DefaultTimeComponents.Hours,
      TimeMinutesControl: DefaultTimeComponents.Minutes,
      TimeDisplay: DefaultTimeComponents.Display
    };
  },

  render() {
    var tab = this.state.tab;
    var m = this.props.moment;

    return (
      <div className="m-input-moment">
        <div className="options">
          <button type="button" className={cx('ion-calendar im-btn', {'is-active': tab === 0})} onClick={this.handleClickTab.bind(null, 0)}>
            Date
          </button>
          <button type="button" className={cx('ion-clock im-btn', {'is-active': tab === 1})} onClick={this.handleClickTab.bind(null, 1)}>
            Time
          </button>
        </div>

        <div className="tabs">
          <Calendar
            className={cx('tab', {'is-active': tab === 0})}
            moment={m}
            onChange={this.onChange}
            min={this.props.minDate}
            max={this.props.maxDate}
            prevMonthIcon={this.props.prevMonthIcon}
            nextMonthIcon={this.props.nextMonthIcon}
          />
          <Time
            className={cx('tab', {'is-active': tab === 1})}
            moment={m}
            onChange={this.onChange}
            min={this.props.minTime}
            max={this.props.maxTime}
            Hours={this.props.TimeHoursControl}
            Minutes={this.props.TimeMinutesControl}
            Display={this.props.TimeDisplay}
          />
        </div>

        <button type="button" className="im-btn btn-save ion-checkmark"
          onClick={this.handleSave}>
          Save
        </button>

        {this.renderInput()}
      </div>
    );
  },

  renderInput() {
    var { name, serializeFormat } = this.props;
    if (name) {
      return (
        <input ref="input" type="hidden" name={name} value={this.props.moment.format(serializeFormat)} />
      );
    }
  },

  handleClickTab(tab, e) {
    e.preventDefault();
    this.setState({ tab });
  },

  handleSave(e) {
    e.preventDefault();
    if (this.props.onSave) this.props.onSave();
  }
});
