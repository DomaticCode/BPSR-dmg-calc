(function(){

  // capra bonus arrays
  const EMERALD_CAPRAHORN_PASSIVE_HASTE_STAT = [5040, 6552, 8064, 9576, 11088, 12600];
  const EMERALD_CAPRAHORN_ACTIVE_HASTE_PCT = [6.5, 7.8, 9.1, 10.4, 11.7, 13];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'emerald-caprahorn') return {};
    const level = state.level;

    const hasteStat = EMERALD_CAPRAHORN_PASSIVE_HASTE_STAT && state.applyPassiveStats
        ? EMERALD_CAPRAHORN_PASSIVE_HASTE_STAT[level]
        : 0;

    const hastePct = state.mode === 'active'
        ? (EMERALD_CAPRAHORN_ACTIVE_HASTE_PCT?.[level] || 0)
        : 0;

    return { hasteStat, hastePct };
  }
  function provideSkills(state) {
    if (state.imagine !== 'emerald-caprahorn') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [375, 403.12, 431.25, 515.62, 543.75, 571.87];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 2 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Emerald Caprahorn (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      37,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['emerald-caprahorn'] = { displayName: 'Emerald Caprahorn', provideBonuses, provideSkills };
})();