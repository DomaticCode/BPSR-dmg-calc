(function(){

  // foxen bonus arrays
  const BLACKFIRE_FOXEN_PASSIVE_MASTERY_STAT = [2016, 2615, 3214, 3813, 4412, 5040];
  const BLACKFIRE_FOXEN_ACTIVE_MASTERY_PCT = [6.5, 7.8, 9.1, 10.4, 11.7, 13];

  window.IMAGINES = window.IMAGINES || {};
  function provideBonuses(slot) {
    const sel = document.getElementById(`imagine-${slot}`);
    if (!sel || sel.value !== 'blackfire-foxen') return {};
    const levelEl = document.getElementById(`imagine-${slot}-level`);
    const level = levelEl ? parseInt(levelEl.value) : 0;
    const modeEl = document.querySelector(`input[name="imagine-${slot}-mode"]:checked`);
    const mode = modeEl ? modeEl.value : 'passive';
    const passiveStatsEl = document.getElementById(`imagine-${slot}-passive-stats`);
    const applyPassiveStats = passiveStatsEl ? passiveStatsEl.checked : false;
    const masteryStat = BLACKFIRE_FOXEN_PASSIVE_MASTERY_STAT ? BLACKFIRE_FOXEN_PASSIVE_MASTERY_STAT[level] : 0;
    const masteryPct = (mode === 'active') ? ((BLACKFIRE_FOXEN_ACTIVE_MASTERY_PCT && BLACKFIRE_FOXEN_ACTIVE_MASTERY_PCT[level]) || 0) : 0;
    const bonuses = {};
    if (applyPassiveStats) {
      bonuses.masteryStat = masteryStat;
    }
    if (mode === 'active') {
      bonuses.masteryPct = masteryPct;
    }
    return bonuses;
  }
  window.IMAGINES['blackfire-foxen'] = { provideBonuses };
})();