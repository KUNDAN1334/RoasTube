import type { Intensity, RoastResult } from "./types";

// Invented roasts for building the UI. Every channel and title here is made up.

const toasty: RoastResult = {
  intensity: "toasty",
  usedTakeout: false,
  profile: { name: "Sam", avatar: null },
  createdAt: "2026-10-16T21:30:00.000Z",
  exhibits: [
    "47% of your likes are under 3 minutes",
    "3 channels hold 38% of your likes",
    "31 liked recipe videos",
  ],
  roast: {
    verdict: "Your algorithm isn't broken. It's just tired of you.",
    roast:
      "Nearly half your likes are under three minutes, so you don't watch videos, you sample them like a raccoon at a buffet. You've liked 18 videos of strangers exploring abandoned malls, from someone who also doesn't go anywhere.",
    brainrotScore: 57,
    brainrotReason: "Short-form heavy, with a documentary alibi.",
    nickname: "The 2am Documentary Tourist",
    personality:
      "Curious about everything, committed to nothing. Knows a lot about deep-sea fish and very little about their own bedtime.",
    redFlags: [
      {
        title: "Shorts with a side of shorts",
        evidence: "47% of your likes are under 3 minutes.",
        severity: 2,
      },
      {
        title: "Three channels, on repeat",
        evidence: "Deep Sea Files, Mall Ghost and Snack Stack hold 38% of your likes.",
        severity: 2,
      },
      {
        title: "Recipes you'll never cook",
        evidence: "31 liked recipe videos. The pan remains spotless.",
        severity: 1,
      },
    ],
    advice: "Cook one of the 31 recipes. Any of them. The pan misses you.",
    shareLine: "My algorithm isn't broken, it's just tired of me. Crispy rated my brainrot Golden.",
  },
};

const extraCrispy: RoastResult = {
  intensity: "extra_crispy",
  usedTakeout: true,
  profile: { name: "Sam", avatar: null },
  createdAt: "2026-10-16T21:30:00.000Z",
  exhibits: [
    "71% of your likes are under 3 minutes",
    "38% of your watching happens between midnight and 4am",
    "One video rewatched 14 times",
  ],
  roast: {
    verdict: "You don't have a watch history. You have a crime scene, and you keep returning to it.",
    roast:
      "71% of your likes are under three minutes, which explains your attention span and nothing about your taste. You rewatched a gas station hot dog review fourteen times. That's the longest commitment you've made all year, and it was to a hot dog.",
    brainrotScore: 89,
    brainrotReason: "71% short-form and a 38% late-night share. The toaster is on fire.",
    nickname: "The Infinite Scroll Goblin",
    personality:
      "Thinks they're curious. Actually watches other people be curious, at 3am, at double speed, with the volume off.",
    redFlags: [
      {
        title: "Allergic to anything over a minute",
        evidence: "The longest thing you liked is a 9-minute “satisfying compilation”.",
        severity: 3,
      },
      {
        title: "3am is prime time",
        evidence: "38% of your watching happens between midnight and 4am.",
        severity: 3,
      },
      {
        title: "Watching people watch things",
        evidence: "Four of your top five channels are reaction channels.",
        severity: 2,
      },
    ],
    advice:
      "Watch one video longer than ten minutes without your phone in your other hand. Start with a microwave timer.",
    shareLine: "Crispy says I don't have a watch history, I have a crime scene. Charcoal, 89/100.",
  },
};

export const FIXTURE_ROASTS: Record<Intensity, RoastResult> = {
  toasty,
  extra_crispy: extraCrispy,
};
