(function(){

  // crab bonus arrays
  const PHANTOM_ARACHNOCRAB_PASSIVE_MASTERY_STAT = [3584, 4636, 5688, 6740, 7792, 8960];
  const PHANTOM_ARACHNOCRAB_ACTIVE_MASTERY_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'phantom-arachnocrab') return {};
    const level = state.level;

    const masteryStat = PHANTOM_ARACHNOCRAB_PASSIVE_MASTERY_STAT && state.applyPassiveStats
        ? PHANTOM_ARACHNOCRAB_PASSIVE_MASTERY_STAT[level]
        : 0;

    const masteryPct = state.mode === 'active'
        ? (PHANTOM_ARACHNOCRAB_ACTIVE_MASTERY_PCT?.[level] || 0)
        : 0;

    return { masteryStat, masteryPct };
  }
  window.IMAGINES['phantom-arachnocrab'] = { provideBonuses };
})();