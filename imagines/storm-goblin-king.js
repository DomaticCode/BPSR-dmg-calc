(function(){

  // NOTE: unknown if the luck effect bonus is flat, or if it is luck effect * 1.xx, Smite weapon is just flat 15% but worded differently (Lucky Strike DMG % vs Luck Effect Bonus)
  // sgk bonus arrays
  const STORM_GOBLIN_KING_ACTIVE_LUCK_STAT = [2240, 2688, 3136, 3584, 4032, 4480];
  const STORM_GOBLIN_KING_ACTIVE_LUCK_EFFECT_PCT = [16, 19.2, 22.4, 25.6, 28.8, 32];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'storm-goblin-king') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const passiveStatsEl = document.getElementById(`imagine-${slot}-passive-stats`);
    const applyPassiveStats = passiveStatsEl ? passiveStatsEl.checked : false;
    const luckStat = (mode === 'active') ? ((STORM_GOBLIN_KING_ACTIVE_LUCK_STAT && STORM_GOBLIN_KING_ACTIVE_LUCK_STAT[level]) || 0) : 0;
    const luckEffectPct = (mode === 'active') ? ((STORM_GOBLIN_KING_ACTIVE_LUCK_EFFECT_PCT && STORM_GOBLIN_KING_ACTIVE_LUCK_EFFECT_PCT[level]) || 0) : 0;

    return {luckStat, luckEffectPct};
  }
  window.IMAGINES['storm-goblin-king'] = { provideBonuses };
})();