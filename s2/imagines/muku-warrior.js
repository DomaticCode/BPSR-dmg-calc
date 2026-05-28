(function(){

  // Muku warrior bonus arrays
  const MUKU_WARRIOR_ACTIVE_CRIT_STAT = [1792, 2150, 2508, 2867, 3225, 3584];
  const MUKU_WARRIOR_ACTIVE_CRIT_DMG = [8, 9.6, 11.2, 12.8, 14.4, 16];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'muku-warrior') return {};
    const level = state.level;

    const critStat =
      state.mode === 'active'
        ? (MUKU_WARRIOR_ACTIVE_CRIT_STAT?.[level] || 0)
        : 0;

    const critDmgPct =
      state.mode === 'active'
        ? (MUKU_WARRIOR_ACTIVE_CRIT_DMG?.[level] || 0)
        : 0;

    return { critStat, critDmgPct };
  }
  window.IMAGINES['muku-warrior'] = { provideBonuses };
})();