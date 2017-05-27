import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class Onboard extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
    className: PropTypes.string,
    step: PropTypes.number,
    style: PropTypes.object,
    time: PropTypes.number
  }

  static defaultProps = {
    step: 0,
    time: undefined
  }

  static contextTypes = {
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    updateStep: PropTypes.func
  }

  constructor() {
    super();
    this.updateStep = this.updateStep.bind(this);
    this.highlightChild = this.highlightChild.bind(this);
  }

  componentDidMount() {
    this.context.subscribe(this);
    window.addEventListener('onboard' + this.props.step ? `step-${this.props.step}` : '', this.highlightChild);
  }

  componentWillUnmount() {
    window.removeEventListener('onboard' + this.props.step ? `step-${this.props.step}` : '', this.highlightChild);
  }

  updateStep() {
    const { style } = this.props;
    this.context.updateStep();
    this._node.style = null;
    if (style) { // If styles exist, keep track of user defined style
      Object.keys(style).map((styleKey) => this._node.style[`${styleKey}`] = style[styleKey]);
    }
    this._node.removeAttribute("onclick"); // Don't want that onclick to do anything
    // Don't want any more event listeners for this component
    window.removeEventListener('onboard' + this.props.step ? `step-${this.props.step}` : '', this.highlightChild);
  }

  highlightChild() {
    const { time } = this.props;
    this._node.style.zIndex = "99999";
    this._node.style.position = "relative";
    this._node.style.borderRadius = "5px";

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
    const childrenWithProps = React.cloneElement(children, {
      className: `${children.props.className} ${className}`,
      style: { ...children.props.style, ...style },
      ref: (i) => { this._node = i; }
    });

    return childrenWithProps;
  }
}