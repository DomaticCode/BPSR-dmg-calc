(function(){

  // CF bonus arrays
  const CELESTIAL_FLIER_PASSIVE_HASTE_STAT = [3584, 4636, 5688, 6740, 7792, 8960];
  const CELESTIAL_FLIER_ACTIVE_HASTE_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'celestial-flier') return {};
    const level = state.level;

    const hasteStat = CELESTIAL_FLIER_PASSIVE_HASTE_STAT && state.applyPassiveStats
        ? CELESTIAL_FLIER_PASSIVE_HASTE_STAT[level]
        : 0;

    const hastePct = state.mode === 'active'
        ? (CELESTIAL_FLIER_ACTIVE_HASTE_PCT?.[level] || 0)
        : 0;

    return { hasteStat, hastePct };
  }
  window.IMAGINES['celestial-flier'] = { provideBonuses };
})();