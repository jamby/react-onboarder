## 0.1.0

* Initial release of React Onboarder
* Includes both Onboarder and Onboard classes
* Each includes context for `onbSubscribe`, `onbUnsubscribe`, `onbUpdateStep`
* Onboarder
  * Ability to customize overlay color and opacity
  * Can add add delay to Onboarder
  * Won't show depending on show prop
  * Sounds out window events when on specific step
* Onboard
  * Can add amount of time for highlight or make it indefinite
  * Can customize step number (defaults to 0)
  * Ability to customize style and classNames, which do not exist before or after step has occurred
  * Clicking while on step causes to go to next step
  * Will scroll to item being in view if adding scroll prop
