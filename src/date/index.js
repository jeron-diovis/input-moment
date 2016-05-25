var React = require('react');
var Day = require('./day');
var cx = require('classnames');
var moment = require('moment');
var range = require('lodash/range');
var chunk = require('lodash/chunk');

var listToGrid = x => chunk(x, 7);

import { copyTime, copyWithZeroTime, isExcluded, isInRange } from "../utils";

// ---

module.exports = React.createClass({
  displayName: 'Calendar',

  getDefaultProps() {
    return {
      moment: moment()
    };
  },

  getInitialState() {
    return {
      displayed: moment().startOf('day')
    };
  },

  render() {
    var m = this.state.displayed;

    return (
      <div className={cx('m-calendar', this.props.className)}>
        <div className="m-calendar__toolbar">
          <button type="button" onClick={this.onPrevMonth}
            className={cx("m-calendar__btn m-calendar__btn-prev-month", { "m-calendar__btn--disabled": !this.isPrevMonthAvailable() })}>
            <i className={this.props.prevMonthIcon}/>
          </button>

          <span className="m-calendar__current-date">{m.format('MMMM YYYY')}</span>

          <button type="button" onClick={this.onNextMonth}
            className={cx("m-calendar__btn m-calendar__btn-next-month", { "m-calendar__btn--disabled": !this.isNextMonthAvailable() })}>
            <i className={this.props.nextMonthIcon}/>
          </button>
        </div>

        <table>
          <thead>
            <tr>
              {this.renderWeekdays()}
            </tr>
          </thead>

          <tbody>
            {this.renderDays()}
          </tbody>
        </table>
      </div>
    );
  },

  renderWeekdays() {
    var weekdays = this.m_weekdays.startOf('week');
    return range(0, 7).map((w, i) => <td key={i}>{weekdays.weekday(w).format('ddd')}</td>);
  },

  renderDays() {
    var current = this.m_current;
    var days = this.m_days;
    var { displayed } = this.state;
    return days.map((row, rowIdx) => (
      <tr key={rowIdx}>
        {row.map(m => (
          <Day key={m.date()}
             moment={m}
             isActive={!this.isExcluded(m) && this.isInRange(m)}
             isCurrent={m.isSame(current)}
             isPrevMonth={m.month() > displayed.month()}
             isNextMonth={m.month() < displayed.month()}
             onClick={this.onSelectDate} />
        ))}
      </tr>
    ));
  },

  // ---

  onSelectDate(date) {
    var { onChange, moment } = this.props;
    onChange && onChange(copyTime(date.clone(), moment));
  },

  onPrevMonth(e) {
    e.preventDefault();
    if (this.isPrevMonthAvailable()) {
      this._updateGrid(this.state.displayed.clone().subtract(1, 'month'));
    }
  },

  onNextMonth(e) {
    e.preventDefault();
    if (this.isNextMonthAvailable()) {
      this._updateGrid(this.state.displayed.clone().add(1, 'month'));
    }
  },

  // ---

  _updateGrid(date) {
    var days = this.m_days;

    generateDaysGrid(date).forEach((row, weekIdx) => {
      row.forEach((dayOfMonth, weekdayIdx) => {
        var isPrevMonth = weekIdx === 0 && dayOfMonth > 7;
        var isNextMonth = weekIdx >= 4 && dayOfMonth <= 14;

        var m_day = days[weekIdx][weekdayIdx].set(date.toObject());
        if (isPrevMonth) m_day.subtract(1, 'month');
        if (isNextMonth) m_day.add(1, 'month');
        m_day.date(dayOfMonth);
      });
    });

    this.setState({ displayed: date });
  },

  isPrevMonthAvailable() {
    return this.isInRange(this.m_days[0][0]);
  },

  isNextMonthAvailable() {
    var row = this.m_days[this.m_days.length - 1];
    var lastDay = row[row.length - 1];
    return this.isInRange(lastDay);
  },

  isInRange(value) {
    var { min, max } = this.props;
    return isInRange(
      min == null ? null : this.m_min,
      max == null ? null : this.m_max,
      value
    );
  },

  isExcluded(value) {
    var { exclude } = this.props;
    return isExcluded(
      exclude == null ? null : this.exclude,
      value
    );
  },

  // ---

  componentWillMount() {
    // preallocate all moment instances we need
    this.m_weekdays = moment();
    this.m_max = moment();
    this.m_min = moment();
    this.m_current = moment();
    this.m_days = listToGrid(range(0, 42).map(() => moment()));
    this.exclude = [];

    this._adopt(this.props);

    this._updateGrid(this.m_current);
  },

  componentWillReceiveProps(props) {
    this._adopt(props);
  },

  _adopt(props) {
    if (props.max != null) {
      copyWithZeroTime(this.m_max, props.max);
    }
    if (props.min != null) {
      copyWithZeroTime(this.m_min, props.min);
    }
    if (props.moment != null) {
      copyWithZeroTime(this.m_current, props.moment);
    }
    if (props.exclude != null) {
      var exclude = [].concat(props.exclude);
      this.exclude = exclude.map(src => copyWithZeroTime(moment(), src));
    }
  }
});

// ---

function generateDaysGrid(m) {
  var d1 = m.clone().subtract(1, 'month').endOf('month').date();
  var d2 = m.clone().date(1).day();
  var d3 = m.clone().endOf('month').date();

  return listToGrid([].concat(
    range(d1-d2+1, d1+1),
    range(1, d3+1),
    range(1, 42-d3-d2+1)
  ));
}
