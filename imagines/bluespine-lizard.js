(function(){

  // lizard bonus arrays
  const BLUESPINE_LIZARD_PASSIVE_VERSATILITY_STAT = [2016, 2615, 3214, 3813, 4412, 5040];
  const BLUESPINE_LIZARD_ACTIVE_VERSATILITY_PCT = [6.5, 7.8, 9.1, 10.4, 11.7, 13];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'bluespine-lizard') return {};
    const level = state.level;

    const versatilityStat = BLUESPINE_LIZARD_PASSIVE_VERSATILITY_STAT && state.applyPassiveStats
        ? BLUESPINE_LIZARD_PASSIVE_VERSATILITY_STAT[level]
        : 0;

    const versatilityPct = state.mode === 'active'
        ? (BLUESPINE_LIZARD_ACTIVE_VERSATILITY_PCT?.[level] || 0)
        : 0;

    return { versatilityStat, versatilityPct };
  }
  window.IMAGINES['bluespine-lizard'] = { provideBonuses };
})();