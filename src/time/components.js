var React = require('react');
var InputSlider = require('react-input-slider');
var PropTypes = require('prop-types');

class Hours extends React.Component {

  static propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  render() {
    var { min, max, value, className, label } = this.props;
    return (
      <div className={className}>
        <div className="time-text">{label}</div>
        <InputSlider
          className="u-slider-time"
          xmax={max}
          xmin={min}
          x={value}
          onChange={this.onChange}
        />
      </div>
    );
  }

  onChange(pos) {
    var { onChange } = this.props;
    onChange && onChange(pos.x);
  }
}


class Minutes extends React.Component {

  static propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  render() {
    var { min, max, value, className, label } = this.props;
    return (
      <div className={className}>
        <div className="time-text">{label}</div>
        <InputSlider
          className="u-slider-time"
          xmax={max}
          xmin={min}
          x={value}
          onChange={this.onChange}
        />
      </div>
    );
  }

  onChange(pos) {
    var { onChange } = this.props;
    onChange && onChange(pos.x);
  }
}


class Display extends React.Component {

  static propTypes = {
    moment: PropTypes.object.isRequired
  }

  render() {
    var { moment: m } = this.props;
    return (
      <div className="showtime">
        <span className="time">{m.format('HH')}</span>
        <span className="separater">:</span>
        <span className="time">{m.format('mm')}</span>
      </div>
    );
  }
}


module.exports.Hours = Hours;
module.exports.Minutes = Minutes;
module.exports.Display = Display;