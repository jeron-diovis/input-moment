var cx = require('classnames');
var React = require('react');
var moment = require('moment');
var InputSlider = require('react-input-slider');

var fitRange = ([ min, max ], x) => Math.max(Math.min(x, max), min);

module.exports = React.createClass({
  displayName: 'Time',

  propTypes: {
    moment: React.PropTypes.object.isRequired,
    max: React.PropTypes.object.isRequired,
    min: React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      moment: moment(),
      max: moment("23:59", "HH:mm"),
      min: moment("00:00", "HH:mm")
    };
  },

  render() {
    var m = this.props.moment;

    return (
      <div className={cx('m-time', this.props.className)}>
        <div className="showtime">
          <span className="time">{m.format('HH')}</span>
          <span className="separater">:</span>
          <span className="time">{m.format('mm')}</span>
        </div>

        <div className="sliders">
          <div className="time-text">Hours:</div>
          <InputSlider
            className="u-slider-time"
            xmin={this.getMinHour()}
            xmax={this.getMaxHour()}
            x={m.hour()}
            onChange={this.changeHours}
          />

          <div className="time-text">Minutes:</div>
          <InputSlider
            className="u-slider-time"
            xmin={this.getMinMinute()}
            xmax={this.getMaxMinute()}
            x={m.minute()}
            onChange={this.changeMinutes}
          />
        </div>
      </div>
    );
  },

  changeHours(pos) {
    var m = this.props.moment;
    m.hours(parseInt(pos.x, 10));
    this.fit(m);
    this.props.onChange(m);
  },

  changeMinutes(pos) {
    var m = this.props.moment;
    m.minutes(parseInt(pos.x, 10));
    this.fit(m);
    this.props.onChange(m);
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
    m.hours(this.fitHours(m.hours()));
    m.minutes(this.fitMinutes(m.minutes()));
    return m;
  },

  fitHours(value) {
    return fitRange([ this.getMinHour(), this.getMaxHour() ], value);
  },

  fitMinutes(value) {
    return fitRange([ this.getMinMinute(), this.getMaxMinute() ], value);
  }
});
