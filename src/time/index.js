var cx = require('classnames');
var React = require('react');
var moment = require('moment');

var noop = () => {};

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
      moment: m,
      Hours, Minutes, Display
    } = this.props;

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
            onChange={this.changeHours}
          />

          <Minutes
            className="m-time__minutes"
            min={this.getMinMinute()}
            max={this.getMaxMinute()}
            value={m.minute()}
            onChange={this.changeMinutes}
          />
        </div>
      </div>
    );
  },

  changeHours(pos) {
    var m = this.props.moment;
    m.hours(parseInt(pos, 10));
    this.fit(m);
    this.props.onChange(m);
  },

  changeMinutes(pos) {
    var m = this.props.moment;
    m.minutes(parseInt(pos, 10));
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
    var { min, max } = this.props;
    m.set(moment.max(moment.min(m, max), min).toObject());
    return m;
  }
});
