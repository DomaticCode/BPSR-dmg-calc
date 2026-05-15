(function(){

  // capra bonus arrays
  const EMERALD_CAPRAHORN_PASSIVE_HASTE_STAT = [2016, 2615, 3214, 3813, 4412, 5040];
  const EMERALD_CAPRAHORN_ACTIVE_HASTE_PCT = [6.5, 7.8, 9.1, 10.4, 11.7, 13];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(state) {
    if (state.imagine !== 'emerald-caprahorn') return {};
    const level = state.level;

    const hasteStat = EMERALD_CAPRAHORN_PASSIVE_HASTE_STAT && state.applyPassiveStats
        ? EMERALD_CAPRAHORN_PASSIVE_HASTE_STAT[level]
        : 0;

    const hastePct = state.mode === 'active'
        ? (EMERALD_CAPRAHORN_ACTIVE_HASTE_PCT?.[level] || 0)
        : 0;

    return { hasteStat, hastePct };
  }
  window.IMAGINES['emerald-caprahorn'] = { provideBonuses };
})();