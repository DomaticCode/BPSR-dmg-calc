(function(){

  const NATSU_PASSIVE_ATK_PER_LEVEL = [7.2, 9.36, 11.52, 13.68, 15.84, 18.0];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'natsu') return {};
    const level = state.level;

    const matkPct = 
    (NATSU_PASSIVE_ATK_PER_LEVEL && NATSU_PASSIVE_ATK_PER_LEVEL[level] && state.applyPassiveStats
      ? NATSU_PASSIVE_ATK_PER_LEVEL[level] : 0) || 0;

    return { matkPct };
  }
  window.IMAGINES['natsu'] = { displayName: 'Natsu', provideBonuses };
})();