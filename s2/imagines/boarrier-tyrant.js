(function(){

  // boar bonus arrays
  const BOARRIER_TYRANT_PASSIVE_SPECIAL_DMG_PCT = [6, 7.8, 9.6, 11.4, 13.2, 15];
  const BOARRIER_TYRANT_ACTIVE_SPECIAL_DMG_PCT = [16, 19.2, 22.4, 25.6, 28.8, 32];


  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'boarrier-tyrant') return {};
    const level = state.level;

    const passive = BOARRIER_TYRANT_PASSIVE_SPECIAL_DMG_PCT
        ? BOARRIER_TYRANT_PASSIVE_SPECIAL_DMG_PCT[level]
        : 0;

    const active = state.mode === 'active'
        ? (BOARRIER_TYRANT_ACTIVE_SPECIAL_DMG_PCT?.[level] || 0)
        : 0;

    const specialDmgPct = passive + active;

    return { specialDmgPct };
  }
  window.IMAGINES['boarrier-tyrant'] = { provideBonuses };
})();