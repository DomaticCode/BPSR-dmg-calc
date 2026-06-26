(function(){

  // goblin chief bonus arrays
  const GOBLIN_CHIEF_PASSIVE_EXPERTISE_DMG_PCT = [9, 11.7, 14.4, 17.1, 19.8, 22.5];
  const GOBLIN_CHIEF_ACTIVE_EXPERTISE_DMG_PCT = [22, 26.4, 30.8, 35.2, 39.6, 44];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'goblin-chief') return {};

    const level = state.level;

    const passive = GOBLIN_CHIEF_PASSIVE_EXPERTISE_DMG_PCT
        ? GOBLIN_CHIEF_PASSIVE_EXPERTISE_DMG_PCT[level]
        : 0;

    const active = state.mode === 'active'
        ? (GOBLIN_CHIEF_ACTIVE_EXPERTISE_DMG_PCT?.[level] || 0)
        : 0;

    const expertiseDmgPct = passive + active;

    return { expertiseDmgPct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'goblin-chief') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [1500, 1725, 1950, 2175, 2400, 2625];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 1 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Goblin Chief (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      150,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['goblin-chief'] = { displayName: 'Goblin Chief', provideBonuses, provideSkills };
})();