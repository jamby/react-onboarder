import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { overlayId } from './helpers';

export default class Overlay extends Component {
  static propTypes = {
    alpha: PropTypes.string.isRequired,
    blue: PropTypes.number.isRequired,
    green: PropTypes.number.isRequired,
    red: PropTypes.number.isRequired
  }

  componentWillUnmount() {
    this._overlay.removeAttribute("onclick");
  }

  render() {
    const { red, green, blue, alpha } = this.props;
    return (
      <div
        id={overlayId()}
        ref={(i) => this._overlay = i}
        style={{
          position: "fixed",
          background: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 99998,
          display: "block"
        }}
      />
    );
  }
}