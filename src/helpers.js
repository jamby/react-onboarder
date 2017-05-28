export function eventId(step) {
  return 'onboard' + step ? `step-${step}` : '';
}