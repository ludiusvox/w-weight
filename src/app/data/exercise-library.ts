export interface Exercise {
  id: string;
  name: string;
}

export const EXERCISE_LIBRARY = {
  upperBody: [
    { id: 'bench-press', name: 'Bench Press' },
    { id: 'incline-bench-press', name: 'Incline Bench Press' },
    { id: 'decline-bench-press', name: 'Decline Bench Press' },
    { id: 'chest-flys', name: 'Chest Flys' },
    { id: 'bent-over-row', name: 'Bent-Over Row' },
    { id: 'renegade-db-row', name: 'Renegade DB Row' },
    { id: 'lat-pulldown', name: 'Lat Pulldown' },
    { id: 'sledgehammer-swing', name: 'Sledgehammer Swing' },
    { id: 'low-pulley-row', name: 'Low Pulley Row' },
    { id: 'shoulder-press', name: 'Shoulder Press' },
    { id: 'shoulder-scaption', name: 'Shoulder Scaption' },
    { id: 'shoulder-int-rot', name: 'Shoulder Internal Rotation' },
    { id: 'shoulder-ext-rot', name: 'Shoulder External Rotation' },
    { id: 'hyperextension-press', name: 'Hyperextension Press' },
    { id: 'shrug', name: 'Shrug' },
    { id: 'upright-row', name: 'Upright Row' },
    { id: 'lateral-raise', name: 'Lateral Raise' },
    { id: 'front-raise', name: 'Front Raise' },
    { id: 'curl-variations', name: 'Curl Variations' },
    { id: 'preacher-curl', name: 'Preacher Curl' },
    { id: 'triceps-extension', name: 'Triceps Extension' },
    { id: 'triceps-pushdown', name: 'Triceps Pushdown' },
    { id: 'db-jab', name: 'DB Jab' },
    { id: 'db-uppercut', name: 'DB Uppercut' },
    { id: 'db-cross', name: 'DB Cross' },
    { id: 'db-hook', name: 'DB Hook' },
    { id: 'four-way-neck', name: 'Four-Way Neck' },
    { id: 'db-rotation-press', name: 'DB Rotation Press' },
    { id: 'shoulder-to-shoulder-press', name: 'Shoulder-to-Shoulder Press' },
    { id: 'kb-side-press', name: 'KB Side Press' },
    { id: 'wrist-curls', name: 'Wrist Curls' },
    { id: 'reverse-wrist-curls', name: 'Reverse Wrist Curls' },
    { id: 'wrist-roller', name: 'Wrist Roller' },
    { id: 'plate-grab-pinch', name: 'Plate Grab and Pinch Grip' },
    { id: 'pullover', name: 'Pullover' }
  ],
  lowerBody: [
    { id: 'back-squat', name: 'Back Squat' },
    { id: 'front-squat', name: 'Front Squat' },
    { id: 'lunge-multidirectional', name: 'Lunge (Multidirectional)' },
    { id: 'split-squat', name: 'Split Squat' },
    { id: 'lateral-squat', name: 'Lateral Squat' },
    { id: 'box-squat', name: 'Box Squat' },
    { id: 'step-up', name: 'Step-Up' },
    { id: 'jump-squat', name: 'Jump Squat' },
    { id: 'overhead-squat', name: 'Overhead Squat' },
    { id: 'overhead-lunge', name: 'Overhead Lunge' },
    { id: 'good-morning', name: 'Good Morning' },
    { id: 'leg-press', name: 'Leg Press' },
    { id: 'back-extension', name: 'Back Extension / Glute-Ham Raise' },
    { id: 'reverse-hyperextension', name: 'Reverse Hyperextension' },
    { id: 'prone-bent-knee-hip-ext', name: 'Prone Bent-Knee Hip Extension' },
    { id: 'sb-leg-curl', name: 'SB Leg Curl' },
    { id: 'leg-curl', name: 'Leg Curl' },
    { id: 'leg-extension', name: 'Leg Extension' },
    { id: 'toe-raise', name: 'Toe Raise' },
    { id: 'ankle-dorsiflexion', name: 'Ankle Dorsiflexion' },
    { id: 'glute-rope-pull', name: 'Glute Rope Pull' },
    { id: 'hip-thrust-bridge', name: 'Hip Thrust / Bridge' },
    { id: 'wobble-board-squat', name: 'Wobble Board / BOSU Squat' },
    { id: 'band-resisted-step-up', name: 'Band-Resisted Step-Up' },
    { id: 'band-resisted-walk', name: 'Band-Resisted Walk' },
    { id: 'band-resisted-lateral-shuffle', name: 'Band-Resisted Lateral Shuffle' },
    { id: 'hip-adduction', name: 'Hip Adduction' },
    { id: 'hip-abduction', name: 'Hip Abduction' }
  ],
  trunkCore: [
    { id: 'renegade-bar-rotation', name: 'Renegade Bar Rotation' },
    { id: 'db-t-rotation', name: 'DB T-Rotation' },
    { id: 'wheelbarrow-drag', name: 'Wheelbarrow Drag' },
    { id: 'turkish-get-up', name: 'Turkish Get-Up' },
    { id: 'mb-slam-ball-wood-chop', name: 'MB / Slam Ball Wood Chop' },
    { id: 'russian-twist', name: 'Russian Twist' },
    { id: 'sb-exchange', name: 'SB Exchange' },
    { id: 'cable-rotation', name: 'Cable Rotation' },
    { id: 'squat-rotation-press', name: 'Squat Rotation Press' },
    { id: 'sit-up-and-press', name: 'Sit-Up and Press' },
    { id: 'sb-rollout', name: 'SB Rollout' }
  ],
  totalBody: [
    { id: 'power-clean', name: 'Power Clean' },
    { id: 'high-pull', name: 'High Pull' },
    { id: 'power-snatch', name: 'Power Snatch' },
    { id: 'push-press', name: 'Push Press' },
    { id: 'renegade-clean-and-press', name: 'Renegade Clean and Press' },
    { id: 'deadlift-variations', name: 'Deadlift Variations' },
    { id: 'bear-hug-deadlift-bag', name: 'Bear-Hug Deadlift (Bag)' },
    { id: 'sandbag-rotational-deadlift', name: 'Sandbag Rotational Deadlift' },
    { id: 'battling-rope-circuit', name: 'Battling Rope Circuit' },
    { id: 'tire-flip', name: 'Tire Flip' },
    { id: 'sled-push-drag', name: 'Sled Push / Drag' },
    { id: 'kb-swing', name: 'KB Swing' },
    { id: 'sandbag-keg-carry', name: 'Sandbag / Keg Carry' },
    { id: 'partner-carry-drag', name: 'Partner Carry / Drag' },
    { id: 'sandbag-sled-drag', name: 'Sandbag / Sled Drag' },
    { id: 'farmers-walk', name: "Farmer's Walk" },
    { id: 'super-yoke-walk', name: 'Super Yoke Walk' },
    { id: 'thruster', name: 'Thruster' },
    { id: 'heavy-bag-throw', name: 'Heavy Bag Throw' },
    { id: 'db-loading-medley', name: 'DB Loading Medley' }
  ]
} as const;

export type ExerciseCategoryKey = keyof typeof EXERCISE_LIBRARY;

export function getExerciseByCategory(category: ExerciseCategoryKey): Exercise[] {
  return EXERCISE_LIBRARY[category];
}

export function getAllExercises(): Exercise[] {
  return Object.values(EXERCISE_LIBRARY).flat();
}
