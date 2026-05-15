(function(){

  // goblin warrior bonus arrays
  const GOBLIN_WARRIOR_ACTIVE_LUCK_STAT = [1792, 2150, 2508, 2867, 3225, 3584];
  const GOBLIN_WARRIOR_ACTIVE_LUCKY_STRIKE_MULT_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'goblin-warrior') return {};
    const level = state.level;

    let luckStat = 0;
    let luckyStrikeMultPct = 0;

    if (state.mode === 'active') {
      luckStat =
        GOBLIN_WARRIOR_ACTIVE_LUCK_STAT
          ? GOBLIN_WARRIOR_ACTIVE_LUCK_STAT[level]
          : 0;

      luckyStrikeMultPct =
        GOBLIN_WARRIOR_ACTIVE_LUCKY_STRIKE_MULT_PCT
          ? GOBLIN_WARRIOR_ACTIVE_LUCKY_STRIKE_MULT_PCT[level]
          : 0;
    }

    return { luckStat, luckyStrikeMultPct };
  }
  window.IMAGINES['goblin-warrior'] = { provideBonuses };
})();