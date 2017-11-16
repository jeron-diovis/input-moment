var cx = require('classnames');
var React = require('react');

// ---

module.exports = class Day extends React.Component {

  constructor(props) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }

  render() {
    var {
      isSelected, isCurrent, isActive,
      isPrevMonth, isNextMonth,
      moment, Content,
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
      <td className={cn} onClick={this.onClick}>
        <Content {...this.props}>{moment.date()}</Content>
      </td>
    );
  }


  onClick() {
    var { isActive, onClick, moment } = this.props;
    if (isActive && onClick) {
      onClick(moment);
    }
  }
}
