(function(){

  // capra bonus arrays
  const EMERALD_CAPRAHORN_PASSIVE_HASTE_STAT = [2016, 2615, 3214, 3813, 4412, 5040];
  const EMERALD_CAPRAHORN_ACTIVE_HASTE_PCT = [6.5, 7.8, 9.1, 10.4, 11.7, 13];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'emerald-caprahorn') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const passiveStatsEl = document.getElementById(`imagine-${slot}-passive-stats`);
    const applyPassiveStats = passiveStatsEl ? passiveStatsEl.checked : false;
    const hasteStat = EMERALD_CAPRAHORN_PASSIVE_HASTE_STAT ? EMERALD_CAPRAHORN_PASSIVE_HASTE_STAT[level] : 0;
    const hastePct = (mode === 'active') ? ((EMERALD_CAPRAHORN_ACTIVE_HASTE_PCT && EMERALD_CAPRAHORN_ACTIVE_HASTE_PCT[level]) || 0) : 0;
    const bonuses = {};
    if (applyPassiveStats) {
      bonuses.hasteStat = hasteStat;
    }
    if (mode === 'active') {
      bonuses.hastePct = hastePct;
    }
    return bonuses;
  }
  window.IMAGINES['emerald-caprahorn'] = { provideBonuses };
})();