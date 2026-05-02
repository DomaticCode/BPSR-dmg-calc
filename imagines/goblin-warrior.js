(function(){

  // goblin warrior bonus arrays
  const GOBLIN_WARRIOR_ACTIVE_LUCK_STAT = [1792, 2150, 2508, 2867, 3225, 3584];
  const GOBLIN_WARRIOR_ACTIVE_LUCKY_STRIKE_MULT_PCT = [10, 12, 14, 16, 18, 20];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'goblin-warrior') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';

    let luckStat = 0;
    let luckMultPct = 0;
    if (mode === 'active') {
      luckStat = GOBLIN_WARRIOR_ACTIVE_LUCK_STAT ? GOBLIN_WARRIOR_ACTIVE_LUCK_STAT[level] : 0;
      luckyStrikeMultPct = GOBLIN_WARRIOR_ACTIVE_LUCKY_STRIKE_MULT_PCT ? GOBLIN_WARRIOR_ACTIVE_LUCKY_STRIKE_MULT_PCT[level] : 0;
    }

    return { luckStat, luckyStrikeMultPct };
  }
  window.IMAGINES['goblin-warrior'] = { provideBonuses };
})();