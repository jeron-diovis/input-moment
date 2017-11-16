var cx = require('classnames');
var React = require('react');
var moment = require('moment');
var PropTypes = require('prop-types');

var noop = () => {};

import { copyDate, fitRange } from "../utils";

module.exports = class Time extends React.Component {

  static propTypes = {
    Hours: PropTypes.func,
    Minutes: PropTypes.func,
    Display: PropTypes.func,

    moment: PropTypes.object.isRequired,
    max: PropTypes.object.isRequired,
    min: PropTypes.object.isRequired
  }

  static defaultProps = {
    Hours: noop,
    Minutes: noop,
    Display: noop,

    moment: moment(),
    min: moment("00:00", "HH:mm"),
    max: moment("23:59", "HH:mm"),
  }

  constructor(props) {
    super(props)

    this.onChangeHours = this.onChangeHours.bind(this)
    this.onChangeMinutes = this.onChangeMinutes.bind(this)
  }

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
  }

  onChangeHours(pos) {
    var m = this.m_value;
    var hours = parseInt(pos, 10);
    if (hours !== m.hours()) {
      m.hours(hours);
      this._emitChange(m);
    }
  }

  onChangeMinutes(pos) {
    var m = this.m_value;
    var minutes = parseInt(pos, 10);
    if (minutes !== m.minutes()) {
      m.minutes(minutes);
      this._emitChange(m);
    }
  }

  _emitChange(m) {
    this.fit(m);
    var { onChange, moment = this.defaultVal } = this.props;
    onChange && onChange(copyDate(m.clone(), moment));
  }

  getMaxHour() {
    var { moment, max } = this.props;
    return moment.dayOfYear() === max.dayOfYear() ? max.hour() : 23;
  }

  getMinHour() {
    var { moment, min } = this.props;
    return moment.dayOfYear() === min.dayOfYear() ? min.hour() : 0;
  }

  getMaxMinute() {
    var { moment, max } = this.props;
    return (moment.dayOfYear() === max.dayOfYear() && moment.hour() === max.hour()) ? max.minute() : 59;
  }

  getMinMinute() {
    var { moment, min } = this.props;
    return (moment.dayOfYear() === min.dayOfYear() && moment.hour() === min.hour()) ? min.minute() : 0;
  }

  fit(m) {
    m.set({
      hour: fitRange(this.getMinHour(), this.getMaxHour(), m.hour()),
      minute: fitRange(this.getMinMinute(), this.getMaxMinute(), m.minute())
    });
    return m;
  }

  // ---

  componentWillMount() {
    this.m_value = moment();
    this._adopt(this.props)
  }

  componentWillReceiveProps(props) {
    this._adopt(props);
  }

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
}
