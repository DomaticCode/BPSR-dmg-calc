(function(){

  // NOTE: unknown if the luck effect bonus is flat, or if it is luck effect * 1.xx, Smite weapon is just flat 15% but worded differently (Lucky Strike DMG % vs Luck Effect Bonus)
  // sgk bonus arrays
  const STORM_GOBLIN_KING_ACTIVE_LUCK_STAT = [2240, 2688, 3136, 3584, 4032, 4480];
  const STORM_GOBLIN_KING_ACTIVE_LUCK_EFFECT_PCT = [16, 19.2, 22.4, 25.6, 28.8, 32];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'storm-goblin-king') return {};
    const level = state.level;

    const luckStat = state.mode === 'active'
        ? (STORM_GOBLIN_KING_ACTIVE_LUCK_STAT?.[level] || 0)
        : 0;

    const luckEffectPct = state.mode === 'active'
        ? (STORM_GOBLIN_KING_ACTIVE_LUCK_EFFECT_PCT?.[level] || 0)
        : 0;

    return { luckStat, luckEffectPct };
  }
  window.IMAGINES['storm-goblin-king'] = { provideBonuses };
})();