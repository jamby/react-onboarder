import React, { Component } from 'react';
import PropTypes from 'prop-types';
import zenscroll from 'zenscroll';

import { eventId } from './helpers';

export default class Onboard extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    className: PropTypes.string,
    scroll: PropTypes.bool,
    step: PropTypes.number,
    style: PropTypes.object,
    time: PropTypes.number
  }

  static defaultProps = {
    scroll: false,
    step: 0,
    time: undefined
  }

  static contextTypes = {
    onbSubscribe: PropTypes.func,
    onbUnsubscribe: PropTypes.func,
    onbUpdateStep: PropTypes.func
  }

  constructor() {
    super();
    this.unsubscribe = this.unsubscribe.bind(this);
    this.updateStep = this.updateStep.bind(this);
    this.highlightChild = this.highlightChild.bind(this);
    this.state = { running: false };
  }

  componentDidMount() {
    this.context.onbSubscribe(this);
    window.addEventListener(eventId(this.props.step), this.highlightChild);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe() {
    // Don't want any more event listeners for this component
    this.context.onbUnsubscribe(this);
    window.removeEventListener(eventId(this.props.step), this.highlightChild);
  }

  updateStep() {
    const { style } = this.props;
    this.context.onbUpdateStep();
    this._node.style = null;
    if (style) { // If styles exist, keep track of user defined style
      Object.keys(style).map((styleKey) => this._node.style[`${styleKey}`] = style[styleKey]);
    }
    this._node.removeAttribute("onclick"); // Don't want that onclick to do anything
    this.unsubscribe();
    this.setState({ running: false });
  }

  highlightChild() {
    const { scroll, time } = this.props;
    this.setState({ running: true });
    if (scroll) zenscroll.intoView(this._node); // Only scroll to item if scroll prop is added

    // If a time exists, set the timeout to get rid of it.
    const timeExists = Number.isInteger(time);
    let updateStepTimeout = null;
    if (timeExists) {
      updateStepTimeout = setTimeout(() => {
        this.updateStep(this._node);
      }, time);
    }

    // Set some onclicks to clear the timeout and update the step
    document.getElementById("onboarder-overlay").onclick = () => {
      clearTimeout(updateStepTimeout);
      this.updateStep();
    };

    this._node.onclick = () => {
      clearTimeout(updateStepTimeout);
      this.updateStep();
    };
  }

  render() {
    const { children, style, className, ...rest } = this.props;
    if (this.state.running === false) {
      return React.cloneElement(children, { ref: (i) => { this._node = i; } });
    }

    const newProps = {
      className: `${children.props.className || ''} ${className || ''}`.trim(),
      style: { ...children.props.style, ...style, ...{ zIndex: "99999", position: "relative" } },
      ref: (i) => this._node = i
    };
    if (newProps.className.length === 0) delete newProps.className;

    const childrenWithProps = React.cloneElement(children, newProps);

    return childrenWithProps;
  }
}