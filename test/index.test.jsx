import React from 'react';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import Onboarder from '../src/Onboarder';
import Onboard from '../src/Onboard';

describe("ReactOnboarder", () => {
  afterEach(() => {
    document.getElementById("onboarder-overlay").remove();
  });

  describe("with the onboarder-overlay div", () => {
    it("renders the overlay with default values", () => {
      const mocked = shallow(<Onboarder />);
      const overlay = document.getElementById("onboarder-overlay");
      expect(overlay.style.getPropertyValue("display")).toBe("none");
      expect(overlay.style.getPropertyValue("background")).toBe("rgba(0, 0, 0, 0.3)");
      expect(overlay).toBeDefined();
    });

    it("renders the overlay with custom values of color and alpha", () => {
      const mocked = shallow(<Onboarder color="00ff00" alpha="0.6" />);
      const overlay = document.getElementById("onboarder-overlay");
      expect(overlay.style.getPropertyValue("display")).toBe("none");
      expect(overlay.style.getPropertyValue("background")).toBe("rgba(0, 255, 0, 0.6)");
      expect(overlay).toBeDefined();
    });
  });

  it("renders the components with one Onboard", () => {
    const timer = sinon.useFakeTimers();
    const mocked = mount(
      <Onboarder>
        <Onboard step={0}>
          <div id="test">This is a test</div>
        </Onboard>
      </Onboarder>
    );
    expect(mocked).toBeDefined();
    expect(mocked.getNode().subscribers.length).toEqual(1);
    expect(mocked.find("#test").props().style).toBeUndefined();

    timer.tick(1);

    expect(mocked.find("#test").props().style).toEqual({
      zIndex: '99999',
      position: 'relative'
    });
  });

  describe("with multiple Onboards", () => {
    it("sends out proper events and updates state properly", () => {
      const timer = sinon.useFakeTimers();
      const mocked = mount(
        <Onboarder delay={500}>
          <Onboard step={0} time={1000} style={{ backgroundColor: 'blue' }}>
            <div id="test1">This is a test</div>
          </Onboard>
          <Onboard step={1} time={1500} className="onboard-test">
            <div id="test2" className="previous-test-class">This is another test</div>
          </Onboard>
        </Onboarder>
      );

      expect(mocked).toBeDefined();
      expect(mocked.getNode().subscribers.length).toEqual(2); // We should have 2 subscribers
      expect(mocked.state("step")).toEqual(0); // Should start off at 0
      expect(mocked.state("max")).toEqual(2); // 2 max subscribers
      expect(mocked.state("stopped")).toBeTruthy(); // But it should be stopped
      expect(mocked.getNode().subscribers[0].state["running"]).toBeFalsy(); // Both should be not running
      expect(mocked.getNode().subscribers[1].state["running"]).toBeFalsy();
      expect(mocked.find("#test1").props().style).toBeUndefined(); // First child style is not there
      expect(mocked.find("#test2").props().style).toBeUndefined(); // Second child style is not there

      timer.tick(500);

      expect(mocked.find("#test1").props().style.backgroundColor).toBe("blue"); // First child style background now has blue background (from props)
      expect(mocked.find("#test2").props().style).toBeUndefined(); // Second child style should still not exist
      expect(mocked.find("#test2").props().className).toBe("previous-test-class"); // Second child class name should be the original class name
      expect(mocked.state("stopped")).toBeFalsy(); // No longer is stopped
      expect(mocked.state("step")).toEqual(0); // Step is still 1
      expect(mocked.getNode().subscribers[0].state["running"]).toBeTruthy(); // State of subscriber is running

      timer.tick(1000);

      expect(mocked.find("#test1").props().style).toBeUndefined(); // First child style gets returned to normal
      expect(mocked.find("#test2").props().className).toBe("previous-test-class onboard-test"); // Second child class name should have the Onboard class name attached
      expect(mocked.getNode().subscribers[0].state["running"]).toBeFalsy(); // Previous subscriber is no longer running
      expect(mocked.state("stopped")).toBeFalsy(); // Onboarder should still not be stopped
      expect(mocked.state("step")).toEqual(1); // Our step has moved up 1
      expect(mocked.getNode().subscribers[1].state["running"]).toBeTruthy(); // Next subscriber is running

      timer.tick(1500);

      expect(mocked.find("#test2").props().className).toBe("previous-test-class"); // Second child class name should go back to original
      expect(mocked.getNode().subscribers[1].state["running"]).toBeFalsy(); // 2nd subscriber should no longer be running
      expect(mocked.state("stopped")).toBeTruthy(); // Onboarder should now be stopped
      expect(mocked.state("step")).toEqual(2); // Step should be the max of subscribers
    });
  });
});