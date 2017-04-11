var cx = require('classnames');
var React = require('react');
var moment = require('moment');
var noop = require('lodash/noop');

import { copyDate, fitRange } from "../utils";

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
    var {
      Hours, Minutes, Display,
      msgHoursSelect,
      msgMinutesSelect,
    } = this.props;
    var m = this.m_value;

    return (
      <div className={cx('m-time', this.props.className)}>
        <Display
          className="m-time__display"
          moment={m}
        />

        <div className="m-time__controls">
          <Hours
            label={msgHoursSelect}
            className="m-time__hours"
            min={this.getMinHour()}
            max={this.getMaxHour()}
            value={m.hour()}
            onChange={this.onChangeHours}
          />

          <Minutes
            label={msgMinutesSelect}
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
    var hours = parseInt(pos, 10);
    if (hours !== m.hours()) {
      m.hours(hours);
      this._emitChange(m);
    }
  },

  onChangeMinutes(pos) {
    var m = this.m_value;
    var minutes = parseInt(pos, 10);
    if (minutes !== m.minutes()) {
      m.minutes(minutes);
      this._emitChange(m);
    }
  },

  _emitChange(m) {
    this.fit(m);
    var { onChange, moment } = this.props;
    onChange && onChange(copyDate(m.clone(), moment));
  },

  getMaxHour() {
    var { max, moment } = this.props;
    return moment.dayOfYear() === max.dayOfYear() ? max.hour() : 23;
  },

  getMinHour() {
    var { min, moment } = this.props;
    return moment.dayOfYear() === min.dayOfYear() ? min.hour() : 0;
  },

  getMaxMinute() {
    var { moment, max } = this.props;
    return (moment.dayOfYear() === max.dayOfYear() && moment.hour() === max.hour()) ? max.minute() : 59;
  },

  getMinMinute() {
    var { moment, min } = this.props;
    return (moment.dayOfYear() === min.dayOfYear() && moment.hour() === min.hour()) ? min.minute() : 0;
  },

  fit(m) {
    m.set({
      hour: fitRange(this.getMinHour(), this.getMaxHour(), m.hour()),
      minute: fitRange(this.getMinMinute(), this.getMaxMinute(), m.minute())
    });
    return m;
  },

  // ---

  componentWillMount() {
    this.m_value = moment();
    this._adopt(this.props)
  },

  componentWillReceiveProps(props) {
    this._adopt(props);
  },

  _adopt(props) {
    if (props.moment != null) {
      // Timezone info seems to be stored in native Date object inside moment.
      // It can't be changed, so need to recreate it entirely,
      // otherwise it leads to strange glitches during manipulations.
      if (this.m_value.format("Z") !== props.moment.format("Z")) {
        this.m_value = props.moment.clone();
      } else {
        this.m_value.set(props.moment.toObject());
      }
    }
  }
});
