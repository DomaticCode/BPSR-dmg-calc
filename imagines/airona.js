(function(){

  const AIRONA_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'airona') return {};
    const level = state.level;

    const mainStatPct = 
    (AIRONA_PASSIVE_MAIN_STAT_PER_LEVEL && AIRONA_PASSIVE_MAIN_STAT_PER_LEVEL[level] && state.applyPassiveStats
      ? AIRONA_PASSIVE_MAIN_STAT_PER_LEVEL[level] : 0) || 0;

    return { mainStatPct };
  }
  window.IMAGINES['airona'] = { provideBonuses };
})();