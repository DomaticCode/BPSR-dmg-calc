(function(){

  // foxen bonus arrays
  const BLACKFIRE_FOXEN_PASSIVE_MASTERY_STAT = [2016, 2615, 3214, 3813, 4412, 5040];
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
  window.IMAGINES['blackfire-foxen'] = { provideBonuses };
})();