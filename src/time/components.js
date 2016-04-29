var React = require('react');
var InputSlider = require('react-input-slider');

var Hours = React.createClass({

  propTypes: {
    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  render() {
    var { min, max, value, className } = this.props;
    return (
      <div className={className}>
        <div className="time-text">Hours:</div>
        <InputSlider
          className="u-slider-time"
          xmax={max}
          xmin={min}
          x={value}
          onChange={this.onChange}
        />
      </div>
    );
  },

  onChange(pos) {
    var { onChange } = this.props;
    onChange && onChange(pos.x);
  }
});


var Minutes = React.createClass({

  propTypes: {
    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired
  },

  render() {
    var { min, max, value, className } = this.props;
    return (
      <div className={className}>
        <div className="time-text">Minutes:</div>
        <InputSlider
          className="u-slider-time"
          xmax={max}
          xmin={min}
          x={value}
          onChange={this.onChange}
        />
      </div>
    );
  },

  onChange(pos) {
    var { onChange } = this.props;
    onChange && onChange(pos.x);
  }
});


var Display = React.createClass({

  propTypes: {
    moment: React.PropTypes.object.isRequired
  },

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
});


module.exports.Hours = Hours;
module.exports.Minutes = Minutes;
module.exports.Display = Display;