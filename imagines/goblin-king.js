(function(){

  // Only passive versatility implemented.
  const GOBLIN_KING_PASSIVE_VERSATILITY_STAT = [8960, 11648, 14336, 17024, 19712, 22400];
  // Chance to succeed extra summons. Step 2 is SGK/JGW (since it rolls before step 3 SGW/JGW)
  const TIER_DATA = {
    0: { step2Chance: 0.40, step3Chance: 0.60 },
    1: { step2Chance: 0.60, step3Chance: 0.80 },
    2: { step2Chance: 0.60, step3Chance: 0.80 },
    3: { step2Chance: 0.80, step3Chance: 1.00 },
    4: { step2Chance: 0.80, step3Chance: 1.00 },
    5: { step2Chance: 1.00, step3Chance: 1.00 }
  };

  const BUFF_DATA = {
    'Goblin Warrior': {
      luckyStrikeMultPct: [10, 12, 14, 16, 18, 20]
    },
    'Storm Goblin King': {
      luckStat: [5600, 6720, 7840, 8960, 10080, 11200],
      luckEffectPct: [16, 19.2, 22.4, 25.6, 28.8, 32]
    },
    'Jungle Goblin Warrior': {
      mainStatPct: [10, 12, 14, 16, 18, 20]
    },
    'Storm Goblin Warrior': {
      elemPct: [8, 9.6, 11.2, 12.8, 14.4, 16]
    }
  };

  window.IMAGINES = window.IMAGINES || {};

  function calculateSummonOdds(tierNumber) {
    const tier = parseInt(tierNumber, 10);
    const config = TIER_DATA[tier];
    if (!config) throw new Error(`Invalid tier: ${tierNumber}. Use numbers 0 through 5.`);

    const s2Activation = config.step2Chance;
    const s3Activation = config.step3Chance;

    let guard = 0.50;
    let warrior = 0.50;
    let king = 0;
    let jungle = 0;
    let storm = 0;

    // --- Step 2 Outcomes ---
    const kingS2 = s2Activation * 0.30;
    const jungleS2 = s2Activation * 0.70;
    const failS2 = 1 - s2Activation;

    // Add Step 2 base rates
    king += kingS2;
    jungle += jungleS2;

    // --- Step 3 Conditional Logic ---
    
    // Branch A: Step 2 rolled King. Step 3 does its regular 50/50 split.
    const branchA_Trigger = kingS2 * s3Activation;
    const branchA_Jungle = branchA_Trigger * 0.50;
    const branchA_Storm = branchA_Trigger * 0.50;

    // Branch B: Step 2 rolled Jungle. Step 3 CANNOT roll Jungle (Unique constraint).
    // It forces a 100% chance to roll Storm Goblin Warrior instead.
    const branchB_Storm = jungleS2 * s3Activation * 1.00;

    // Branch C: Step 2 failed. Step 3 does its regular 50/50 split.
    const branchC_Trigger = failS2 * s3Activation;
    const branchC_Jungle = branchC_Trigger * 0.50;
    const branchC_Storm = branchC_Trigger * 0.50;

    // Aggregate Step 3 results
    jungle += (branchA_Jungle + branchC_Jungle);
    storm += (branchA_Storm + branchB_Storm + branchC_Storm);

    const totalSummons = guard + warrior + king + jungle + storm;

    return {
        tier: tier,
        expectedRates: {
            'Goblin Guard': Number(guard.toFixed(3)),
            'Goblin Warrior': Number(warrior.toFixed(3)),
            'Storm Goblin King': Number(king.toFixed(3)),
            'Jungle Goblin Warrior': Number(jungle.toFixed(3)),
            'Storm Goblin Warrior': Number(storm.toFixed(3))
        },
        totalSummons: Number(totalSummons.toFixed(2))
    };
  }


  function provideBonuses(state) {
    if (state.imagine !== 'goblin-king') return {};

    const level = state.level;
    const mainStatType = getClassMainStatType();
    const elementType = getClassElemType();

    // Base Passive Vers
    let versatilityStat = 0;
    if (state.applyPassiveStats) {
      versatilityStat = GOBLIN_KING_PASSIVE_VERSATILITY_STAT[level] || 0;
    }

    // Fetch Summon Probabilities
    const oddsData = calculateSummonOdds(level);
    const rates = oddsData.expectedRates;

    // Compute Weighted Averages
    let luckyStrikeMultPct = 0;
    let luckStat = 0;
    let luckEffectPct = 0;
    let mainStatPct = 0;
    let elemPct = 0;

    // Goblin Guard ignored (just gives block which is unsupported)

    // Goblin Warrior
    if (rates['Goblin Warrior']) {
      const rawVal = BUFF_DATA['Goblin Warrior'].luckyStrikeMultPct[level] || 0;
      luckyStrikeMultPct = rawVal * rates['Goblin Warrior'];
    }

    // Storm Goblin King
    if (rates['Storm Goblin King']) {
      const rawLuck = BUFF_DATA['Storm Goblin King'].luckStat[level] || 0;
      const rawEffect = BUFF_DATA['Storm Goblin King'].luckEffectPct[level] || 0;
      luckStat = rawLuck * rates['Storm Goblin King'];
      luckEffectPct = rawEffect * rates['Storm Goblin King'];
    }

    // Jungle Goblin Warrior
    if (rates['Jungle Goblin Warrior'] && mainStatType === 'str') {
      const rawVal = BUFF_DATA['Jungle Goblin Warrior'].mainStatPct[level] || 0;
      mainStatPct = rawVal * rates['Jungle Goblin Warrior'];
    }

    // Storm Goblin Warrior
    if (rates['Storm Goblin Warrior'] && elementType === 'wind') {
      const rawVal = BUFF_DATA['Storm Goblin Warrior'].elemPct[level] || 0;
      elemPct = rawVal * rates['Storm Goblin Warrior'];
    }

    return {
      versatilityStat,
      // Weighted active summon buffs
      luckyStrikeMultPct,
      luckStat,
      luckEffectPct,
      mainStatPct,
      elemPct
    };
  }
  function provideSkills(state) {
    if (state.imagine !== 'goblin-king') return [];

    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [210, 241.4, 273, 304.5, 336, 367.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 100 : level >= 3 ? 125 : 150;

    const sgk5Toggle = state.sgkT5 || false;

    const oddsData = calculateSummonOdds(level);
    const rates = oddsData.expectedRates;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }
    const passiveDamageMultipliers = [22.4, 29.12, 35.84, 42.56, 49.28, 56];
    const passiveDamageMultiplier = passiveDamageMultipliers[level] || passiveDamageMultipliers[0];


    const hitsPerParse = 5 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Goblin King (${level})`;
    const procSkillName = `Goblin King (${level}) passive proc (assuming 33% of lucky hits per parse)`;

    // Fetching lucky hit count
    const parentRow = document.querySelector('.breakdown-row[data-item-id="lucky-hit"]');
    const firstChild = parentRow.querySelector('div'); // Grabs the first child div
    const match = firstChild.textContent.match(/\(([^)]+)\)/);
    const luckyHitsCount = match ? parseInt(match[1], 10) : null;

    let guardHitsPerParse = 0;
    let warriorHitsPerParse = 0;
    let sgkHitsPerParse = 0;
    let jungleHitsPerParse = 0;
    let stormHitsPerParse = 0;

    // rates * hits per summon * casts per parse (Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown)))

    if (rates['Goblin Guard']) {
      guardHitsPerParse = Math.round(rates['Goblin Guard'] * 3 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown)));
    }
    const guardDmg = [200, 230, 260, 290, 320, 350];

    if (rates['Goblin Warrior']) {
      warriorHitsPerParse = Math.round(rates['Goblin Warrior'] * 4 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown)));
    }
    const warriorDmg = [225, 258.7, 292.5, 326.2, 360, 393.7];
    
    // Storm Goblin King
    if (rates['Storm Goblin King']) {
      sgkHitsPerParse = Math.round(rates['Storm Goblin King'] * 5 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown)));
    }
    const sgkDmg = [210, 241.4, 273, 304.5, 336, 367.5];

    // Jungle Goblin Warrior
    if (rates['Jungle Goblin Warrior']) {
      jungleHitsPerParse = Math.round(rates['Jungle Goblin Warrior'] * 1 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown)));
    }
    const jungleDmg = [750, 862.5, 975, 1087.5, 1200, 1312.5];

    // Storm Goblin Warrior
    if (rates['Storm Goblin Warrior']) {
      stormHitsPerParse = Math.round(rates['Storm Goblin Warrior'] * 10 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown)));
    }
    const stormDmg = [75, 86.2, 97.5, 108.7, 120, 131.2];

    const guardMultiplier = guardDmg[level] || guardDmg[0];
    const warriorMultiplier = warriorDmg[level] || warriorDmg[0];
    const sgkMultiplier = sgkDmg[level] || sgkDmg[0];
    const jungleMultiplier = jungleDmg[level] || jungleDmg[0];
    const stormMultiplier = stormDmg[level] || stormDmg[0];

    const guardName = `Goblin Guard (GK summon) (${level})`;
    const warriorName = `Goblin Warrior (GK summon) (${level})`;
    const sgkName = `Storm Goblin King (GK summon) (${level})`;
    const jungleName = `Jungle Goblin Warrior (GK summon) (${level})`;
    const stormName = `Storm Goblin Warrior (GK summon) (${level})`;

    const skills = [
      [
        'imagine',
        guardMultiplier,
        20,
        true,
        guardName,
        [
          ['damageType', 'physical'],
        ],
        guardHitsPerParse,
        0
      ],
      [
        'imagine',
        warriorMultiplier,
        22,
        true,
        warriorName,
        [
          ['damageType', 'physical'],
        ],
        warriorHitsPerParse,
        0
      ],
      [
        'imagine',
        jungleMultiplier,
        75,
        true,
        jungleName,
        [
          ['damageType', 'physical'],
        ],
        jungleHitsPerParse,
        0
      ],
      [
        'imagine',
        stormMultiplier,
        7,
        true,
        stormName,
        [
          ['damageType', 'physical'],
        ],
        stormHitsPerParse,
        0
      ],
      [ // sgk last for user to more easily find it
        'imagine',
        sgkMultiplier,
        21,
        true,
        sgkName,
        [
          ['damageType', 'magical'],
        ],
        sgkHitsPerParse,
        0
      ]
    ];

    const t5LuckPassiveHitsPerParse = 66 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const brigandPassiveHitsPerParse = 70 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));

    if (level === 5 && sgk5Toggle) {
      skills.push(
        [
          'imagine',
          28,
          0,
          false,
          'Goblin Warrior T5 passive (SGK proc), assuming 66 hits per SGK cast',
          [
            ['damageType', 'physical'],
            ['generic', ' luck-effect'],
          ],
          t5LuckPassiveHitsPerParse,
          0
        ],
        [
          'imagine',
          28,
          0,
          false,
          'Void Bzzar T5 passive (SGK proc), assuming 66 hits per SGK cast',
          [
            ['damageType', 'physical'],
            ['generic', ' luck-effect'],
          ],
          t5LuckPassiveHitsPerParse,
          0
        ],
        [
          'imagine',
          28,
          0,
          false,
          'LizardMan Hunter T5 passive (SGK proc), assuming 66 hits per SGK cast',
          [
            ['damageType', 'magical'],
            ['generic', ' luck-effect'],
          ],
          t5LuckPassiveHitsPerParse,
          0
        ],
        [
          'imagine',
          29.1,
          0,
          false,
          'Brigand Leader T0 passive (SGK proc), (extra hits added to simulate dots expiring damage) For other tiers: [29.1, 37.83, 46.56, 55.29, 64.02, 72.75]',
          [
            ['damageType', 'physical'],
            ['generic', ' luck-effect'],
          ],
          brigandPassiveHitsPerParse,
          0
        ]
      );
    }

    return skills;
  }
  function provideFormulaParts(kind, state) {
    if (kind !== 'elem') return '';
    const oddsData = calculateSummonOdds(state.level);
    const rates = oddsData.expectedRates;
    const rawVal = BUFF_DATA['Storm Goblin Warrior'].elemPct[state.level] || 0;
    const elemPct = rawVal * rates['Storm Goblin Warrior'];

    return `SGW (GK summon averaged value) ${elemPct.toFixed(2)}%`;
  }
  window.IMAGINES['goblin-king'] = { displayName: 'Goblin King', provideBonuses, provideSkills, provideFormulaParts };
})();