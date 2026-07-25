export const flightCopy = {
  title: "Career Flight",
  land: "Land",
  cancel: "Cancel",
  endlessOn: "Endless on",
  endlessOff: "Endless",
  endlessHint: "Endless · Cancel anytime",
  footerAria: "Take a flight along my career path",
  desktopOnly:
    "This easter egg is built for keyboard - try it on desktop.",
  reducedMotionTitle: "Career route",
  creditsTitle: "Career route complete",
  creditsBody: "You flew the path from where I started to where I am now.",
  keepFlying: "Keep flying",
  contact: "Contact",
  resume: "Resume",
  controlsHint: "WASD / arrows · Shift throttle · Esc cancel",
  progress: (visited: number, total: number) => `${visited}/${total}`,
} as const;
