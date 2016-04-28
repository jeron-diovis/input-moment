var cx = require('classnames');
var moment = require('moment');
var React = require('react');

// ---

module.exports = React.createClass({
  displayName: 'Day',

  render() {
    var { i, w, d } = this.props;

    var { prevMonth, nextMonth } = checkMonth(w, i);
    var isEnabled = this.isEnabled();

    var cn = cx('day', {
      'day--prev-month': prevMonth,
      'day--next-month': nextMonth,
      'day--current': !prevMonth && !nextMonth && (i === d),
      'day--active': isEnabled,
      'day--inactive': !isEnabled
    });

    return (
      <td className={cn} {...this.props} onClick={this.onClick}>{i}</td>
    );
  },


  onClick() {
    if (!this.isEnabled()) {
      return;
    }
    var { onClick } = this.props;
    onClick && onClick(this.m_value);
  },

  // ---

  componentWillMount() {
    this.m_value = moment();
    this._adopt(this.props);
  },

  componentWillReceiveProps(props) {
    this._adopt(props);
  },

  _adopt(props) {
    var { m_value } = this;
    var { w, i, m } = props;
    this.m_value.set(m.toObject());
    applyOffset(w, i, m_value);
  },

  isEnabled() {
    var m = this.m_value;
    var { min, max, exclude } = this.props;
    return isValid(min, max, exclude, m);
  }
});

// ---

function checkMonth(week, day) {
  return {
    prevMonth: week === 0 && day > 7,
    nextMonth: week >= 4 && day <= 14
  };
}

function applyOffset(week, day, m) {
  var { prevMonth, nextMonth } = checkMonth(week, day);
  m.date(day);
  if (prevMonth) m.subtract(1, 'month');
  if (nextMonth) m.add(1, 'month');
  return m;
}

function isValid(min, max, exclude, m) {
  if (exclude) {
    if (exclude.some(x => m.isSame(x))) {
      return false;
    }
  }

  if (min && max) {
    return m.isBetween(min, max, null, '[]');
  }

  if (min) {
    return m.isSameOrAfter(min);
  }

  if (max) {
    return m.isSameOrBefore(max);
  }

  return true;
}
