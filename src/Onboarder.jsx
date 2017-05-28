import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hexRgb from 'hex-rgb';

import { eventId } from './helpers';

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
    onbUnsubscribe: PropTypes.func,
    onbUpdateStep: PropTypes.func
  }

  constructor() {
    super();
    this.onbUpdateStep = this.onbUpdateStep.bind(this);
    this.onbSubscribe = this.onbSubscribe.bind(this);
    this.onbUnsubscribe = this.onbUnsubscribe.bind(this);
    this.stopOnboarder = this.stopOnboarder.bind(this);

    this.subscribers = [];
    this.state = { step: 0, max: 0, stopped: true };
  }

  getChildContext() {
    return {
      onbSubscribe: this.onbSubscribe,
      onbUnsubscribe: this.onbUnsubscribe,
      onbUpdateStep: this.onbUpdateStep
    };
  }

  componentWillMount() {
    const { alpha, color, delay } = this.props;
    const rgbColor = hexRgb(color);
    let el = document.createElement("div");
    el.id = "onboarder-overlay";
    el.style.cssText = `
      background: rgba(${rgbColor[0]}, ${rgbColor[1]}, ${rgbColor[2]}, ${alpha});
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99998;
      display: none;
    `;
    document.body.appendChild(el);
    setTimeout(() => {
      this.setState({ stopped: false });
    }, this.props.delay);
  }

  componentDidUpdate(prevProps, prevState) {
    const node = document.getElementById('onboarder-overlay');
    if (this.props.show && this.state.stopped === false) {
      if (this.state.step >= this.state.max) {
        node.removeAttribute("onclick");
        this.stopOnboarder();
        this.removeOverlay();
      } else if (this.state.step !== this.state.max) {
        node.style.display = "block";
        this.notifySubscribers(this.subscribers[this.state.step]);
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

  onbUnsubscribe(handler) {
    this.subscribers = this.subscribers.filter((current) => current !== handler);
  }

  removeOverlay() {
    document.getElementById("onboarder-overlay").remove();
  }

  stopOnboarder() { this.setState({ stopped: true }); }

  notifySubscribers(subscriber) {
    const evt = new Event(eventId(this.state.step));
    window.dispatchEvent(evt);
  }

  render() {
    return (
      <div ref={(i) => this._node = i}>
        {this.props.children}
      </div>
    );
  }
}