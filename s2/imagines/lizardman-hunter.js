(function(){

  // lizardman hunter bonus arrays
  const LIZARDMAN_HUNTER_ACTIVE_LUCK_STAT = [1792, 2150, 2508, 2867, 3225, 3584];
  const LIZARDMAN_HUNTER_ACTIVE_LUCKY_STRIKE_MULT_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'lizardman-hunter') return {};
    const level = state.level;

    let luckStat = 0;
    let luckyStrikeMultPct = 0;

    if (state.mode === 'active') {
      luckStat =
        LIZARDMAN_HUNTER_ACTIVE_LUCK_STAT
          ? LIZARDMAN_HUNTER_ACTIVE_LUCK_STAT[level]
          : 0;

      luckyStrikeMultPct =
        LIZARDMAN_HUNTER_ACTIVE_LUCKY_STRIKE_MULT_PCT
          ? LIZARDMAN_HUNTER_ACTIVE_LUCKY_STRIKE_MULT_PCT[level]
          : 0;
    }

    return { luckStat, luckyStrikeMultPct };
  }
  window.IMAGINES['lizardman-hunter'] = { provideBonuses };
})();