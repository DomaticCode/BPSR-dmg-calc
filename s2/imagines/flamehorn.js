(function(){

  // Flamehorn lucky strike DMG boost by level
  const FLAMEHORN_BOOST = [8, 10.4, 12.8, 15.2, 17.6, 20];
  const FLAMEHORN_LUCK_STAT = [2240, 2912, 3584, 4256, 4928, 5600];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'flamehorn') return {};
    const level = state.level;
    let luckStat = 0;

    if (state.applyPassiveStats) {
      luckStat = (FLAMEHORN_LUCK_STAT && FLAMEHORN_LUCK_STAT[level]) || 0;
    }

    const boost = (FLAMEHORN_BOOST && FLAMEHORN_BOOST[level]) || 0;

    return { luckStat, flamehornBoost: boost};
  }
  window.IMAGINES['flamehorn'] = { provideBonuses };
})();