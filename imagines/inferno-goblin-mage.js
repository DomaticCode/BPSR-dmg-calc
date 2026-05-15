(function(){

  const I_G_M_PASSIVE_MAIN_STAT_PCT = [4, 5.2, 6.4, 7.6, 8.8, 10.0];
  const I_G_M_ACTIVE_MAIN_STAT_PCT = [10, 12, 14, 16, 18, 20];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'inferno-goblin-mage') return {};

    const level = state.level;

    const passive = I_G_M_PASSIVE_MAIN_STAT_PCT
        ? I_G_M_PASSIVE_MAIN_STAT_PCT[level]
        : 0;

    const active = state.mode === 'active'
        ? (I_G_M_ACTIVE_MAIN_STAT_PCT?.[level] || 0)
        : 0;

    const mainStatPct = passive + active;

    return { mainStatPct };
  }
  window.IMAGINES['inferno-goblin-mage'] = { provideBonuses };
})();