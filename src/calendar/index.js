var React = require('react');
var Day = require('./Day');
var cx = require('classnames');
var moment = require('moment');
var range = require('lodash/range');
var chunk = require('lodash/chunk');

// ---

module.exports = React.createClass({
  displayName: 'Calendar',

  render() {
    var m = this.m_value;

    return (
      <div className={cx('m-calendar', this.props.className)}>
        <div className="toolbar">
          <button type="button" className="prev-month" onClick={this.prevMonth}>
            <i className={this.props.prevMonthIcon}/>
          </button>

          <span className="current-date">{m.format('MMMM YYYY')}</span>

          <button type="button" className="next-month" onClick={this.nextMonth}>
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
    var m = this.m_value;
    var { min, max, exclude } = this.getRestrictions();

    return chunk(generateDaysSequence(m), 7).map((row, w) => (
      <tr key={w}>
        {row.map((i) =>
          <Day key={i}
            i={i} d={m.date()} w={w} m={m}
            min={min} max={max} exclude={exclude}
            onClick={this.selectDate} />
        )}
      </tr>
    ));
  },

  selectDate(date) {
    this.props.onChange(date);
  },

  prevMonth(e) {
    e.preventDefault();
    this.props.onChange(this.m_value.subtract(1, 'month'));
  },

  nextMonth(e) {
    e.preventDefault();
    this.props.onChange(this.m_value.add(1, 'month'));
  },

  // ---

  componentWillMount() {
    this.m_weekdays = moment();

    this.m_max = moment();
    this.m_min = moment();
    this.m_value = moment();
    this.exclude = [];

    this._adopt(this.props);
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
    if (props.moment  != null) {
      copyWithZeroTime(this.m_value, props.moment);
    }
    if (props.exclude != null) {
      var exclude = [].concat(props.exclude);
      this.exclude = exclude.map(src => copyWithZeroTime(moment(), src));
    }
  },

  getRestrictions() {
    var { min, max, exclude } = this.props;
    return {
      min: min == null ? null : this.m_min,
      max: max == null ? null : this.m_max,
      exclude: exclude == null ? null : this.exclude
    }
  }
});

// ---

function copyWithZeroTime(target, source) {
  return target.set(source.toObject()).startOf('day');
}

function generateDaysSequence(m) {
  var d1 = m.clone().subtract(1, 'month').endOf('month').date();
  var d2 = m.clone().date(1).day();
  var d3 = m.clone().endOf('month').date();

  return [].concat(
    range(d1-d2+1, d1+1),
    range(1, d3+1),
    range(1, 42-d3-d2+1)
  );
}