(function(){

  // lizardman hunter bonus arrays
  const LIZARDMAN_HUNTER_ACTIVE_LUCK_STAT = [4480, 5376, 6272, 7168, 8064, 8960];
  const LIZARDMAN_HUNTER_ACTIVE_LUCKY_STRIKE_MULT_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'lizardman-hunter') return {};
    const level = state.level;

    let luckStat = 0;
    let luckyStrikeMultPct = 0;

    if (state.mode === 'active') {
      luckStat =
        LIZARDMAN_HUNTER_ACTIVE_LUCK_STAT
          ? LIZARDMAN_HUNTER_ACTIVE_LUCK_STAT[level]
          : 0;

      luckyStrikeMultPct =
        LIZARDMAN_HUNTER_ACTIVE_LUCKY_STRIKE_MULT_PCT
          ? LIZARDMAN_HUNTER_ACTIVE_LUCKY_STRIKE_MULT_PCT[level]
          : 0;
    }

    return { luckStat, luckyStrikeMultPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'lizardman-hunter') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [650, 747.5, 845, 942.5, 1040, 1137.5];
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

    const hitsPerParse = 1 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Lizardman Hunter (${level})`;
    const procSkillName = `Lizardman Hunter (${level}) passive proc (assuming 66% of lucky hits per parse)`;

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
        65,
        true,
        skillName,
        [
          ['damageType', 'magical'],
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
          ['damageType', 'magical luck-effect'],
        ],
        passiveHitsPerParse,
        0
      ]
    ];
  }
  window.IMAGINES['lizardman-hunter'] = {displayName: 'Lizardman Hunter', provideBonuses, provideSkills };
})();