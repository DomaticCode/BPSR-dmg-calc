(function(){

  // lizard bonus arrays
  const BLUESPINE_LIZARD_PASSIVE_VERSATILITY_STAT = [2016, 2615, 3214, 3813, 4412, 5040];
  const BLUESPINE_LIZARD_ACTIVE_VERSATILITY_PCT = [6.5, 7.8, 9.1, 10.4, 11.7, 13];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'bluespine-lizard') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const passiveStatsEl = document.getElementById(`imagine-${slot}-passive-stats`);
    const applyPassiveStats = passiveStatsEl ? passiveStatsEl.checked : false;
    const versatilityStat = BLUESPINE_LIZARD_PASSIVE_VERSATILITY_STAT ? BLUESPINE_LIZARD_PASSIVE_VERSATILITY_STAT[level] : 0;
    const versatilityPct = (mode === 'active') ? ((BLUESPINE_LIZARD_ACTIVE_VERSATILITY_PCT && BLUESPINE_LIZARD_ACTIVE_VERSATILITY_PCT[level]) || 0) : 0;
    const bonuses = {};
    if (applyPassiveStats) {
      bonuses.versatilityStat = versatilityStat;
    }
    if (mode === 'active') {
      bonuses.versatilityPct = versatilityPct;
    }
    return bonuses;
  }
  window.IMAGINES['bluespine-lizard'] = { provideBonuses };
})();