(function(){

  const DOROTHY_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'dorothy') return {};
    const level = state.level;

    const mainStatPct = 
    (DOROTHY_PASSIVE_MAIN_STAT_PER_LEVEL && DOROTHY_PASSIVE_MAIN_STAT_PER_LEVEL[level] && state.applyPassiveStats
      ? DOROTHY_PASSIVE_MAIN_STAT_PER_LEVEL[level] : 0) || 0;

    return { mainStatPct };
  }
  window.IMAGINES['dorothy'] = { provideBonuses };
})();