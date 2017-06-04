export function prefix() {
  return "__react-onboarder";
}

export function eventId(step) {
  return `${prefix()}-${(step ? `step-${step}` : '')}`;
}

export function overlayId() {
  return `${prefix()}-overlay`;
}