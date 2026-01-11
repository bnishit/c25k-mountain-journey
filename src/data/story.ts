// The Mountain Journey - Story Data

export interface Camp {
  week: number
  name: string
  elevation: number // 0-100
  theme: string
  message: string
  milestone?: string
}

export const CAMPS: Camp[] = [
  { week: 1, name: 'Base Camp', elevation: 0, theme: 'Beginning', message: 'Every summit begins with a single step', milestone: 'Your journey begins' },
  { week: 2, name: 'The Trail', elevation: 11, theme: 'Finding rhythm', message: "You're finding your footing" },
  { week: 3, name: 'First Vista', elevation: 22, theme: 'Looking back', message: "Look how far you've already come", milestone: 'First 3-minute run' },
  { week: 4, name: 'The Meadow', elevation: 33, theme: 'Calm before climb', message: 'Rest here. Gather your strength.' },
  { week: 5, name: 'The Ascent', elevation: 44, theme: 'Breakthrough', message: "The mountain tests you. You're ready.", milestone: 'First 20-minute run' },
  { week: 6, name: 'Above the Clouds', elevation: 56, theme: 'Clarity', message: 'You can see the summit now' },
  { week: 7, name: 'Final Ridge', elevation: 67, theme: 'Endurance', message: "The air is thinner. You're stronger.", milestone: '25 minutes non-stop' },
  { week: 8, name: 'The Push', elevation: 78, theme: 'Almost there', message: 'Every step counts now' },
  { week: 9, name: 'The Summit', elevation: 100, theme: 'Victory', message: "You stand at the top. You're a runner.", milestone: '30 minutes - 5K runner' },
]

export function getCamp(week: number): Camp {
  return CAMPS.find(c => c.week === week) || CAMPS[0]
}

// Future Vision messages - what's coming
export const FUTURE_VISION: Record<number, string[]> = {
  1: [
    "Today you run 60 seconds at a time. In 9 weeks, you'll run 30 minutes straight.",
    "This is Week 1. By Week 9, walking breaks will be a distant memory.",
    "Right now, 60 seconds feels like a lot. Soon, 30 minutes will feel like home.",
  ],
  2: [
    "You're running 90 seconds now. In 7 weeks, that'll be 30 minutes.",
    "Each workout is building something. You'll see it soon.",
    "The summit is 21 workouts away. You've already taken the first steps.",
  ],
  3: [
    "3-minute runs this week. In 6 weeks, you'll run 30 minutes without stopping.",
    "You're a third of the way there. The view keeps getting better.",
    "Look up. The summit is closer than it looks.",
  ],
  4: [
    "5-minute runs are coming. Then 8. Then 20. Then 30.",
    "Halfway to the summit. The hardest climbing is behind you.",
    "In 5 weeks, you'll be a runner. That's not far.",
  ],
  5: [
    "This week you run 20 minutes straight. You're becoming a runner.",
    "The summit is 12 workouts away. Every one matters.",
    "After this week, you'll never doubt yourself again.",
  ],
  6: [
    "25 minutes next week. You can already taste the summit.",
    "9 workouts left. The end is visible now.",
    "You've run 20 minutes. 30 is just a little more.",
  ],
  7: [
    "28 minutes next week. Then 30. Then forever.",
    "6 workouts to the summit. You're so close.",
    "Two more weeks. You can almost touch it.",
  ],
  8: [
    "30 minutes next week. That's 5K. That's the summit.",
    "3 workouts left. The summit is right there.",
    "One more week. You've already done the hard part.",
  ],
  9: [
    "This is it. 30 minutes. The summit.",
    "You're about to become a runner. Permanently.",
    "The view from the top is waiting for you.",
  ],
}

// Present Acknowledgment messages - where you are now
export const PRESENT_ACKNOWLEDGMENT: Record<number, string[]> = {
  1: [
    "Everyone starts at Base Camp. You're already ahead by being here.",
    "Week 1 is the bravest week. You showed up.",
    "The first step is always the hardest. You've taken it.",
  ],
  2: [
    "Week 2. You came back. That's what matters.",
    "Your body is starting to adapt. You might not feel it yet, but it is.",
    "Most people don't make it past Week 1. You did.",
  ],
  3: [
    "Week 3. You're past the hardest part.",
    "Look back at Base Camp. That was you, 2 weeks ago.",
    "You're running 3 minutes at a time. That's real progress.",
  ],
  4: [
    "The Meadow. A moment of calm before the real climb.",
    "Week 4. Your consistency is building something.",
    "You're not the same person who started at Base Camp.",
  ],
  5: [
    "The Ascent. This is where runners are made.",
    "Halfway to the summit. Look how far you've come.",
    "Week 5. The mountain is testing you. You're passing.",
  ],
  6: [
    "Above the Clouds. You can see the summit from here.",
    "Week 6. Your body knows how to run now.",
    "The hardest weeks are behind you. This is the reward.",
  ],
  7: [
    "Final Ridge. The air is thinner. You're stronger.",
    "Week 7. You've been running for nearly two months.",
    "Look down at the clouds. You're above them now.",
  ],
  8: [
    "The Push. Almost there. Every step counts.",
    "Week 8. One week stands between you and the summit.",
    "You've come too far to stop now. And you won't.",
  ],
  9: [
    "The Summit. You made it.",
    "Week 9. You're a runner now. Permanently.",
    "Look back at the journey. Look at who you've become.",
  ],
}

// Post-workout celebration messages
export const POST_WORKOUT: string[] = [
  "Another step closer to the summit.",
  "The mountain knows your name now.",
  "Rest well, climber. Tomorrow, we continue.",
  "You showed up. That's what separates you.",
  "One more climb complete. Well done.",
  "The summit is closer than yesterday.",
  "You're building something that lasts.",
  "Today's work becomes tomorrow's strength.",
]

// Milestone messages (special moments)
export const MILESTONES: Record<string, string> = {
  'first_workout': "The first step is always the bravest. You've taken it.",
  'week_1_complete': "Base Camp secured. The journey has truly begun.",
  'first_3min_run': "You just ran 3 minutes. You've never done that before.",
  'halfway': "Halfway to the summit. Look how far you've come.",
  'first_20min_run': "Twenty minutes. No stopping. You're a runner now.",
  'week_8_complete': "One week to the summit. You can almost touch it.",
  'final_workout': "You stand at the summit. You did what most never will.",
}

// Time-of-day messages
export function getTimeOfDayMessage(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 10) {
    return "The mountain is quiet. Perfect for climbing."
  } else if (hour >= 10 && hour < 16) {
    return "The sun is high. Let's make progress."
  } else if (hour >= 16 && hour < 21) {
    return "End the day with a climb."
  } else {
    return "Night climb. Bold move."
  }
}

// Get a random message from an array
export function getRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)]
}

// Get contextual message based on current progress
export function getMotivationalMessage(week: number, _day: number, _completedWorkouts: number): {
  futureVision: string
  presentAcknowledgment: string
} {
  const futureMessages = FUTURE_VISION[week] || FUTURE_VISION[1]
  const presentMessages = PRESENT_ACKNOWLEDGMENT[week] || PRESENT_ACKNOWLEDGMENT[1]

  return {
    futureVision: getRandomMessage(futureMessages),
    presentAcknowledgment: getRandomMessage(presentMessages),
  }
}

// Calculate workouts remaining to summit
export function getWorkoutsRemaining(week: number, day: number): number {
  const totalWorkouts = 27 // 9 weeks × 3 days
  const completed = (week - 1) * 3 + (day - 1)
  return totalWorkouts - completed
}

// Calculate projected summit date
export function getProjectedSummitDate(week: number, day: number): string {
  const remaining = getWorkoutsRemaining(week, day)
  // Assume 3 workouts per week = about 2.3 days between workouts on average
  const daysRemaining = Math.ceil(remaining * 2.3)
  const summitDate = new Date()
  summitDate.setDate(summitDate.getDate() + daysRemaining)
  return summitDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Journey-themed voice phrases
export const VOICE_PHRASES = {
  run: [
    "Time to climb. Start running.",
    "Push forward. You've got this.",
    "Ascend. Run now.",
    "The summit calls. Start running.",
    "Climb higher. Run.",
  ],
  walk: [
    "Good work. Rest your legs.",
    "Recover. Walking now.",
    "You've earned this rest.",
    "Catch your breath. Keep moving.",
    "Rest your legs. Good job.",
  ],
  warmup: [
    "Let's begin the climb. Start walking.",
    "Warm up your legs. The ascent awaits.",
  ],
  cooldown: [
    "Cool down. You've earned this.",
    "Walk it out. Great climb today.",
  ],
  halfway: [
    "Halfway there. Keep climbing.",
    "You're doing great. Stay steady.",
    "Push through. The summit is waiting.",
  ],
  complete: [
    "Summit step complete. You crushed it.",
    "Another camp reached. Well done.",
    "The mountain is proud of you today.",
    "Incredible climb. Rest well.",
  ],
}
