# React Onboarder

[![Circle CI](https://circleci.com/gh/jamby/react-onboarder.svg?style=shield&circle-token=:circle-token)](https://circleci.com/gh/jamby/react-onboarder)
[![Code Climate](https://codeclimate.com/github/jamby/react-onboarder.png)](https://codeclimate.com/github/jamby/react-onboarder)

Have you ever wanted to onboard your users to new features?

This module was built just for that. Say you've added a newly made feature that you want to draw attention to. With this module, we can create multiple "steps" to show off that feature, and it creates an overlay so you don't have to! If your item is lower on the page, we can now automatically scroll to where your feature exists.

## Table of Contents

* [Installation](#installation)
* [Example](#example)
* [API](#api)
* [Gotchas](#gotchas)
* [Contributions](#contributions)
* [License](#license)

## Installation

```bash
yarn add react-onboarder

# Or if not using yarn:
npm install react-onboarder
```

## Example

```javascript
import React from 'react';
import { Onboarder, Onboard } from 'react-onboarder';

class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <Onboarder delay={3000}>
          <Main />
        </Onboarder>
      </div>
    );
  }
}

class Main extends React.Component {
  render() {
    return (
      <div>
        <div className="jumbotron">
          <h1>Hello, world!</h1>
          <p>...</p>
          <Onboard step={0}>
            <p><a className="btn btn-primary btn-lg" role="button">Learn more</a></p>
          </Onboard>
        </div>
        {/* Assume we have a list of items */}
        <ul className="list-group">
          {items.map(this.renderItem)}
        </ul>
      </div>
    );
  }

  renderItem(item, index) {
    // We need to make sure we only show the Onboards for the first items, not ALL the items.
    if (index === 0) {
      return (
        <li className="list-group-item" key={item.name}>
          {item.name}
          <div className="pull-right">
            <Onboard step={1}>
              <a className="btn btn-default" role="button">Edit</a>
            </Onboard>
            <Onboard step={2}>
              <a className="btn btn-danger" role="button">Delete</a>
            </Onboard>
          </div>
        </li>
      );
    } else {
      return (
        <li className="list-group-item" key={item.name}>
          {item.name}
          <div className="pull-right">
            <a className="btn btn-default" role="button">Edit</a>
            <a className="btn btn-danger" role="button">Delete</a>
          </div>
        </li>
      );
    }
  }
}
```

## API

### Onboarder Props
| Property | Type    | Default Value | Description |
| -------- | ----    | ------------- | ----------- |
| alpha    | String  | "0.3"         | The amount of transparency for the overlay that is shown. Min is 0, max is 1.0. (CSS RGBA values) |
| color    | String  | "000000"      | The hex value of the color for the overlay that is shown. (CSS RGBA values) |
| delay    | Number  | 0             | Amount of time to delay the highlight on react component load. |
| show     | Boolean | true          | Boolean to run the child highlights. If false, will show what's inside each Highlight but won't actually run the highlights. |

### Onboard Props
| Property  | Type    | Default Value | Description |
| --------  | ----    | ------------- | ----------- |
| step      | Number  | 0             | The queue for when a the highlight goes off. |
| time      | Number  | undefined     | The amount of time (in milliseconds) that the highlight will show. `undefined` or `null` creates an infinite highlight. |
| scroll    | Boolean | false         | Boolean to automatically scroll the item into the viewport. |
| className | String  | undefined     | Adding additional classes for when the highlight occurs. Will not exist before and after the highlight step occurs. |
| style     | Object  | undefined     | Adding additional style for when the highlight occurs. Will not exist before and after the highlight step occurs. |

## Gotchas

Some items will not seem to be "highlighted". This is because the highlight really only takes into account the current item's CSS attributes. So if an item's `background-color` is buried back into multiple parents, then it will not show up. This is why you can add your own custom `className` or `style` to the item you're trying to highlight, which will make it be shown to your users.

## Contributions

Contributors are welcome! Anything to help this project get used more and more, new features or bug fixes are always welcome. Submit a PR or an issue and we can discuss what you're planning on doing.

`yarn build` will build the files and to use it locally in your projects.

To use this project locally, just `npm link` while inside this folder, and then `npm link react-onboarder` inside the project you want to use it in, along with the `yarn build`, and everything should work properly!

Be sure to write tests and make sure the linter doesn't complain.

## License

[MIT](https://github.com/jamby/react-onboarder/blob/master/LICENSE.md)