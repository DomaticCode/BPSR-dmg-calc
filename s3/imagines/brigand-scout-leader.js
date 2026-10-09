(function(){

  const B_S_L_PASSIVE_MAIN_STAT_PCT = [4, 5.2, 6.4, 7.6, 8.8, 10.0];
  const B_S_L_ACTIVE_MAIN_STAT_PCT = [10, 12, 14, 16, 18, 20];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'brigand-scout-leader') return {};

    const level = state.level;
    let mainStatPct = 0;
    if (getClassMainStatType() === 'agi') {
      const passive = B_S_L_PASSIVE_MAIN_STAT_PCT
          ? B_S_L_PASSIVE_MAIN_STAT_PCT[level]
          : 0;

      const active = state.mode === 'active'
          ? (B_S_L_ACTIVE_MAIN_STAT_PCT?.[level] || 0)
          : 0;

      mainStatPct = passive + active;
    }

    return { mainStatPct };
  }

  function provideSkills(state) {
    if (state.imagine !== 'brigand-scout-leader') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [250, 287.5, 325, 362.5, 400, 437.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 3 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Brigand Scout Leader (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      25,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['brigand-scout-leader'] = { displayName: 'Brigand Scout Leader', provideBonuses, provideSkills };
})();