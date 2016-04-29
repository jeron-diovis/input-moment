var cx = require('classnames');
var React = require('react');
var moment = require('moment');
var noop = require('lodash/noop');

import { copyDate, copyWithZeroDate } from "../utils";

module.exports = React.createClass({
  displayName: 'Time',

  propTypes: {
    Hours: React.PropTypes.func,
    Minutes: React.PropTypes.func,
    Display: React.PropTypes.func,

    moment: React.PropTypes.object.isRequired,
    max: React.PropTypes.object.isRequired,
    min: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      Hours: noop,
      Minutes: noop,
      Display: noop,

      moment: moment(),
      min: moment("00:00", "HH:mm"),
      max: moment("23:59", "HH:mm")
    };
  },

  render() {
    var { Hours, Minutes, Display } = this.props;
    var m = this.m_value;

    return (
      <div className={cx('m-time', this.props.className)}>
        <Display
          className="m-time__display"
          moment={m}
        />

        <div className="m-time__controls">
          <Hours
            className="m-time__hours"
            min={this.getMinHour()}
            max={this.getMaxHour()}
            value={m.hour()}
            onChange={this.onChangeHours}
          />

          <Minutes
            className="m-time__minutes"
            min={this.getMinMinute()}
            max={this.getMaxMinute()}
            value={m.minute()}
            onChange={this.onChangeMinutes}
          />
        </div>
      </div>
    );
  },

  onChangeHours(pos) {
    var m = this.m_value;
    m.hours(parseInt(pos, 10));
    this._emitChange(m);
  },

  onChangeMinutes(pos) {
    var m = this.m_value;
    m.minutes(parseInt(pos, 10));
    this._emitChange(m);
  },

  _emitChange(m) {
    this.fit(m);
    this.props.onChange(copyDate(m.clone(), this.props.moment));
  },

  getMaxHour() {
    return this.props.max.hour();
  },

  getMinHour() {
    return this.props.min.hour();
  },

  getMaxMinute() {
    var { moment, max } = this.props;
    return moment.hour() === max.hour() ? max.minute() : 59;
  },

  getMinMinute() {
    var { moment, min } = this.props;
    return moment.hour() === min.hour() ? min.minute() : 0;
  },

  fit(m) {
    var { m_min: min, m_max: max } = this;
    m.set(moment.max(moment.min(m, max), min).toObject());
    return m;
  },

  // ---

  componentWillMount() {
    this.m_value = moment();
    this.m_min = moment();
    this.m_max = moment();
    this._adopt(this.props)
  },

  componentWillReceiveProps(props) {
    this._adopt(props);
  },

  _adopt(props) {
    if (props.moment != null) {
      copyWithZeroDate(this.m_value, props.moment);
    }
    if (props.min != null) {
      copyWithZeroDate(this.m_min, props.min);
    }
    if (props.max != null) {
      copyWithZeroDate(this.m_max, props.max);
    }
  }
});
