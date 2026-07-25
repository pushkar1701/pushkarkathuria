export const flightCopy = {
  title: "Career Flight",
  hangarTitle: "Hangar",
  hangarBody: "Pick a sky and a craft, then launch the career arcade.",
  launch: "Launch",
  land: "Land",
  cancel: "Cancel",
  endlessOn: "Endless on",
  endlessOff: "Endless",
  endlessHint: "Endless · Cancel anytime",
  skyLabel: "Sky",
  craftLabel: "Craft",
  ctaHero: "Take Career Flight",
  ctaExperience: "Fly this route",
  footerAria: "Take a flight along my career path",
  desktopOnly:
    "This easter egg is built for keyboard - try it on desktop.",
  reducedMotionTitle: "Career route",
  creditsTitle: "Career route complete",
  creditsBody: "You cleared the path - rings, debris, and every stop along the way.",
  keepFlying: "Keep flying",
  contact: "Contact",
  resume: "Resume",
  controlsHint: "WASD / arrows · Shift throttle · Esc cancel",
  scoreLabel: "Score",
  comboLabel: "Combo",
  progress: (visited: number, total: number) => `${visited}/${total}`,
} as const;

/** Arcade scoring */
export const flightArcade = {
  ringPoints: 50,
  companyPoints: 500,
  comboStep: 0.15,
  comboMax: 3,
  hitPenalty: 120,
  stunMs: 700,
} as const;
