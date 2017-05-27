import React from 'react';
import { shallow, mount } from 'enzyme';

import Onboarder from '../src/Onboarder';
import Onboard from '../src/Onboard';

describe("ReactOnboarder", () => {
  afterEach(() => {
    document.getElementById("onboarder-overlay").remove();
  });

  describe("with the onboarder-overlay div", () => {
    it("renders the overlay with default values", () => {
      const rendered = shallow(<Onboarder />);
      const overlay = document.getElementById("onboarder-overlay");
      expect(overlay.style.getPropertyValue("display")).toBe("none");
      expect(overlay.style.getPropertyValue("background")).toBe("rgba(0, 0, 0, 0.3)");
      expect(overlay).toBeDefined();
    });

    it("renders the overlay with custom values of color and alpha", () => {
      const rendered = shallow(<Onboarder color="00ff00" alpha="0.6" />);
      const overlay = document.getElementById("onboarder-overlay");
      expect(overlay.style.getPropertyValue("display")).toBe("none");
      expect(overlay.style.getPropertyValue("background")).toBe("rgba(0, 255, 0, 0.6)");
      expect(overlay).toBeDefined();
    });
  });

  xit("renders the components", () => {
    const rendered = mount(
      <Onboarder>
        <Onboard step={0}>
          <div id="test">This is a test</div>
        </Onboard>
      </Onboarder>
    );
    expect(rendered).toBeDefined();
  });
});