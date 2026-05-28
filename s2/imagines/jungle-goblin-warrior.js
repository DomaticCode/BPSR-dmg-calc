(function(){

  const J_G_W_PASSIVE_MAIN_STAT_PCT = [4, 5.2, 6.4, 7.6, 8.8, 10.0];
  const J_G_W_ACTIVE_MAIN_STAT_PCT = [10, 12, 14, 16, 18, 20];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'jungle-goblin-warrior') return {};

    const level = state.level;

    const passive = J_G_W_PASSIVE_MAIN_STAT_PCT
        ? J_G_W_PASSIVE_MAIN_STAT_PCT[level]
        : 0;

    const active = state.mode === 'active'
        ? (J_G_W_ACTIVE_MAIN_STAT_PCT?.[level] || 0)
        : 0;

    const mainStatPct = passive + active;

    return { mainStatPct };
  }
  window.IMAGINES['jungle-goblin-warrior'] = { provideBonuses };
})();