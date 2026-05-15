(function(){

  const OLVERA_PASSIVE_MAIN_STAT_PER_LEVEL = [6.0, 7.8, 9.6, 11.4, 13.2, 15.0];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'olvera') return {};
    const level = state.level;

    const mainStatPct = 
    (OLVERA_PASSIVE_MAIN_STAT_PER_LEVEL && 
      OLVERA_PASSIVE_MAIN_STAT_PER_LEVEL[level]) || 0;

    return { mainStatPct };
  }
  window.IMAGINES['olvera'] = { provideBonuses };
})();