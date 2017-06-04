import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import hexRgb from 'hex-rgb';

import Overlay from './Overlay';
import { prefix, eventId, overlayId } from './helpers';

export default class Onboarder extends Component {
  static propTypes = {
    alpha: PropTypes.string,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    color: PropTypes.string,
    delay: PropTypes.number,
    show: PropTypes.bool
  }

  static defaultProps = {
    alpha: "0.3",
    color: "000000",
    delay: 0,
    show: true
  }

  static childContextTypes = {
    onbSubscribe: PropTypes.func,
    onbUpdateStep: PropTypes.func
  }

  constructor() {
    super();
    this.onbUpdateStep = this.onbUpdateStep.bind(this);
    this.onbSubscribe = this.onbSubscribe.bind(this);
    this.stopOnboarder = this.stopOnboarder.bind(this);

    this.subscribers = [];
    this.state = { step: 0, max: 0, stopped: true };
  }

  getChildContext() {
    return {
      onbSubscribe: this.onbSubscribe,
      onbUpdateStep: this.onbUpdateStep
    };
  }

  componentWillMount() {
    if (!document.getElementById(prefix())) { // Check to make sure the prefix exists
      const overlay = document.createElement("div"); // If it doesn't then let's make the div that the Overlay gets mounted onto
      overlay.id = prefix();
      document.body.appendChild(overlay);
    }

    setTimeout(() => {
      this.setState({ stopped: false });
    }, this.props.delay);
  }

  componentDidUpdate(prevProps, prevState) {
    const { show } = this.props;
    const { stopped, step, max } = this.state;
    if (show && stopped === false) {
      if (step >= max) {
        this.stopOnboarder();
        this.removeOverlay();
      } else if (step !== max) {
        if (step === 0) {
          const { alpha, color, delay } = this.props;
          const rgbColor = hexRgb(color);
          ReactDOM.render(<Overlay alpha={alpha} red={rgbColor[0]} green={rgbColor[1]} blue={rgbColor[2]} />, document.getElementById(prefix()));
        }
        this.notifySubscribers(this.subscribers[step]);
      }
    }
  }

  componentWillUnmount() {
    this.removeOverlay();
  }

  onbUpdateStep() { this.setState({ step: this.state.step + 1 }); }

  onbSubscribe(handler) {
    this.subscribers = this.subscribers.concat(handler);
    this.setState({ max: this.subscribers.length });
  }

  removeOverlay() {
    const overlay = document.getElementById(prefix());
    if (overlay) ReactDOM.unmountComponentAtNode(overlay);;
  }

  stopOnboarder() { this.setState({ stopped: true }); }

  notifySubscribers(subscriber) {
    const evt = new Event(eventId(this.state.step));
    window.dispatchEvent(evt);
  }

  render() {
    const { alpha, color, delay } = this.props;
    const rgbColor = hexRgb(color);
    return (
      <div ref={(i) => this._node = i}>
        {this.props.children}
      </div>
    );
  }
}