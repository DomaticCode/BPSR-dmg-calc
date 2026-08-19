(function(){

  // Main stat passive, more main stat on active.
  const KARTGRIFF_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];
  const KARTGRIFF_ACTIVE_MAIN_STAT_BOOST = [7.5, 9.0, 10.5, 12.0, 13.5, 15.0];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    let mainStatPct = 
    (KARTGRIFF_PASSIVE_MAIN_STAT_PER_LEVEL && KARTGRIFF_PASSIVE_MAIN_STAT_PER_LEVEL[state.level] && state.applyPassiveStats
      ? KARTGRIFF_PASSIVE_MAIN_STAT_PER_LEVEL[state.level] : 0) || 0;

    mainStatPct += state.mode === 'active'
        ? (KARTGRIFF_ACTIVE_MAIN_STAT_BOOST[state.level] || 0)
        : 0;

    return {
      mainStatPct
    };
  }
  function provideSkills(state) {
    if (state.imagine !== 'kartgriff') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [1050, 1207.4, 1365, 1522.5, 16980, 1837.5];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 1 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Kartgriff (${level})`;
    return [[
      'imagine',
      damageMultiplier,
      105,
      true,
      skillName,
      [
        ['damageType', 'physical'],
      ],
      hitsPerParse,
      0
    ]];
  }
  window.IMAGINES['kartgriff'] = { displayName: 'Kartgriff', provideBonuses, provideSkills };
})();