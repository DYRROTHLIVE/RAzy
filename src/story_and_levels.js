// RAzy: Story Mode, 100+ Level Tournament Circuit & Competitive Rank Engine
// Supports 100+ progressive stages across 10 worlds, Bronze->Champion ranks, profile & quest systems.

export const STORY_CHAPTERS = [
  {
    id: 1,
    title: "Chapter 1: The Rookie Awakening",
    subtitle: "Sunshine Academy Tryouts",
    location: "Sunshine Grass Courts",
    rival: {
      name: "Leo 'The Swift'",
      avatarId: "opponent1",
      title: "Rising Rookie",
      quote: "Think your reflexes can keep up with the crazy spin of RAzy Tennis?",
    },
    format: "1v1",
    difficulty: "casual",
    gamesToWin: 2,
    objective: "Win Best of 3 games against Leo to earn your RAzy Tour Card!",
    dialogueIntro: [
      { speaker: "leo", name: "Leo", text: "Hey rookie! Welcome to the RAzy Tennis Grand League! Don't expect any gentle warmups here.", mood: "smirk" },
      { speaker: "player", name: "Player", text: "I didn't come to practice, Leo. I came to dominate the court!", mood: "confident" },
      { speaker: "leo", name: "Leo", text: "Ha! Bold words! Let's see if you can return my signature curve shot. Serve it up!", mood: "fierce" }
    ],
    dialogueWin: [
      { speaker: "leo", name: "Leo", text: "Whoa... that smash caught fire! You're the real deal. Your RAzy Tour Card is officially stamped!", mood: "shocked" },
      { speaker: "player", name: "Player", text: "That was just the first step. Where's the next stop on the circuit?", mood: "happy" },
      { speaker: "leo", name: "Leo", text: "Head down to Azure Coast. Maya 'The Spin Queen' is waiting for you in the breeze!", mood: "grin" }
    ],
    dialogueLoss: [
      { speaker: "leo", name: "Leo", text: "Got caught off balance! Keep your eye on the bounce timing and try again!", mood: "smirk" }
    ]
  },
  {
    id: 2,
    title: "Chapter 2: The Beachfront Blitz",
    subtitle: "Azure Sand & Gusting Winds",
    location: "Azure Coast Sand Court",
    rival: {
      name: "Maya 'Spin Queen'",
      avatarId: "player2",
      title: "Coastal Champion",
      quote: "The seaside breeze bends every slice! Can you read the wind?",
    },
    format: "1v1",
    difficulty: "casual",
    gamesToWin: 2,
    objective: "Master backspin and defeat Maya on the windy coastal clay!",
    dialogueIntro: [
      { speaker: "maya", name: "Maya", text: "Welcome to the Coast, challenger! The sea air is fresh, but my backhand is lethal.", mood: "confident" },
      { speaker: "player", name: "Player", text: "I can handle a little breeze. Watch out for my top-spin drive!", mood: "happy" },
      { speaker: "maya", name: "Maya", text: "Let's see if your footwork holds up when the ball kicks sideways!", mood: "smirk" }
    ],
    dialogueWin: [
      { speaker: "maya", name: "Maya", text: "Incredible court coverage! Your timing on that deep slice was immaculate.", mood: "happy" },
      { speaker: "player", name: "Player", text: "Thanks Maya! You gave me a real run for my money out here.", mood: "confident" },
      { speaker: "maya", name: "Maya", text: "Go take on the Neon Rooftops next. Kenji's lightning volleys won't go easy on you!", mood: "grin" }
    ],
    dialogueLoss: [
      { speaker: "maya", name: "Maya", text: "The ocean breeze got the better of you! Adjust your positioning earlier!", mood: "smirk" }
    ]
  },
  {
    id: 3,
    title: "Chapter 3: Neon Skyline Dojo",
    subtitle: "Rooftop Fast Surface",
    location: "Neo-Tokyo Rooftop Court",
    rival: {
      name: "Kenji 'The Flash'",
      avatarId: "opponent2",
      title: "Reflex Grandmaster",
      quote: "180 km/h is average speed up here. Blink and you forfeit!",
    },
    format: "1v1",
    difficulty: "pro",
    gamesToWin: 2,
    objective: "Defeat Kenji on the lightning-fast hardcourt surface!",
    dialogueIntro: [
      { speaker: "kenji", name: "Kenji", text: "You climb high, challenger. Up on this rooftop, there are no second chances.", mood: "focused" },
      { speaker: "player", name: "Player", text: "I like speed. Show me your fastest ace, Kenji!", mood: "confident" },
      { speaker: "kenji", name: "Kenji", text: "Precision over power. Prepare yourself for the Flash Volley!", mood: "fierce" }
    ],
    dialogueWin: [
      { speaker: "kenji", name: "Kenji", text: "Improbable! You read every single angle before the ball even crossed the net...", mood: "shocked" },
      { speaker: "player", name: "Player", text: "Fast court, faster reactions. Onwards to the Volcano!", mood: "happy" },
      { speaker: "kenji", name: "Kenji", text: "Watch out for Vulcan. He fights with double partners and pure magma!", mood: "focused" }
    ],
    dialogueLoss: [
      { speaker: "kenji", name: "Kenji", text: "Too slow on the draw. You must anticipate before the racket strikes!", mood: "focused" }
    ]
  },
  {
    id: 4,
    title: "Chapter 4: The Magma Crucible",
    subtitle: "1 vs 2 Handicap Challenge",
    location: "Volcano Rim Arena",
    rival: {
      name: "Vulcan & Inferno Guard",
      avatarId: "opponent1",
      title: "Volcanic Berserker",
      quote: "One player against two champions of flame? Good luck surviving!",
    },
    format: "1v2",
    difficulty: "pro",
    gamesToWin: 2,
    objective: "Survive and conquer in a frantic 1v2 solo handicap match!",
    dialogueIntro: [
      { speaker: "vulcan", name: "Vulcan", text: "Bwahaha! You think one lone tennis player can withstand our dual barrage in the caldera?", mood: "fierce" },
      { speaker: "player", name: "Player", text: "Two opponents just means twice the target area for my fire shots!", mood: "confident" },
      { speaker: "vulcan", name: "Vulcan", text: "We'll roast that confidence to ash! Serve with maximum flame!", mood: "smirk" }
    ],
    dialogueWin: [
      { speaker: "vulcan", name: "Vulcan", text: "WHAT?! A solo player broke through our double wall?! Impossible!", mood: "shocked" },
      { speaker: "player", name: "Player", text: "The fire in my racket burns hotter than your volcano!", mood: "happy" },
      { speaker: "vulcan", name: "Vulcan", text: "Rgh... take your ticket to the Colosseum. The reigning duo awaits...", mood: "fierce" }
    ],
    dialogueLoss: [
      { speaker: "vulcan", name: "Vulcan", text: "Crushed by our two-man front! Come back when you can run faster!", mood: "smirk" }
    ]
  },
  {
    id: 5,
    title: "Chapter 5: The Thunder Colosseum",
    subtitle: "2 vs 2 Doubles World Championship",
    location: "Storm Peak Stadium",
    rival: {
      name: "Matt & Elisa (Duo Titans)",
      avatarId: "opponent1",
      title: "Reigning Doubles Champions",
      quote: "True doubles harmony is invincible. Bring your best teammate!",
    },
    format: "2v2",
    difficulty: "legend",
    gamesToWin: 2,
    objective: "Team up in 2v2 doubles and dethrone the legendary Matt & Elisa!",
    dialogueIntro: [
      { speaker: "matt", name: "Matt", text: "You've made it all the way to Thunder Colosseum. But doubles tennis is an entirely different beast.", mood: "fierce" },
      { speaker: "player", name: "Player", text: "My partner and I have sync you wouldn't believe. Let's rock this court!", mood: "confident" },
      { speaker: "matt", name: "Matt", text: "Let the lightning strike! May the best team take the championship trophy!", mood: "smirk" }
    ],
    dialogueWin: [
      { speaker: "matt", name: "Matt", text: "Unbelievable synchronization! You two are truly worthy of the title!", mood: "happy" },
      { speaker: "player", name: "Player", text: "We did it! Doubles Champions of the RAzy League!", mood: "happy" },
      { speaker: "matt", name: "Matt", text: "Now go... the mysterious RAzy Overlord has summoned you for the Final Exhibition!", mood: "shocked" }
    ],
    dialogueLoss: [
      { speaker: "matt", name: "Matt", text: "Communication breakdown! A doubles pair must act as one single mind!", mood: "smirk" }
    ]
  },
  {
    id: 6,
    title: "Chapter 6: The RAzy Grand Slam Finale",
    subtitle: "Clash against the RAzy Overlord Titan",
    location: "Omega Galaxy Arena",
    rival: {
      name: "RAzy Overlord Titan",
      avatarId: "opponent2",
      title: "Supreme Tennis Deity",
      quote: "Welcome to the pinnacle of madness. Only true RAzy legends triumph!",
    },
    format: "1v1",
    difficulty: "legend",
    gamesToWin: 3,
    objective: "Best of 5 epic showdown for the Legendary RAzy Golden Racket!",
    dialogueIntro: [
      { speaker: "titan", name: "Overlord Titan", text: "At last, mortals reach the Omega Arena. You have mastered curve, fire, and spirit.", mood: "fierce" },
      { speaker: "player", name: "Player", text: "Overlord Titan! I've fought through every court on the planet to face you!", mood: "confident" },
      { speaker: "titan", name: "Overlord Titan", text: "Then let the cosmos witness the ultimate battle of RAZY TENNIS!", mood: "fierce" }
    ],
    dialogueWin: [
      { speaker: "titan", name: "Overlord Titan", text: "ASTONISHING! The heavens bow to your racket! You are officially the RAZY GRAND CHAMPION!", mood: "shocked" },
      { speaker: "player", name: "Player", text: "WE CONQUERED THE CRAZIEST TENNIS IN THE UNIVERSE!", mood: "happy" },
      { speaker: "titan", name: "Overlord Titan", text: "The Golden Trophy is yours forever! Long live the RAzy Master!", mood: "happy" }
    ],
    dialogueLoss: [
      { speaker: "titan", name: "Overlord Titan", text: "You fought valiantly, but the cosmic spin is unyielding. Rise and challenge again!", mood: "smirk" }
    ]
  }
];

// ============================================================================
// 100+ LEVEL TOURNAMENT WORLDS & STAGES (10 Worlds x 12 Stages = 120 Levels)
// ============================================================================
export const TOURNAMENT_WORLDS = [
  { id: 1, name: "World 1: Sunshine Academy", icon: "🌱", levelsRange: [1, 12], courtType: "Grass Academy", desc: "Fundamental court physics & topspin mastery" },
  { id: 2, name: "World 2: Azure Sand Dunes", icon: "🌊", levelsRange: [13, 24], courtType: "Coastal Sand Clay", desc: "High bounce & unpredictable sea wind spins" },
  { id: 3, name: "World 3: Neo-Tokyo Rooftops", icon: "⚡", levelsRange: [25, 36], courtType: "High-Speed Hardcourt", desc: "Supersonic pace & reflex volleys" },
  { id: 4, name: "World 4: Volcanic Caldera", icon: "🌋", levelsRange: [37, 48], courtType: "Magma Rim Court", desc: "Super Fire smashes & 1v2 handicap challenges" },
  { id: 5, name: "World 5: Thunder Colosseum", icon: "⛈️", levelsRange: [49, 60], courtType: "Storm Peak Turf", desc: "Elite 2v2 doubles coordination" },
  { id: 6, name: "World 6: Cyber Metropolis", icon: "🏙️", levelsRange: [61, 72], courtType: "Laser Synthetic Floor", desc: "Precision angles & rapid robotic AI" },
  { id: 7, name: "World 7: Glacial Ice Dome", icon: "❄️", levelsRange: [73, 84], courtType: "Low-Friction Slick Ice", desc: "Sliding footwork & curved slice control" },
  { id: 8, name: "World 8: Golden Mirage Palace", icon: "👑", levelsRange: [85, 96], courtType: "Royal Diamond Turf", desc: "Championship stakes & veteran tour pros" },
  { id: 9, name: "World 9: Omega Celestial Core", icon: "🌌", levelsRange: [97, 108], courtType: "Zero-G Cosmic Court", desc: "Maximum 180+ km/h cosmic rallies" },
  { id: 10, name: "World 10: Master Hall of Fame", icon: "🏆", levelsRange: [109, 120], courtType: "Ascendant Arena", desc: "The ultimate 100+ mastery endgame ladder" }
];

// Generate 120 high-fidelity progressive tournament levels
function generateAllTournamentLevels() {
  const levels = [];
  const opponentRoster = [
    { name: "Leo 'The Swift'", avatar: "opponent1", trait: "Fast Volleys" },
    { name: "Maya 'Spin Queen'", avatar: "player2", trait: "Deep Slice" },
    { name: "Kenji 'The Flash'", avatar: "opponent2", trait: "Bullet Aces" },
    { name: "Vulcan & Guard", avatar: "opponent1", trait: "Handicap Power" },
    { name: "Sarah & Leo", avatar: "player2", trait: "Net Rushers" },
    { name: "Matt 'The Titan'", avatar: "opponent1", trait: "Iron Defense" },
    { name: "Elisa 'Ice Valkyrie'", avatar: "opponent2", trait: "Slick Drop Shots" },
    { name: "Akira 'Cyber Eye'", avatar: "opponent2", trait: "Calculated Angles" },
    { name: "Ryu 'Thunder Dragon'", avatar: "opponent1", trait: "Supersonic Drive" },
    { name: "Overlord Titan", avatar: "opponent2", trait: "Cosmic Smash" }
  ];

  for (let lvl = 1; lvl <= 120; lvl++) {
    const worldIndex = Math.floor((lvl - 1) / 12);
    const world = TOURNAMENT_WORLDS[worldIndex] || TOURNAMENT_WORLDS[9];
    const stageInWorld = ((lvl - 1) % 12) + 1;
    const opp = opponentRoster[(lvl - 1) % opponentRoster.length];

    // Format variation: Boss stages at 6 and 12 of each world
    let format = "1v1";
    if (stageInWorld === 4 || stageInWorld === 8) format = "2v2";
    else if (stageInWorld === 6 || stageInWorld === 11) format = "1v2";
    else if (stageInWorld === 12) format = lvl > 50 ? "2v2" : "1v1";

    // Difficulty progression
    let diff = "casual";
    if (lvl > 85) diff = "legend";
    else if (lvl > 40) diff = "pro";

    // Games to win
    const gamesToWin = stageInWorld === 12 ? 3 : (stageInWorld > 6 ? 2 : (lvl <= 3 ? 1 : 2));

    // Stars rating difficulty
    const starsDifficulty = Math.min(5, Math.max(1, Math.ceil(lvl / 24)));

    // Specific rewards
    const rewardCoins = 800 + (lvl * 120);
    const rewardEXP = 100 + (lvl * 25);
    const rewardRP = 20 + Math.floor(lvl / 4);

    const isBoss = stageInWorld === 12;
    const title = isBoss
      ? `Level ${lvl}: ${world.name.split(':')[1]?.trim() || world.name} BOSS`
      : `Level ${lvl}: ${opp.trait} Tour`;

    levels.push({
      id: lvl,
      levelNum: lvl,
      worldId: world.id,
      worldName: world.name,
      title,
      courtName: world.courtType,
      format,
      difficulty: diff,
      gamesToWin,
      opponentName: isBoss ? `BOSS ${opp.name}` : opp.name,
      opponentAvatar: opp.avatar,
      starsDifficulty,
      rewardCoins,
      rewardEXP,
      rewardRP,
      description: `World ${world.id} Stage ${stageInWorld} • ${world.desc}`,
      conditions: [
        `★ Win the ${format} match against ${opp.name}`,
        `★★ Clock a smash faster than ${130 + Math.floor(lvl * 0.4)} km/h`,
        `★★★ Win ${gamesToWin}-${gamesToWin > 1 ? '0 shutout' : '0 with 0 faults'}`
      ]
    });
  }
  return levels;
}

export const TOURNAMENT_LEVELS = generateAllTournamentLevels();

// ============================================================================
// COMPETITIVE RANK TIERS (Bronze -> Silver -> Gold -> Platinum -> Diamond -> Master -> Champion)
// ============================================================================
export const RANK_TIERS = [
  { id: "bronze_3", name: "Bronze III", tier: "Bronze", division: "III", minRP: 0, maxRP: 299, badge: "🥉", color: "#cd7f32", border: "#b87333", glow: "rgba(205, 127, 50, 0.4)" },
  { id: "bronze_2", name: "Bronze II", tier: "Bronze", division: "II", minRP: 300, maxRP: 649, badge: "🥉", color: "#cd7f32", border: "#b87333", glow: "rgba(205, 127, 50, 0.4)" },
  { id: "bronze_1", name: "Bronze I", tier: "Bronze", division: "I", minRP: 650, maxRP: 999, badge: "🥉", color: "#cd7f32", border: "#b87333", glow: "rgba(205, 127, 50, 0.4)" },
  { id: "silver_3", name: "Silver III", tier: "Silver", division: "III", minRP: 1000, maxRP: 1149, badge: "🥈", color: "#e2e8f0", border: "#cbd5e1", glow: "rgba(226, 232, 240, 0.5)" },
  { id: "silver_2", name: "Silver II", tier: "Silver", division: "II", minRP: 1150, maxRP: 1299, badge: "🥈", color: "#e2e8f0", border: "#cbd5e1", glow: "rgba(226, 232, 240, 0.5)" },
  { id: "silver_1", name: "Silver I", tier: "Silver", division: "I", minRP: 1300, maxRP: 1499, badge: "🥈", color: "#e2e8f0", border: "#cbd5e1", glow: "rgba(226, 232, 240, 0.5)" },
  { id: "gold_3", name: "Gold III", tier: "Gold", division: "III", minRP: 1500, maxRP: 1649, badge: "🥇", color: "#ffea28", border: "#f59e0b", glow: "rgba(255, 234, 40, 0.6)" },
  { id: "gold_2", name: "Gold II", tier: "Gold", division: "II", minRP: 1650, maxRP: 1799, badge: "🥇", color: "#ffea28", border: "#f59e0b", glow: "rgba(255, 234, 40, 0.6)" },
  { id: "gold_1", name: "Gold I", tier: "Gold", division: "I", minRP: 1800, maxRP: 1999, badge: "🥇", color: "#ffea28", border: "#f59e0b", glow: "rgba(255, 234, 40, 0.6)" },
  { id: "platinum_3", name: "Platinum III", tier: "Platinum", division: "III", minRP: 2000, maxRP: 2149, badge: "💎", color: "#38bdf8", border: "#0284c7", glow: "rgba(56, 189, 248, 0.6)" },
  { id: "platinum_2", name: "Platinum II", tier: "Platinum", division: "II", minRP: 2150, maxRP: 2299, badge: "💎", color: "#38bdf8", border: "#0284c7", glow: "rgba(56, 189, 248, 0.6)" },
  { id: "platinum_1", name: "Platinum I", tier: "Platinum", division: "I", minRP: 2300, maxRP: 2499, badge: "💎", color: "#38bdf8", border: "#0284c7", glow: "rgba(56, 189, 248, 0.6)" },
  { id: "diamond_3", name: "Diamond III", tier: "Diamond", division: "III", minRP: 2500, maxRP: 2649, badge: "💠", color: "#a855f7", border: "#9333ea", glow: "rgba(168, 85, 247, 0.6)" },
  { id: "diamond_2", name: "Diamond II", tier: "Diamond", division: "II", minRP: 2650, maxRP: 2799, badge: "💠", color: "#a855f7", border: "#9333ea", glow: "rgba(168, 85, 247, 0.6)" },
  { id: "diamond_1", name: "Diamond I", tier: "Diamond", division: "I", minRP: 2800, maxRP: 2999, badge: "💠", color: "#a855f7", border: "#9333ea", glow: "rgba(168, 85, 247, 0.6)" },
  { id: "master", name: "Master", tier: "Master", division: "Elite", minRP: 3000, maxRP: 3499, badge: "👑", color: "#f43f5e", border: "#e11d48", glow: "rgba(244, 63, 94, 0.7)" },
  { id: "champion", name: "RAzy Grand Champion", tier: "Champion", division: "Legend", minRP: 3500, maxRP: 99999, badge: "⚡", color: "#ffdf14", border: "#ff6200", glow: "rgba(255, 98, 0, 0.85)" }
];

export function getRankFromRP(rp = 1680) {
  const current = RANK_TIERS.find(r => rp >= r.minRP && rp <= r.maxRP) || RANK_TIERS[RANK_TIERS.length - 1];
  const next = RANK_TIERS[RANK_TIERS.indexOf(current) + 1] || current;
  const progressPercent = current === next ? 100 : Math.min(100, Math.max(0, Math.floor(((rp - current.minRP) / (current.maxRP - current.minRP + 1)) * 100)));
  return {
    ...current,
    nextRank: next,
    progressPercent,
    rpToNext: Math.max(0, current.maxRP + 1 - rp)
  };
}

export const MII_PERSONALITIES = {
  aggressive: {
    id: "aggressive",
    name: "Aggressive",
    title: "Offensive Striker",
    icon: "⚡",
    color: "#f59e0b",
    badgeBg: "rgba(245, 158, 11, 0.18)",
    badgeBorder: "#f59e0b",
    headline: "+10% Smash & Topspin Power • +25% Fire Charge",
    description: "Channels explosive racket acceleration, unleashing higher smash km/h and charging fiery super shots with fierce momentum.",
    buffs: {
      ballSpeedMult: 1.10,
      fireChargeMult: 1.25,
      moveSpeedMult: 1.0,
      sweetSpotBonus: 0.0,
      spinCurveMult: 1.0
    }
  },
  defensive: {
    id: "defensive",
    name: "Defensive",
    title: "Iron Baseline Wall",
    icon: "🛡️",
    color: "#38bdf8",
    badgeBg: "rgba(56, 189, 248, 0.18)",
    badgeBorder: "#38bdf8",
    headline: "+15% Court Movement Speed • Wider Sweet-Spot Window",
    description: "Exceptional baseline footwork and reach to track down wide angles and prevent unforced errors during long rallies.",
    buffs: {
      ballSpeedMult: 1.0,
      fireChargeMult: 1.0,
      moveSpeedMult: 1.15,
      sweetSpotBonus: 0.20,
      spinCurveMult: 1.0
    }
  },
  balanced: {
    id: "balanced",
    name: "Balanced",
    title: "All-Court Maestro",
    icon: "⚖️",
    color: "#a855f7",
    badgeBg: "rgba(168, 85, 247, 0.18)",
    badgeBorder: "#a855f7",
    headline: "+8% Speed • +6% Shot Velocity • +15% Spin Precision",
    description: "Versatile, rounded fundamentals that adapt effortlessly to both aggressive baseline exchanges and agile net volleys.",
    buffs: {
      ballSpeedMult: 1.06,
      fireChargeMult: 1.10,
      moveSpeedMult: 1.08,
      sweetSpotBonus: 0.10,
      spinCurveMult: 1.15
    }
  },
  trickster: {
    id: "trickster",
    name: "Trickster",
    title: "Spin Sorcerer",
    icon: "🌀",
    color: "#ec4899",
    badgeBg: "rgba(236, 72, 153, 0.18)",
    badgeBorder: "#ec4899",
    headline: "+25% Spin Curvature • Sharp Drop Shot Angles",
    description: "Imparts wicked sidespin and deceptive slice trajectories that kick unpredictably away from opposing court positioning.",
    buffs: {
      ballSpeedMult: 1.02,
      fireChargeMult: 1.05,
      moveSpeedMult: 1.05,
      sweetSpotBonus: 0.05,
      spinCurveMult: 1.25
    }
  }
};

export const DAILY_QUESTS = [
  {
    id: "q_topspin",
    title: "Spin Master",
    desc: "Hit 50 Topspin Shots in matches",
    category: "tactical",
    progress: 38,
    target: 50,
    rewardCoins: 4500,
    rewardEXP: 350,
    icon: "🌀",
    claimed: false
  },
  {
    id: "q_ace",
    title: "Supersonic Ace",
    desc: "Clock a serve or smash over 150 km/h",
    category: "tactical",
    progress: 1,
    target: 1,
    rewardCoins: 3000,
    rewardEXP: 250,
    icon: "⚡",
    claimed: false
  },
  {
    id: "q_fire",
    title: "Fire Power Fury",
    desc: "Execute 10 Super Fire Shots in any match",
    category: "tactical",
    progress: 7,
    target: 10,
    rewardCoins: 5000,
    rewardEXP: 400,
    icon: "🔥",
    claimed: false
  },
  {
    id: "q_tour",
    title: "World Tour Blitz",
    desc: "Clear 5 Tournament Levels in the 100+ Circuit",
    category: "tactical",
    progress: 4,
    target: 5,
    rewardCoins: 6500,
    rewardEXP: 500,
    icon: "🏆",
    claimed: false
  },
  {
    id: "q_defense",
    title: "Defensive Wall",
    desc: "Execute 25 Precision Baseline Returns",
    category: "tactical",
    progress: 18,
    target: 25,
    rewardCoins: 4000,
    rewardEXP: 320,
    icon: "🛡️",
    claimed: false
  },
  {
    id: "q_ranked",
    title: "Rank Ascendant",
    desc: "Win 3 matches in Competitive Ranked Ladder",
    category: "tactical",
    progress: 3,
    target: 3,
    rewardCoins: 7500,
    rewardEXP: 600,
    icon: "🥇",
    claimed: false
  }
];

export const SYSTEM_MAILS = [
  { id: "m1", title: "🎉 Welcome to RAzy 100+ Circuit!", date: "Today", sender: "RAzy League HQ", content: "Welcome Champion! Enjoy 50,000 Gold Coins and 500 Gems to kickstart your 100+ Level journey!", coins: 50000, gems: 500, claimed: false },
  { id: "m2", title: "⚡ Daily Energy Boost", date: "Today", sender: "Stadium Clinic", content: "Free stamina energy boost for today's tournament matches!", energy: 120, claimed: false },
  { id: "m3", title: "🏆 Ranked Season 1 Inaugural", date: "Yesterday", sender: "Rank Council", content: "Climb from Bronze to RAzy Grand Champion to claim exclusive season trophies!", coins: 25000, gems: 300, claimed: false },
];

export const DAILY_CHECKIN = [
  { day: 1, reward: "🪙 10,000", claimed: true },
  { day: 2, reward: "💎 200", claimed: true },
  { day: 3, reward: "⚡ Full Energy", claimed: true },
  { day: 4, reward: "🪙 25,000", claimed: false, current: true },
  { day: 5, reward: "💎 500", claimed: false },
  { day: 6, reward: "🔥 Fire Aura Racket", claimed: false },
  { day: 7, reward: "👑 Gold Champion Trophy", claimed: false },
];

// ============================================================================
// STORY & 100+ LEVELS MANAGER CLASS
// ============================================================================
export class StoryAndLevelsManager {
  constructor(gameEngine, lobbyManager) {
    this.engine = gameEngine;
    this.lobby = lobbyManager;

    this.unlockedChapter = this._loadUnlockedChapter();
    this.unlockedLevel = this._loadUnlockedLevel();
    this.levelStars = this._loadLevelStars();

    // Resources & Progression
    this.resources = this._loadResources();

    // Tactical Quests (persisted)
    this.quests = this._loadQuests();

    this.activeStoryChapter = null;
    this.activeTournamentLevel = null;

    this._dialogueStep = 0;
    this._currentDialogueLines = [];
    this._onDialogueComplete = null;
  }

  _loadQuests() {
    const v = localStorage.getItem("razy_tactical_quests");
    if (v) {
      try {
        const parsed = JSON.parse(v);
        return DAILY_QUESTS.map(q => {
          const found = parsed.find(p => p.id === q.id);
          return found ? { ...q, progress: Math.min(q.target, found.progress), claimed: !!found.claimed } : q;
        });
      } catch (e) {}
    }
    return JSON.parse(JSON.stringify(DAILY_QUESTS));
  }

  saveQuests() {
    localStorage.setItem("razy_tactical_quests", JSON.stringify(this.quests));
    if (this.lobby && typeof this.lobby._renderQuestsModal === 'function') {
      this.lobby._renderQuestsModal();
    }
  }

  recordQuestProgress(questId, amount = 1) {
    const q = this.quests.find(item => item.id === questId);
    if (!q || q.claimed) return;
    const prevComplete = q.progress >= q.target;
    q.progress = Math.min(q.target, q.progress + amount);
    this.saveQuests();
    if (!prevComplete && q.progress >= q.target && this.engine && this.engine.hud) {
      this.engine.hud.showCenterBanner(`QUEST COMPLETE: ${q.title}!`, {
        style: "style-gold",
        subText: "Open Quests to claim reward!",
        durationMs: 2500,
      });
    }
  }

  getPersonality(id = "aggressive") {
    return MII_PERSONALITIES[id] || MII_PERSONALITIES.aggressive;
  }

  _loadUnlockedChapter() {
    const v = localStorage.getItem("razy_story_unlocked_ch");
    return v ? Math.max(1, parseInt(v, 10)) : 1;
  }

  _saveUnlockedChapter(ch) {
    this.unlockedChapter = Math.max(this.unlockedChapter, ch);
    localStorage.setItem("razy_story_unlocked_ch", String(this.unlockedChapter));
  }

  _loadUnlockedLevel() {
    const v = localStorage.getItem("razy_unlocked_level");
    return v ? Math.max(1, parseInt(v, 10)) : 1;
  }

  _saveUnlockedLevel(lvl) {
    this.unlockedLevel = Math.max(this.unlockedLevel, lvl);
    localStorage.setItem("razy_unlocked_level", String(this.unlockedLevel));
  }

  _loadLevelStars() {
    const v = localStorage.getItem("razy_level_stars");
    if (v) {
      try {
        return JSON.parse(v);
      } catch (e) {}
    }
    const initStars = {};
    initStars[1] = 3;
    initStars[2] = 2;
    return initStars;
  }

  _saveLevelStars(levelId, stars) {
    this.levelStars[levelId] = Math.max(this.levelStars[levelId] || 0, stars);
    localStorage.setItem("razy_level_stars", JSON.stringify(this.levelStars));
  }

  _loadResources() {
    const v = localStorage.getItem("razy_player_resources");
    if (v) {
      try {
        return JSON.parse(v);
      } catch (e) {}
    }
    return {
      coins: 500732,
      gems: 6000,
      energy: 120,
      maxEnergy: 120,
      playerLevel: 42,
      playerEXP: 1850,
      maxEXP: 2500,
      rankPoints: 1680, // Gold II
      vipLevel: 3,
      combatPower: 4820,
      title: "Thunder Ace",
    };
  }

  saveResources() {
    localStorage.setItem("razy_player_resources", JSON.stringify(this.resources));
    if (this.lobby && typeof this.lobby.updateCommandTopBar === 'function') {
      this.lobby.updateCommandTopBar();
    }
  }

  getRank() {
    return getRankFromRP(this.resources.rankPoints);
  }

  addReward({ coins = 0, gems = 0, exp = 0, rp = 0, energy = 0 }) {
    this.resources.coins += coins;
    this.resources.gems += gems;
    this.resources.energy = Math.min(this.resources.maxEnergy, this.resources.energy + energy);
    this.resources.rankPoints = Math.max(0, this.resources.rankPoints + rp);
    this.resources.playerEXP += exp;

    // Check level up
    while (this.resources.playerEXP >= this.resources.maxEXP) {
      this.resources.playerEXP -= this.resources.maxEXP;
      this.resources.playerLevel += 1;
      this.resources.maxEXP = Math.floor(this.resources.maxEXP * 1.15);
      this.resources.combatPower += 85;
      if (this.engine && this.engine.hud) {
        this.engine.hud.showCenterBanner(`LEVEL UP! LV.${this.resources.playerLevel}`, {
          style: "style-gold",
          subText: "+100 Gems & Max Energy Refilled!",
          durationMs: 2200,
        });
      }
      this.resources.gems += 100;
      this.resources.energy = this.resources.maxEnergy;
    }

    this.saveResources();
  }

  getChapter(chId) {
    return STORY_CHAPTERS.find(c => c.id === chId) || STORY_CHAPTERS[0];
  }

  getLevel(lvlId) {
    return TOURNAMENT_LEVELS.find(l => l.id === lvlId) || TOURNAMENT_LEVELS[0];
  }

  // Calculate stars and resource rewards earned on match end for a level
  recordLevelMatchResult(levelId, { playerWon, playerGames, opponentGames, maxSpeedKmh = 145, usedFireShot = false }) {
    if (!playerWon) {
      return { stars: 0, unlockedNext: false, rewardCoins: 0, rewardEXP: 0, rewardRP: 0 };
    }

    const lvl = this.getLevel(levelId);
    let stars = 1;
    if (opponentGames === 0 || maxSpeedKmh >= 150) {
      stars = 2;
    }
    if ((opponentGames === 0 && playerGames >= 2) || (usedFireShot && maxSpeedKmh >= 155)) {
      stars = 3;
    }

    this._saveLevelStars(levelId, stars);

    let unlockedNext = false;
    if (levelId === this.unlockedLevel && levelId < TOURNAMENT_LEVELS.length) {
      this._saveUnlockedLevel(levelId + 1);
      unlockedNext = true;
    }

    const coins = lvl.rewardCoins || 2500;
    const exp = lvl.rewardEXP || 250;
    const rp = lvl.rewardRP || 35;
    this.addReward({ coins, exp, rp });

    return { stars, unlockedNext, rewardCoins: coins, rewardEXP: exp, rewardRP: rp };
  }

  recordStoryMatchResult(chapterId, { playerWon }) {
    let unlockedNext = false;
    if (playerWon) {
      if (chapterId === this.unlockedChapter && chapterId < STORY_CHAPTERS.length) {
        this._saveUnlockedChapter(chapterId + 1);
        unlockedNext = true;
      }
      this.addReward({ coins: 15000, gems: 250, exp: 600, rp: 50 });
    }
    return { playerWon, unlockedNext };
  }

  // Launch a story chapter
  playStoryChapter(chapterId) {
    const chapter = this.getChapter(chapterId);
    this.activeStoryChapter = chapter;
    this.activeTournamentLevel = null;

    this.showDialogue(chapter.dialogueIntro, {
      chapterTitle: chapter.title,
      location: chapter.location,
      objective: chapter.objective,
      rivalName: chapter.rival.name,
      rivalAvatar: chapter.rival.avatarId,
      onComplete: () => {
        this._startChapterMatch(chapter);
      }
    });
  }

  // Launch a tournament level
  playTournamentLevel(levelId) {
    const level = this.getLevel(levelId);
    this.activeTournamentLevel = level;
    this.activeStoryChapter = null;

    if (this.engine) {
      this.engine.activeLevelInfo = {
        id: level.id,
        title: level.title,
        badge: `LVL ${level.levelNum} • ${level.title.replace(/^Level \d+:\s*/, '')}`,
        courtName: level.courtName,
        format: level.format,
        difficulty: level.difficulty,
        gamesToWin: level.gamesToWin,
        opponentName: level.opponentName,
      };

      this.updateHudLevelBadge(this.engine.activeLevelInfo.badge);
    }

    if (this.lobby) {
      this.lobby.matchSettings.format = level.format;
      this.lobby.matchSettings.difficulty = level.difficulty;
      this.lobby.matchSettings.gamesToWin = level.gamesToWin;
      this.lobby.matchSettings.mode = 'offline';
      this.lobby.showScreen('game');

      if (this.engine && this.engine.applySmashClubMatchSetup) {
        this.engine.applySmashClubMatchSetup({
          mode: 'offline',
          format: level.format,
          difficulty: level.difficulty,
          gamesToWin: level.gamesToWin,
          playerName: this.lobby.playerProfile?.name || 'Ammaar'
        });
      }
    }
  }

  _startChapterMatch(chapter) {
    if (this.engine) {
      this.engine.activeLevelInfo = {
        id: chapter.id,
        title: chapter.title,
        badge: `STORY CH. ${chapter.id} • ${chapter.title.replace(/^Chapter \d+:\s*/, '')}`,
        courtName: chapter.location,
        format: chapter.format,
        difficulty: chapter.difficulty,
        gamesToWin: chapter.gamesToWin,
        opponentName: chapter.rival.name,
      };
      this.updateHudLevelBadge(this.engine.activeLevelInfo.badge);
    }

    if (this.lobby) {
      this.lobby.matchSettings.format = chapter.format;
      this.lobby.matchSettings.difficulty = chapter.difficulty;
      this.lobby.matchSettings.gamesToWin = chapter.gamesToWin;
      this.lobby.matchSettings.mode = 'offline';
      this.lobby.showScreen('game');

      if (this.engine && this.engine.applySmashClubMatchSetup) {
        this.engine.applySmashClubMatchSetup({
          mode: 'offline',
          format: chapter.format,
          difficulty: chapter.difficulty,
          gamesToWin: chapter.gamesToWin,
          playerName: this.lobby.playerProfile?.name || 'Ammaar'
        });
      }
    }
  }

  updateHudLevelBadge(badgeText) {
    const elBadge = document.getElementById('hud-level-badge');
    const elText = document.getElementById('hud-level-badge-text');
    if (elBadge) {
      if (elText) elText.textContent = badgeText || '';
      else elBadge.textContent = badgeText || '';
      if (badgeText) {
        elBadge.classList.remove('hidden');
      } else {
        elBadge.classList.add('hidden');
      }
    }
  }

  // Display story visual novel dialogue modal
  showDialogue(lines, { chapterTitle, location, objective, rivalName, rivalAvatar, onComplete }) {
    this._dialogueStep = 0;
    this._currentDialogueLines = lines || [];
    this._onDialogueComplete = onComplete;

    const modal = document.getElementById('story-dialogue-modal');
    if (!modal) {
      if (onComplete) onComplete();
      return;
    }

    const elTitle = document.getElementById('dialogue-chapter-title');
    const elLocation = document.getElementById('dialogue-location');
    const elObjective = document.getElementById('dialogue-objective');
    const elSpeakerName = document.getElementById('dialogue-speaker-name');
    const elSpeechText = document.getElementById('dialogue-speech-text');
    const btnNext = document.getElementById('btn-dialogue-next');
    const btnSkip = document.getElementById('btn-dialogue-skip');

    if (elTitle) elTitle.textContent = chapterTitle || "Story Scene";
    if (elLocation) elLocation.textContent = location || "RAzy Circuit";
    if (elObjective) elObjective.textContent = objective || "Win the match!";

    modal.classList.remove('hidden');
    modal.style.opacity = '1';
    modal.style.pointerEvents = 'auto';

    const renderCurrentLine = () => {
      const line = this._currentDialogueLines[this._dialogueStep];
      if (!line) {
        this._finishDialogue();
        return;
      }

      const isPlayer = line.speaker === 'player';
      const speakerName = isPlayer ? (this.lobby?.playerProfile?.name || 'Ammaar') : (line.name || rivalName || 'Rival');
      if (elSpeakerName) {
        elSpeakerName.textContent = speakerName;
        elSpeakerName.style.color = isPlayer ? '#ffea28' : '#7be0ff';
      }

      if (elSpeechText) {
        elSpeechText.textContent = line.text;
      }

      const cardPlayer = document.getElementById('dialogue-speaker-player');
      const cardRival = document.getElementById('dialogue-speaker-rival');
      if (cardPlayer && cardRival) {
        if (isPlayer) {
          cardPlayer.classList.add('active-speaker');
          cardRival.classList.remove('active-speaker');
        } else {
          cardRival.classList.add('active-speaker');
          cardPlayer.classList.remove('active-speaker');
        }
      }

      if (btnNext) {
        const isLast = this._dialogueStep === this._currentDialogueLines.length - 1;
        btnNext.textContent = isLast ? "🎾 Start Match ➔" : "Next ➔";
      }
    };

    renderCurrentLine();

    const handleNext = (e) => {
      e?.stopPropagation();
      this._dialogueStep++;
      if (this._dialogueStep < this._currentDialogueLines.length) {
        renderCurrentLine();
      } else {
        this._finishDialogue();
      }
    };

    const handleSkip = (e) => {
      e?.stopPropagation();
      this._finishDialogue();
    };

    if (btnNext) btnNext.onclick = handleNext;
    if (btnSkip) btnSkip.onclick = handleSkip;
  }

  _finishDialogue() {
    const modal = document.getElementById('story-dialogue-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.style.opacity = '0';
      modal.style.pointerEvents = 'none';
    }
    if (this._onDialogueComplete) {
      const cb = this._onDialogueComplete;
      this._onDialogueComplete = null;
      cb();
    }
  }
}
