(function(){

  // goblin warrior bonus arrays
  const GOBLIN_WARRIOR_ACTIVE_LUCK_STAT = [4480, 5376, 6272, 7168, 8064, 8960];
  const GOBLIN_WARRIOR_ACTIVE_LUCKY_STRIKE_MULT_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'goblin-warrior') return {};
    const level = state.level;

    let luckStat = 0;
    let luckyStrikeMultPct = 0;

    if (state.mode === 'active') {
      luckStat =
        GOBLIN_WARRIOR_ACTIVE_LUCK_STAT
          ? GOBLIN_WARRIOR_ACTIVE_LUCK_STAT[level]
          : 0;

      luckyStrikeMultPct =
        GOBLIN_WARRIOR_ACTIVE_LUCKY_STRIKE_MULT_PCT
          ? GOBLIN_WARRIOR_ACTIVE_LUCKY_STRIKE_MULT_PCT[level]
          : 0;
    }

    return { luckStat, luckyStrikeMultPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'goblin-warrior') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [225, 258.7, 292.5, 326.2, 360, 393.7];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const passiveDamageMultipliers = [11.2, 14.56, 17.92, 21.28, 24.64, 28];
    const passiveDamageMultiplier = passiveDamageMultipliers[level] || passiveDamageMultipliers[0];

    const hitsPerParse = 4 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Goblin Warrior (${level})`;
    const procSkillName = `Goblin Warrior (${level}) passive proc (assuming 66% of lucky hits per parse)`;
    // Fetching lucky hit count
    const parentRow = document.querySelector('.breakdown-row[data-item-id="lucky-hit"]');
    const firstChild = parentRow.querySelector('div'); // Grabs the first child div
    const match = firstChild.textContent.match(/\(([^)]+)\)/);
    const luckyHitsCount = match ? parseInt(match[1], 10) : null;

    const passiveHitsPerParse = Math.round(luckyHitsCount * 0.66);
    return [
      [
        'imagine',
        damageMultiplier,
        22,
        true,
        skillName,
        [
          ['damageType', 'physical'],
        ],
        hitsPerParse,
        0
      ],
      [
        'imagine(passive)',
        passiveDamageMultiplier,
        0,
        false,
        procSkillName,
        [
          ['damageType', 'physical luck-effect'],
        ],
        passiveHitsPerParse,
        0
      ]
    ];
  }
  window.IMAGINES['goblin-warrior'] = { displayName: 'Goblin Warrior', provideBonuses, provideSkills };
})();