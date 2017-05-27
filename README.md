# react-onboarder

### Installation

```bash
npm install react-onboarder
```

### Demo

TODO: DEMO GOES HERE

### Example

TODO: Finish Example

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

    );
  }
}
```

#### Highlighter
| Property | Type    | Default Value | Description |
| -------- | ----    | ------------- | ----------- |
| delay    | Number  | 0             | Amount of time to delay the highlight on react component load. |
| show     | Boolean | true          | Boolean to run the child highlights. If false, will show what's inside each Highlight but won't actually run the highlights. |

#### Highlight
| Property  | Type   | Default Value | Description |
| --------  | ----   | ------------- | ----------- |
| step      | Number | 0             | The queue for when a the highlight goes off. |
| time      | Number | undefined     | The amount of time (in milliseconds) that the highlight will show. `undefined` or `null` creates an infinite highlight. |
| className | String | undefined     | Adding additional classes for when the highlight occurs. Will not exist before and after the highlight step occurs. |
| style     | Object | undefined     | Adding additional style for when the highlight occurs. Will not exist before and after the highlight step occurs. |

