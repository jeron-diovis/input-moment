var cx = require('classnames');
var React = require('react');

// ---

module.exports = React.createClass({
  displayName: 'Day',

  render() {
    var { isCurrent, isActive, isPrevMonth, isNextMonth, moment } = this.props;

    var cn = cx('day', {
      'day--prev-month': isPrevMonth,
      'day--next-month': isNextMonth,
      'day--active': isActive,
      'day--current': isActive && isCurrent // unavailable day can't be active
    });

    return (
      <td {...this.props} className={cn} onClick={this.onClick}>{moment.date()}</td>
    );
  },


  onClick() {
    var { isActive, onClick, moment } = this.props;
    if (isActive && onClick) {
      onClick(moment);
    }
  }
});
