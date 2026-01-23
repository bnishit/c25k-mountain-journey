// Everest Base Camp Trek - Story Data

export interface Camp {
  week: number
  name: string
  elevation: number // actual elevation in meters
  elevationPercent: number // 0-100 for progress visualization
  theme: string
  message: string
  milestone?: string
}

export const CAMPS: Camp[] = [
  { week: 1, name: 'Kathmandu', elevation: 1400, elevationPercent: 0, theme: 'The journey begins', message: 'Your adventure starts in the bustling capital', milestone: 'Your trek begins' },
  { week: 2, name: 'Lukla', elevation: 2860, elevationPercent: 12, theme: 'Gateway to Everest', message: 'The famous mountain airstrip awaits', milestone: 'Entered the Khumbu region' },
  { week: 3, name: 'Namche Bazaar', elevation: 3440, elevationPercent: 25, theme: 'Sherpa capital', message: 'The heart of Sherpa culture', milestone: 'First 3-minute run' },
  { week: 4, name: 'Tengboche', elevation: 3867, elevationPercent: 38, theme: 'Monastery in the clouds', message: 'The famous monastery offers blessings for your journey' },
  { week: 5, name: 'Dingboche', elevation: 4410, elevationPercent: 50, theme: 'Acclimatization', message: 'Your body adapts to the thin air', milestone: 'First 20-minute run' },
  { week: 6, name: 'Lobuche', elevation: 4940, elevationPercent: 65, theme: 'Into thin air', message: 'The landscape turns to ice and rock' },
  { week: 7, name: 'Gorak Shep', elevation: 5164, elevationPercent: 78, theme: 'Final settlement', message: 'The last teahouse before base camp', milestone: '25 minutes non-stop' },
  { week: 8, name: 'Everest Base Camp', elevation: 5364, elevationPercent: 90, theme: 'The destination', message: 'You stand where legends begin' },
  { week: 9, name: 'Kala Patthar', elevation: 5545, elevationPercent: 100, theme: 'The view of Everest', message: 'The best view of the highest peak on Earth', milestone: '30 minutes - 5K runner' },
]

export function getCamp(week: number): Camp {
  return CAMPS.find(c => c.week === week) || CAMPS[0]
}

// Future Vision messages - what's coming
export const FUTURE_VISION: Record<number, string[]> = {
  1: [
    "Today you run 60 seconds at a time. In 9 weeks, you'll run 30 minutes straight.",
    "From Kathmandu to Kala Patthar. The journey of 5,545 meters begins now.",
    "Right now, 60 seconds feels like a lot. Soon, you'll be at Everest Base Camp.",
  ],
  2: [
    "You're running 90 seconds now. Namche Bazaar awaits in one week.",
    "Each workout climbs higher. Lukla is just the beginning.",
    "Kala Patthar is 21 workouts away. You've already landed in Lukla.",
  ],
  3: [
    "3-minute runs this week. Tengboche monastery is just ahead.",
    "You've reached the Sherpa capital. The real climb begins.",
    "Look up at the peaks. You're getting closer with every run.",
  ],
  4: [
    "5-minute runs are coming. Then 8. Then 20. Then Everest Base Camp.",
    "The monastery blesses your journey. Dingboche is next.",
    "In 5 weeks, you'll stand at Kala Patthar. Keep climbing.",
  ],
  5: [
    "This week you run 20 minutes straight. You're acclimatizing.",
    "Base Camp is 12 workouts away. Your body is adapting.",
    "After Dingboche, the air gets thinner. But so do the doubts.",
  ],
  6: [
    "25 minutes next week. Gorak Shep is within reach.",
    "9 workouts to Kala Patthar. The end is visible now.",
    "Lobuche marks the final push. You've come so far.",
  ],
  7: [
    "28 minutes next week. Base Camp is almost here.",
    "6 workouts to Kala Patthar. The summit view awaits.",
    "Two more weeks. Everest is right there.",
  ],
  8: [
    "30 minutes next week. That's 5K. That's Kala Patthar.",
    "3 workouts left. You're at Base Camp now.",
    "One more week. The view of Everest awaits.",
  ],
  9: [
    "This is it. 30 minutes. Kala Patthar summit.",
    "You're about to see Everest like few ever will.",
    "The highest view is waiting for you.",
  ],
}

// Present Acknowledgment messages - where you are now
export const PRESENT_ACKNOWLEDGMENT: Record<number, string[]> = {
  1: [
    "Everyone starts in Kathmandu. You're already ahead by being here.",
    "Week 1 is the bravest week. The flight to Lukla is booked.",
    "The first step is always the hardest. You've taken it.",
  ],
  2: [
    "Week 2. You landed in Lukla. That takes courage.",
    "Your body is starting to adapt. You might not feel it yet, but it is.",
    "Most people don't make it past Kathmandu. You did.",
  ],
  3: [
    "Week 3. You're in Namche, the heart of Sherpa country.",
    "Look back at Lukla. That was you, just a week ago.",
    "You're running 3 minutes at a time. That's real progress.",
  ],
  4: [
    "Tengboche. The monastery offers blessings for the climb ahead.",
    "Week 4. Your consistency is building something.",
    "You're not the same person who left Kathmandu.",
  ],
  5: [
    "Dingboche. This is where trekkers become mountaineers.",
    "Halfway to Kala Patthar. Look how far you've come.",
    "Week 5. The altitude is testing you. You're passing.",
  ],
  6: [
    "Lobuche. You can see the ice fields from here.",
    "Week 6. Your body knows how to run now.",
    "The hardest weeks are behind you. The view gets better.",
  ],
  7: [
    "Gorak Shep. The final settlement before Base Camp.",
    "Week 7. You've been trekking for nearly two months.",
    "Look at the peaks around you. You belong here now.",
  ],
  8: [
    "Everest Base Camp. You made it. Almost.",
    "Week 8. Kala Patthar is right there.",
    "You've come too far to stop now. And you won't.",
  ],
  9: [
    "Kala Patthar. The view of Everest. You made it.",
    "Week 9. You're a runner now. Permanently.",
    "Look back at Kathmandu. Look at who you've become.",
  ],
}

// Post-workout celebration messages
export const POST_WORKOUT: string[] = [
  "Another step closer to Everest.",
  "The Himalayas know your name now.",
  "Rest well, trekker. Tomorrow, we climb higher.",
  "You showed up. That's what separates you.",
  "One more day on the trail complete. Well done.",
  "Kala Patthar is closer than yesterday.",
  "You're building something that lasts.",
  "Today's effort becomes tomorrow's altitude.",
]

// Milestone messages (special moments)
export const MILESTONES: Record<string, string> = {
  'first_workout': "The first step is always the bravest. Welcome to Kathmandu.",
  'week_1_complete': "Kathmandu complete. Lukla awaits.",
  'first_3min_run': "You just ran 3 minutes. Namche Bazaar celebrates you.",
  'halfway': "Halfway to Kala Patthar. The air is getting thinner.",
  'first_20min_run': "Twenty minutes. No stopping. You're a trekker now.",
  'week_8_complete': "You're at Base Camp. Kala Patthar is right there.",
  'final_workout': "You stand at Kala Patthar. Everest stretches before you.",
}

// Time-of-day messages
export function getTimeOfDayMessage(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 10) {
    return "The Himalayas are quiet. Perfect for trekking."
  } else if (hour >= 10 && hour < 16) {
    return "The sun is high over the peaks. Let's make progress."
  } else if (hour >= 16 && hour < 21) {
    return "End the day with a trek towards Everest."
  } else {
    return "Night trek. The Sherpas would be impressed."
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

// Journey-themed voice phrases - kept short for natural TTS
export const VOICE_PHRASES = {
  run: [
    "Let's go! Start running.",
    "Run time. You got this.",
    "Time to run!",
    "Here we go. Run!",
    "Push it. Start running.",
  ],
  walk: [
    "Nice work! Walk it out.",
    "Good job. Walking now.",
    "Great effort! Rest up.",
    "Well done. Catch your breath.",
    "Awesome! Time to walk.",
  ],
  warmup: [
    "Let's warm up. Start walking.",
    "Warm up time. Easy pace.",
  ],
  cooldown: [
    "Cool down. Great workout!",
    "Walk it off. You did amazing.",
  ],
  halfway: [
    "Halfway there! Keep going.",
    "You're halfway. Stay strong!",
    "Half done. You got this!",
  ],
  complete: [
    "Workout complete! Amazing job!",
    "You did it! Great work today.",
    "Finished! You crushed it!",
    "Done! Be proud of yourself.",
  ],
}
