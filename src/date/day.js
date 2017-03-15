var cx = require('classnames');
var React = require('react');

// ---

module.exports = React.createClass({
  displayName: 'Day',

  render() {
    var {
      isSelected, isCurrent, isActive,
      isPrevMonth, isNextMonth,
      moment,
      getExtraClasses,
    } = this.props;

    var cn = cx('day', getExtraClasses(this.props), {
      'day--prev-month': isPrevMonth,
      'day--next-month': isNextMonth,
      'day--active': isActive,
      'day--current': isCurrent,
      'day--selected': isActive && isSelected, // unavailable day can't be active
    });

    return (
      <td className={cn} onClick={this.onClick}>{moment.date()}</td>
    );
  },


  onClick() {
    var { isActive, onClick, moment } = this.props;
    if (isActive && onClick) {
      onClick(moment);
    }
  }
});
