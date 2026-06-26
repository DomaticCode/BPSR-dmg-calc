(function(){

  // foxen bonus arrays
  const BLACKFIRE_FOXEN_PASSIVE_MASTERY_STAT = [5040, 6552, 8064, 9576, 11088, 12600];
  const BLACKFIRE_FOXEN_ACTIVE_MASTERY_PCT = [6.5, 7.8, 9.1, 10.4, 11.7, 13];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'blackfire-foxen') return {};
    const level = state.level;

    const masteryStat =BLACKFIRE_FOXEN_PASSIVE_MASTERY_STAT && state.applyPassiveStats
        ? BLACKFIRE_FOXEN_PASSIVE_MASTERY_STAT[level]
        : 0;

    const masteryPct = state.mode === 'active'
        ? (BLACKFIRE_FOXEN_ACTIVE_MASTERY_PCT?.[level] || 0)
        : 0;

    return { masteryStat, masteryPct };
  }

  function provideSkills(state) {
    if (state.imagine !== 'blackfire-foxen') return [];
    const level = Number.isFinite(state.level) ? state.level : 0;
    const damageMultipliers = [375, 431.2, 487.5, 543.7, 600, 656.2];
    const damageMultiplier = damageMultipliers[level] || damageMultipliers[0];
    const cooldown = level >= 5 ? 80 : level >= 3 ? 100 : 120;

    let parseDurationSeconds = 180;
    const parseDurationEl = document.getElementById('parse-duration');
    if (parseDurationEl) {
      const parsed = parseFloat(parseDurationEl.value);
      if (Number.isFinite(parsed) && parsed > 0) parseDurationSeconds = parsed;
    }

    const hitsPerParse = 2 * Math.max(1, Math.floor((parseDurationSeconds + cooldown) / cooldown));
    const skillName = `Blackfire Foxen (${level})`;
    return [[
      'imagine', // skill type
      damageMultiplier,
      37, // additional flat damage
      true, // can proc luck
      skillName,
      [
        ['damageType', 'physical'],
      ], // effects
      hitsPerParse,
      0 // collapsed or not
    ]];
  }
  window.IMAGINES['blackfire-foxen'] = { displayName: 'Blackfire Foxen', provideBonuses, provideSkills };
})();