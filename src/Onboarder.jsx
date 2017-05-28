import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hexRgb from 'hex-rgb';

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
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    updateStep: PropTypes.func
  }

  constructor() {
    super();
    this.stopOnboarder = this.stopOnboarder.bind(this);
    this.updateStep = this.updateStep.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);

    this.subscribers = [];
    this.state = { step: 0, max: 0, stopped: true };
  }

  getChildContext() {
    return {
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe,
      updateStep: this.updateStep
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
      position: absolute;
      top: 0;
      left: 0;
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
        node.style.display = "none";
        node.removeAttribute("onclick");
        this.stopOnboarder();
      } else if (this.state.step !== this.state.max) {
        node.style.display = "block";
        this.notifySubscribers(this.subscribers[this.state.step]);
      }
    }
  }

  stopOnboarder() { this.setState({ stopped: true }); }

  updateStep() { this.setState({ step: this.state.step + 1 }); }

  subscribe(handler) {
    this.subscribers = this.subscribers.concat(handler);
    this.setState({ max: this.subscribers.length });
  }

  unsubscribe(handler) {
    this.subscribers = this.subscribers.filter((current) => current !== handler);
  }

  notifySubscribers(subscriber) {
    const evt = new Event('onboard' + this.state.step ? `step-${this.state.step}` : '');
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